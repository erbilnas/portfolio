import type { Project } from "~/types/projects";
import { projectsList } from "~/constants/projects";

export const useProjectsData = () => {
  const {
    data: projectsData,
    pending,
    error,
  } = useFetch<Project[] | { status: number; message: string }>(
    "/api/github/repos",
  );

  const projects = computed<Project[]>(() => {
    const data = projectsData.value;
    if (!data) return [];
    if ("status" in data) return projectsList;
    return data;
  });

  return {
    projects,
    pending,
    error,
  };
};
