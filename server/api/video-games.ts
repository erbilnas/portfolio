import { HowLongToBeatService } from "howlongtobeat";

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

const howlongtobeat_service = new HowLongToBeatService();
const { howlongtobeat } = useRuntimeConfig();

const headers = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  Origin: "https://howlongtobeat.com",
  Referer: "https://howlongtobeat.com/",
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

const getGameDetails = async (
  item: GameItem,
  status: GameStatus
): Promise<GameDetails> => {
  try {
    const { game_id, custom_title, platform, play_storefront } = item;

    const gameDetails = await howlongtobeat_service.detail(game_id.toString());

    if (!gameDetails) {
      throw new Error("Game details not found");
    }

    const { imageUrl, description, gameplayMainExtra } = gameDetails;

    const progress =
      "invested_pro" in item
        ? (item.invested_pro / 3600).toFixed(1)
        : undefined;

    return {
      title: custom_title,
      storefront: play_storefront,
      image: imageUrl || "",
      platform,
      description: description || "No description available",
      progress,
      status,
      completion_time: gameplayMainExtra || 0,
    };
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
      console.log("No currently playing games found");
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
      console.log("No last completed games found");
      return null;
    }

    return getGameDetails(data.gamesList[0], "completed");
  } catch (error) {
    console.error("Error getting last completed game:", error);
    return null;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const results = await Promise.allSettled([
      getCurrentlyPlayingGame(),
      getLastCompletedGame(),
    ]);

    const [playingResult, lastCompletedResult] = results;

    return {
      playing:
        playingResult.status === "fulfilled" ? playingResult.value : null,
      last_completed:
        lastCompletedResult.status === "fulfilled"
          ? lastCompletedResult.value
          : null,
    };
  } catch (error) {
    console.error("Error in video games API:", error);
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Game data is not available at this time",
    };
  }
});
