import { HowLongToBeatService } from "howlongtobeat";

// Types
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
  progress?: string;
  image: string;
  storefront: string;
  description: string;
  status?: string;
}

// Constants
const HLTB_SERVICE = new HowLongToBeatService();
const { hltbApi } = useRuntimeConfig();

const API_HEADERS = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  "Accept": "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://howlongtobeat.com",
  "Referer": "https://howlongtobeat.com/",
} as const;

const DEFAULT_REQUEST_BODY = {
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

// Helper functions
const fetchGames = async (status: string, sortBy = "name"): Promise<GameResponse> => {
  const response = await fetch(hltbApi, {
    method: "POST",
    headers: API_HEADERS,
    body: JSON.stringify({
      ...DEFAULT_REQUEST_BODY,
      lists: [status],
      sortBy,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error("API did not return JSON");
  }

  return response.json();
};

const getGameDetails = async (gameItem: GameItem, status?: string): Promise<GameDetails> => {
  const { imageUrl, description } = await HLTB_SERVICE.detail(
    gameItem.game_id.toString()
  );

  const details: GameDetails = {
    title: gameItem.custom_title,
    platform: gameItem.platform,
    image: imageUrl,
    storefront: gameItem.play_storefront,
    description,
  };

  if ('invested_pro' in gameItem) {
    details.progress = (gameItem.invested_pro / 3600).toFixed(1);
  }
  
  if (status) {
    details.status = status;
  }

  return details;
};

// Main functions
const getCurrentlyPlayingGame = async (): Promise<GameDetails> => {
  const { data } = await fetchGames("playing", "date_updated");
  
  if (!data?.gamesList?.length) {
    throw new Error("No currently playing games found");
  }

  return getGameDetails(data.gamesList[0]);
};

const getLastCompletedGame = async (): Promise<GameDetails> => {
  const { data } = await fetchGames("completed", "date_complete");
  
  if (!data?.gamesList?.length) {
    throw new Error("No completed games found");
  }

  return getGameDetails(data.gamesList[0], "no-playing-games");
};

// API Handler
export default defineEventHandler(async (event) => {
  const { status } = getQuery(event);

  if (status !== "currently-playing") {
    return {
      error: true,
      status: "invalid_status",
      message: "Invalid status parameter",
    };
  }

  try {
    return await getCurrentlyPlayingGame();
  } catch (error) {
    console.error("Failed to get currently playing game:", error);
    
    try {
      return await getLastCompletedGame();
    } catch (fallbackError) {
      console.error("Failed to get last completed game:", fallbackError);
      return {
        error: true,
        status: "error",
        message: "Failed to fetch game data",
      };
    }
  }
});
