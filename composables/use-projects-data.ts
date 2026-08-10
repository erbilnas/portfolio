import { sponsoredApps } from "~/constants/sponsored-apps";
import type { Project } from "~/types/projects";

const normalizeProjectId = (value: string) =>
  value.toLowerCase().replace(/[\s-_]/g, "");

export const useProjectsData = () => {
  const { t, te } = useI18n();
  const { data, pending, error } = useFetch<
    Project[] | { status: number; message: string }
  >("/api/github/repos");

  const sponsoredIds = computed(() => {
    const ids = new Set<string>();
    for (const app of sponsoredApps) {
      ids.add(normalizeProjectId(app.id));
      const nameKey = `projects.apps.${app.id}.name`;
      if (te(nameKey)) {
        ids.add(normalizeProjectId(t(nameKey)));
      }
    }
    return ids;
  });

  const projects = computed<Project[]>(() => {
    if (!data.value || "status" in data.value) return [];

    const blocked = sponsoredIds.value;
    return data.value.filter(
      (project) =>
        !blocked.has(normalizeProjectId(project.key)) &&
        !blocked.has(normalizeProjectId(project.name)),
    );
  });

  return {
    projects,
    pending,
    error,
  };
};
