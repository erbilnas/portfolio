// Removed howlongtobeat library import - using direct API instead

type GameStatus = "playing" | "completed";
type GameSortBy = "date_complete" | "date_updated" | "alpha";
interface GameResponse {
  data: {
    gamesList: GameItem[];
  };
}

interface GameItem {
  game_id: number;
  custom_title: string;
  platform: string;
  invested_pro: number;
  play_storefront: string;
}

interface GameDetails {
  title: string;
  platform: string;
  image: string;
  storefront: string;
  description: string;
  progress?: string;
  status?: GameStatus;
  completion_time?: number;
}

interface GameRequestParams {
  status: GameStatus;
  sortBy: GameSortBy;
}

const RELEASE_CHART_LABELS = [
  "Pre-1990",
  "1990-1999",
  "2000-2009",
  "2010+",
] as const;

interface HLTBStatsResponse {
  userStatsSummary?: {
    investedSpAll?: number;
    investedCoAll?: number;
    investedMpAll?: number;
    playthroughCount?: { totalCompletions?: number };
    platformTotal?: number;
    releaseChart?: number[];
  };
}

const { howlongtobeat } = useRuntimeConfig();

const headers = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
  Origin: "https://howlongtobeat.com",
  Referer: "https://howlongtobeat.com/",
  "x-nextjs-data": "1",
} as const;

const default_request_body = {
  user_id: 82755,
  set_playstyle: "comp_plus",
  name: "",
  platform: "",
  storefront: "",
  sortFlip: 0,
  view: "blox",
  random: 0,
  limit: 102,
  currentUserHome: false,
} as const;

const fetchGames = async ({
  status,
  sortBy,
}: GameRequestParams): Promise<GameResponse> => {
  try {
    const response = await fetch(howlongtobeat.api, {
      method: "POST",
      headers,
      body: JSON.stringify({
        ...default_request_body,
        lists: [status],
        sortBy,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      throw new Error("API did not return JSON");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching games:", error);
    throw error;
  }
};

const getBuildId = async (): Promise<string | null> => {
  try {
    const response = await fetch("https://howlongtobeat.com/", {
      headers: {
        "User-Agent": headers["User-Agent"],
        Accept: "text/html",
      },
    });
    const html = await response.text();

    // Try multiple patterns to extract build ID
    const patterns = [
      /__NEXT_DATA__[^>]*"buildId":"([^"]+)"/,
      /_next\/data\/([^/]+)\//,
      /"buildId":"([^"]+)"/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  } catch (error) {
    console.warn("Failed to fetch build ID:", error);
    return null;
  }
};

const fetchGameDetailsFromHTML = async (
  gameId: number
): Promise<{
  imageUrl?: string;
  description?: string;
  gameplayMainExtra?: number;
} | null> => {
  try {
    const url = `https://howlongtobeat.com/game/${gameId}`;

    const response = await fetch(url, {
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
        "User-Agent": headers["User-Agent"],
      },
    });

    if (!response.ok) {
      console.warn(
        `HTML fetch returned status ${response.status} for game_id ${gameId}`
      );
      return null;
    }

    const html = await response.text();

    // Extract __NEXT_DATA__ from HTML
    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/
    );
    if (!nextDataMatch) {
      console.warn("Could not find __NEXT_DATA__ in HTML");
      return null;
    }

    const nextData = JSON.parse(nextDataMatch[1]);

    return extractGameData(nextData);
  } catch (error) {
    console.warn(
      `Failed to fetch game details from HTML for game_id ${gameId}:`,
      error
    );
    if (error instanceof Error) {
      console.warn(`Error message: ${error.message}`);
    }
    return null;
  }
};

