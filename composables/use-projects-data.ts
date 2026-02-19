import type { Project } from "~/types/projects";

export const useProjectsData = () => {
  const { data, pending, error } = useFetch<
    Project[] | { status: number; message: string }
  >("/api/github/repos");

  const projects = computed<Project[]>(() => {
    if (!data.value || "status" in data.value) return [];

    return data.value;
  });

  return {
    projects,
    pending,
    error,
  };
};
