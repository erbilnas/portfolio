interface GitHubUserResponse {
  login: string;
  public_repos: number;
}

interface ContributionsCollectionResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        totalIssueContributions: number;
        contributionCalendar: {
          totalContributions: number;
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const parseUsernameFromUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  try {
    const match = url.match(/github\.com\/([^/?#]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
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

    // Fetch user profile (REST API)
    const userResponse = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      { headers },
    );

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        setResponseStatus(event, 404);
        return {
          status: 404,
          message: "GitHub user not found",
        };
      }
      throw new Error(`GitHub API error: ${userResponse.status}`);
    }

    const userData = (await userResponse.json()) as GitHubUserResponse;

    // Fetch contributions (GraphQL API)
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const graphqlQuery = {
      query: `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalPullRequestContributions
              totalIssueContributions
              contributionCalendar {
                totalContributions
              }
            }
          }
        }
      `,
      variables: {
        username,
        from: startOfYear.toISOString(),
        to: now.toISOString(),
      },
    };

    const graphqlHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "portfolio-app",
    };
    if (token) {
      graphqlHeaders.Authorization = `Bearer ${token}`;
    }

    const graphqlResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: graphqlHeaders,
      body: JSON.stringify(graphqlQuery),
    });

    if (!graphqlResponse.ok) {
      throw new Error(`GitHub GraphQL error: ${graphqlResponse.status}`);
    }

    const graphqlData =
      (await graphqlResponse.json()) as ContributionsCollectionResponse;

    if (graphqlData.errors?.length) {
      throw new Error(graphqlData.errors[0]?.message ?? "GraphQL error");
    }

    const collection = graphqlData.data?.user?.contributionsCollection ?? null;

    return {
      username: userData.login,
      publicRepos: userData.public_repos,
      totalContributions:
        collection?.contributionCalendar?.totalContributions ?? 0,
      commits: collection?.totalCommitContributions ?? 0,
      pullRequests: collection?.totalPullRequestContributions ?? 0,
      issues: collection?.totalIssueContributions ?? 0,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "GitHub service is not available at this time",
    };
  }
});
