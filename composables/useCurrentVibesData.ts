import { computed } from "vue";
import type {
  Card,
  GameDetails,
  MediumPost,
  MusicPlayer,
  MusicPlayerData,
  SingleGameDetail,
} from "~/types/current-vibes";

export const useCurrentVibesData = () => {
  const { data: gameData } = useFetch<GameDetails>("/api/video-games");
  const { data: blogData } = useFetch<MediumPost>("/api/blog");
  const { data: musicData } = useFetch<MusicPlayer>("/api/music");

  const allCards = computed<Card[]>(() => {
    return [
      {
        type: "game",
        data: gameData.value?.playing as SingleGameDetail,
        component: gameData.value?.playing
          ? defineAsyncComponent(
              () => import("~/pages/current-vibes/VideoGameCard.vue")
            )
          : defineAsyncComponent(
              () => import("~/pages/current-vibes/ErrorCard.vue")
            ),
      },
      {
        type: "music",
        data: musicData.value?.player as MusicPlayerData,
        component: musicData.value?.player
          ? defineAsyncComponent(
              () => import("~/pages/current-vibes/MusicPlayerCard.vue")
            )
          : defineAsyncComponent(
              () => import("~/pages/current-vibes/ErrorCard.vue")
            ),
      },
      {
        type: "blog",
        data: blogData.value as MediumPost,
        component:
          blogData.value?.title ||
          blogData.value?.link ||
          blogData.value?.published_at ||
          blogData.value?.description
            ? defineAsyncComponent(
                () => import("~/pages/current-vibes/BlogPostCard.vue")
              )
            : defineAsyncComponent(
                () => import("~/pages/current-vibes/ErrorCard.vue")
              ),
      },
      {
        type: "map",
        component: defineAsyncComponent(
          () => import("~/pages/current-vibes/CustomMapCard.vue")
        ),
      },
      {
        type: "game",
        data: gameData.value?.last_completed as SingleGameDetail,
        component: gameData.value?.last_completed
          ? defineAsyncComponent(
              () => import("~/pages/current-vibes/VideoGameCard.vue")
            )
          : defineAsyncComponent(
              () => import("~/pages/current-vibes/ErrorCard.vue")
            ),
      },
    ];
  });

  return {
    allCards,
  };
};
