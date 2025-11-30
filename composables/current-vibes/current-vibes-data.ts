import type {
  GameDetails,
  MediumPost,
  MusicPlayer,
} from "~/types/current-vibes";

export interface CardData {
  type: "game" | "music" | "blog" | "map";
  data?: unknown;
}

export const useCurrentVibesData = () => {
  const { data: gameData } = useFetch<GameDetails>("/api/video-games");
  const { data: blogData } = useFetch<MediumPost>("/api/blog");
  const { data: musicData } = useFetch<MusicPlayer>("/api/music");

  const cards = computed<CardData[]>(() => {
    return [
      {
        type: "game",
        data: gameData.value?.playing || gameData.value?.last_completed,
      },
      {
        type: "music",
        data: musicData.value?.player,
      },
      {
        type: "blog",
        data: blogData.value || undefined,
      },
      {
        type: "map",
      },
    ];
  });

  return {
    cards,
    gameData,
    blogData,
    musicData,
  };
};