const fetchGameDetailsFromAPI = async (
  gameId: number
): Promise<{
  imageUrl?: string;
  description?: string;
  gameplayMainExtra?: number;
} | null> => {
  try {
    // Try to get build ID dynamically
    let buildId = await getBuildId();
    if (!buildId) {
      // Fallback to the build ID from your example
      buildId = "pFldtozODRHtbKOIk5_Lb";
    }

    const url = `https://howlongtobeat.com/_next/data/${buildId}/game/${gameId}.json?gameId=${gameId}`;

    const response = await fetch(url, {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
        "User-Agent": headers["User-Agent"],
        Referer: `https://howlongtobeat.com/game/${gameId}`,
        "x-nextjs-data": "1",
      },
    });

    if (!response.ok) {
      console.warn(
        `API returned status ${response.status} for game_id ${gameId}`
      );

      // If 404, try with a fresh build ID fetch
      if (response.status === 404) {
        const freshBuildId = await getBuildId();
        if (freshBuildId && freshBuildId !== buildId) {
          const retryUrl = `https://howlongtobeat.com/_next/data/${freshBuildId}/game/${gameId}.json?gameId=${gameId}`;
          const retryResponse = await fetch(retryUrl, {
            headers: {
              Accept: "*/*",
              "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
              "User-Agent": headers["User-Agent"],
              Referer: `https://howlongtobeat.com/game/${gameId}`,
              "x-nextjs-data": "1",
            },
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            return extractGameData(retryData);
          }
        }
      }

      // Fallback to HTML parsing if API fails
      return fetchGameDetailsFromHTML(gameId);
    }

    const data = await response.json();

    return extractGameData(data);
  } catch (error) {
    console.warn(`Failed to fetch game details for game_id ${gameId}:`, error);
    if (error instanceof Error) {
      console.warn(`Error message: ${error.message}`);
    }

    // Fallback to HTML parsing if API fails
    return fetchGameDetailsFromHTML(gameId);
  }
};

