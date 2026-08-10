import type {
  GameDetails,
  GitHubStats,
  GoodreadsBook,
  MediumPost,
  MusicPlayer,
  TraktWatchedDetail,
} from "~/types/current-vibes";

export interface CardData {
  type: "game" | "music" | "blog" | "map" | "trakt" | "github" | "reading";
  data?: unknown;
}

export const useCurrentVibesData = () => {
  const {
    data: gameData,
    pending: gamePending,
    error: gameError,
  } = useFetch<GameDetails | { status: number; message: string }>(
    "/api/video-games",
  );
  const { data: blogData } = useFetch<MediumPost>("/api/blog");
  const { data: musicData } = useFetch<MusicPlayer>("/api/music");
  const { data: traktData } = useFetch<TraktWatchedDetail | null>(
    "/api/trakt/history",
  );
  const { data: readingData } = useFetch<
    GoodreadsBook | { status: number; message: string } | null
  >("/api/goodreads");
  const { data: githubData } = useFetch<
    GitHubStats | { status: number; message: string }
  >("/api/github");

  // Watch for data changes
  watch(
    [gameData, gamePending, gameError],
    ([data, pending, error]) => {
      // Data change monitoring (no logging)
    },
    { immediate: true },
  );

  const cards = computed<CardData[]>(() => {
    // Check if gameData is an error response
    const isValidGameData = gameData.value && !("status" in gameData.value);
    const gameDetails = isValidGameData
      ? (gameData.value as GameDetails)
      : null;

    const gameCardData = gameDetails?.playing || gameDetails?.last_completed;

    const cardArray: CardData[] = [];

    // Add game card (with merged stats when available)
    if (gameCardData) {
      cardArray.push({
        type: "game" as const,
        data: {
          ...gameCardData,
          stats: gameDetails?.stats ?? null,
        },
      });
    }

    // Add trakt card if history exists
    if (traktData.value) {
      cardArray.push({
        type: "trakt" as const,
        data: traktData.value,
      });
    }

    const readingBook =
      readingData.value &&
      typeof readingData.value === "object" &&
      "title" in readingData.value &&
      typeof (readingData.value as GoodreadsBook).title === "string" &&
      !("message" in readingData.value)
        ? (readingData.value as GoodreadsBook)
        : null;
    if (readingBook) {
      cardArray.push({
        type: "reading" as const,
        data: readingBook,
      });
    }

    // Add other cards
    cardArray.push(
      {
        type: "music",
        data: musicData.value?.player,
      },
      {
        type: "blog",
        data: blogData.value || undefined,
      },
    );

    // Add GitHub card if data is valid
    const isValidGithubData =
      githubData.value && !("status" in githubData.value);
    if (isValidGithubData) {
      cardArray.push({
        type: "github" as const,
        data: githubData.value as GitHubStats,
      });
    }

    cardArray.push({
      type: "map",
    });

    return cardArray;
  });

  // Computed property to filter out error responses
  const validGameData = computed(() => {
    if (!gameData.value || "status" in gameData.value) {
      return null;
    }
    return gameData.value as GameDetails;
  });

  return {
    cards,
    gameData: validGameData,
    blogData,
    musicData,
  };
};
