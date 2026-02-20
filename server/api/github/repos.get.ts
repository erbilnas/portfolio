import type { Project } from "~/types/projects";
import type { GitHubRepo } from "~/types/github";

const parseUsernameFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const match = url.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
};

const mapRepoToProject = (repo: GitHubRepo): Project => {
  const tech = repo.topics?.length
    ? repo.topics
    : repo.language
      ? [repo.language]
      : [];

  return {
    key: repo.name.toLowerCase().replace(/\s+/g, "-"),
    name: repo.name,
    description: repo.description || "No description",
    tech,
    features: [],
    github: repo.html_url,
    visit: repo.homepage || undefined,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const githubConfig = config.github as
      | { username?: string; token?: string }
      | undefined;
    const githubProfileUrl = process.env.GITHUB_PROFILE_URL;

    const username =
      githubConfig?.username || parseUsernameFromUrl(githubProfileUrl);

    if (!username) {
      setResponseStatus(event, 400);
      return {
        status: 400,
        message: "GitHub username is not configured",
      };
    }

    const token = githubConfig?.token;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "portfolio-app",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
    );
    url.searchParams.set("per_page", "100");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("type", "sources");

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      if (response.status === 404) {
        setResponseStatus(event, 404);
        return {
          status: 404,
          message: "GitHub user not found",
        };
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos = (await response.json()) as GitHubRepo[];
    const projects: Project[] = repos.map(mapRepoToProject);

    return projects;
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "GitHub service is not available at this time",
    };
  }
});