const extractGameData = (
  data: any
): {
  imageUrl?: string;
  description?: string;
  gameplayMainExtra?: number;
} | null => {
  try {
    // Next.js data endpoint typically returns: { pageProps: { ... } }
    // But it might also be nested differently
    let gameData = null;

    if (data?.pageProps) {
      gameData =
        data.pageProps.game || data.pageProps.gameData || data.pageProps;
    } else if (data?.props?.pageProps) {
      gameData =
        data.props.pageProps.game ||
        data.props.pageProps.gameData ||
        data.props.pageProps;
    } else if (data?.game) {
      gameData = data.game;
    } else {
      // Try using the data itself
      gameData = data;
    }

    if (!gameData) {
      console.warn("Could not find game data in response structure");
      return null;
    }

    // If gameData has a 'data' property, the actual game info is likely there
    // This happens when pageProps contains { count, data } structure
    let actualGameData = gameData;
    let parentDataStructure: any = null; // Keep reference to parent for accessing platformData, etc.
    if (gameData.data) {
      // If data is an array, take the first element (should be the game)
      // If data is an object, use it directly
      parentDataStructure = Array.isArray(gameData.data)
        ? gameData.data[0]
        : gameData.data;
      actualGameData = parentDataStructure;

      // The game information is nested inside the 'game' property
      if (actualGameData.game) {
        // If game is an array or has numeric keys, get the first element
        const gameValue = actualGameData.game;

        if (Array.isArray(gameValue)) {
          actualGameData = gameValue[0];
        } else if (typeof gameValue === "object" && gameValue !== null) {
          // Check if it's an object with numeric keys (array-like)
          const keys = Object.keys(gameValue);

          if (keys.length > 0 && /^\d+$/.test(keys[0])) {
            // It's an array-like object, get the first value
            const firstKey = keys[0];
            let extractedValue = gameValue[firstKey];

            // If the extracted value still has numeric keys, go deeper (handle nested numeric keys)
            if (
              typeof extractedValue === "object" &&
              extractedValue !== null &&
              !Array.isArray(extractedValue)
            ) {
              const extractedKeys = Object.keys(extractedValue);
              if (extractedKeys.length > 0 && /^\d+$/.test(extractedKeys[0])) {
                extractedValue = extractedValue[extractedKeys[0]];
              }
            }

            actualGameData = extractedValue;
          } else {
            // It's a regular object
            actualGameData = gameValue;
          }
        } else {
          actualGameData = gameValue;
        }
      }
    }

    // Extract image - HLTB uses 'game_image' field
    // The image might be just a filename, so we need to construct the full URL
    let imageUrl =
      actualGameData.game_image ||
      actualGameData.imageUrl ||
      actualGameData.image ||
      actualGameData.cover ||
      actualGameData.coverUrl ||
      actualGameData.gameImage ||
      actualGameData.boxArt ||
      actualGameData.game_image_url ||
      "";

    // If imageUrl is just a filename (doesn't start with http), construct full URL
    if (imageUrl && !imageUrl.startsWith("http")) {
      // HLTB image URLs - handle different formats
      if (imageUrl.startsWith("/")) {
        // Already has path, just add domain
        imageUrl = `https://howlongtobeat.com${imageUrl}`;
      } else if (imageUrl.includes("_")) {
        // Looks like a game image filename (e.g., "94075_Metroid_Dread.jpg")
        // HLTB stores images at: https://howlongtobeat.com/games/{filename}
        imageUrl = `https://howlongtobeat.com/games/${imageUrl}`;
      } else {
        // Fallback: try games path
        imageUrl = `https://howlongtobeat.com/games/${imageUrl}`;
      }
    } else if (!imageUrl) {
      console.warn("No image URL found in game data");
    }

    // Extract description - HLTB uses 'profile_summary' field
    const description =
      actualGameData.profile_summary ||
      actualGameData.description ||
      actualGameData.summary ||
      actualGameData.gameDescription ||
      actualGameData.desc ||
      actualGameData.game_desc ||
      actualGameData.game_description ||
      "";

    // Extract completion time
    // HLTB stores completion times - need to find the correct field
    // The previous values (33329, 8793) were too large, suggesting wrong field
    let gameplayMainExtra = 0;

    // Check parent structure for platformData which might contain completion times
    if (parentDataStructure?.platformData) {
      const platformData = parentDataStructure.platformData;

      if (Array.isArray(platformData) && platformData.length > 0) {
        // Check the first platform entry
        const firstPlatform = platformData[0];

        // Look for completion time fields in platform data
        // HLTB typically stores times as comp_main, comp_plus, comp_100, etc.
        if (firstPlatform) {
          const timeFields = [
            "comp_main",
            "comp_plus",
            "comp_100",
            "comp_all",
            "comp_main_value",
            "comp_plus_value",
            "time_main",
            "time_plus",
          ];
          for (const field of timeFields) {
            if (
              firstPlatform[field] !== undefined &&
              firstPlatform[field] !== null
            ) {
              if (gameplayMainExtra === 0 || field.includes("main")) {
                // Use comp_main as primary
                gameplayMainExtra = firstPlatform[field];
              }
            }
          }

          // If still 0, try to find any field that looks like a time value
          if (gameplayMainExtra === 0) {
            for (const key in firstPlatform) {
              const value = firstPlatform[key];
              if (
                typeof value === "number" &&
                value > 0 &&
                value < 1000 &&
                (key.includes("comp") ||
                  key.includes("time") ||
                  key.includes("main"))
              ) {
                gameplayMainExtra = value;
                break;
              }
            }
          }
        }
      } else if (typeof platformData === "object" && platformData !== null) {
        const platformKeys = Object.keys(platformData);

        // Check if platformData has completion time fields directly
        const timeFields = [
          "comp_main",
          "comp_plus",
          "comp_100",
          "comp_all",
          "comp_main_value",
          "comp_plus_value",
          "time_main",
          "time_plus",
        ];
        for (const field of timeFields) {
          if (
            platformData[field] !== undefined &&
            platformData[field] !== null
          ) {
            if (gameplayMainExtra === 0 || field.includes("main")) {
              gameplayMainExtra = platformData[field];
            }
          }
        }

        // Check if platformData has nested structures
        for (const key of platformKeys.slice(0, 5)) {
          const value = platformData[key];
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)
          ) {
            // Check nested object for time fields
            for (const timeField of ["comp_main", "comp_plus", "time_main"]) {
              if (value[timeField] !== undefined && value[timeField] !== null) {
                if (gameplayMainExtra === 0 || timeField.includes("main")) {
                  gameplayMainExtra = value[timeField];
                }
              }
            }
          }
        }
      }
    }

    return {
      imageUrl,
      description,
      gameplayMainExtra:
        typeof gameplayMainExtra === "number" ? gameplayMainExtra : 0,
    };
  } catch (error) {
    console.warn("Failed to extract game data:", error);
    if (error instanceof Error) {
      console.warn("Extraction error:", error.message, error.stack);
    }
    return null;
  }
};

const getGameDetails = async (
  item: GameItem,
  status: GameStatus
): Promise<GameDetails> => {
  try {
    const { game_id, custom_title, platform, play_storefront } = item;

    const gameDetails = await fetchGameDetailsFromAPI(game_id);

    const progress =
      "invested_pro" in item
        ? (item.invested_pro / 3600).toFixed(1)
        : undefined;

    // Return game details with fallback values if API call failed
    const result = {
      title: custom_title,
      storefront: play_storefront,
      image: gameDetails?.imageUrl || "",
      platform,
      description: gameDetails?.description || "No description available",
      progress,
      status,
      completion_time: gameDetails?.gameplayMainExtra || 0,
    };

    return result;
  } catch (error) {
    console.error("Error getting game details:", error);
    throw error;
  }
};

const getCurrentlyPlayingGame = async (): Promise<GameDetails | null> => {
  try {
    const { data } = await fetchGames({
      status: "playing",
      sortBy: "date_updated",
    });

    if (!data?.gamesList?.length) {
      return null;
    }

    return getGameDetails(data.gamesList[0], "playing");
  } catch (error) {
    console.error("Error getting currently playing game:", error);
    return null;
  }
};

const getLastCompletedGame = async (): Promise<GameDetails | null> => {
  try {
    const { data } = await fetchGames({
      status: "completed",
      sortBy: "date_complete",
    });

    if (!data?.gamesList?.length) {
      return null;
    }

    return getGameDetails(data.gamesList[0], "completed");
  } catch (error) {
    console.error("Error getting last completed game:", error);
    return null;
  }
};

interface ReleaseByYear {
  label: string;
  count: number;
}

interface HLTBStats {
  totalHours: number;
  gamesCompleted: number;
  completionRate: number;
  releaseByYear: ReleaseByYear[];
}

const fetchUserStats = async (): Promise<HLTBStats | null> => {
  try {
    const hltbConfig = howlongtobeat as { api?: string; statsApi?: string };
    const statsApi =
      hltbConfig.statsApi ||
      (hltbConfig.api ? hltbConfig.api.replace("/games/list", "/stats") : null) ||
      "https://howlongtobeat.com/api/user/82755/stats";

    const response = await fetch(statsApi, {
      method: "POST",
      headers,
      body: JSON.stringify({
        category: "user_catalog",
        platform: "",
        storefront: "",
        year: "",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = (await response.json()) as HLTBStatsResponse;
    const summary = data?.userStatsSummary;

    if (!summary) {
      return null;
    }

    const investedSp = summary.investedSpAll ?? 0;
    const investedCo = summary.investedCoAll ?? 0;
    const investedMp = summary.investedMpAll ?? 0;
    const totalSeconds = investedSp + investedCo + investedMp;
    const totalHours = Math.round(totalSeconds / 3600);

    const gamesCompleted = summary.playthroughCount?.totalCompletions ?? 0;
    const platformTotal = summary.platformTotal ?? 0;
    const completionRate =
      platformTotal > 0
        ? Math.round((gamesCompleted / platformTotal) * 100)
        : 0;

    let releaseByYear: ReleaseByYear[] = [];
    const releaseChart = summary.releaseChart;
    if (Array.isArray(releaseChart) && releaseChart.length === 4) {
      releaseByYear = RELEASE_CHART_LABELS.map((label, i) => ({
        label,
        count: typeof releaseChart[i] === "number" ? releaseChart[i] : 0,
      }));
    }

    return {
      totalHours,
      gamesCompleted,
      completionRate,
      releaseByYear,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const results = await Promise.allSettled([
      getCurrentlyPlayingGame(),
      getLastCompletedGame(),
      fetchUserStats(),
    ]);

    const [playingResult, lastCompletedResult, statsResult] = results;

    const response = {
      playing:
        playingResult.status === "fulfilled" ? playingResult.value : null,
      last_completed:
        lastCompletedResult.status === "fulfilled"
          ? lastCompletedResult.value
          : null,
      stats:
        statsResult.status === "fulfilled" ? statsResult.value : null,
    };

    return response;
  } catch (error) {
    console.error("Error in video games API:", error);
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Game data is not available at this time",
    };
  }
});
