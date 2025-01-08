import { computed } from "vue";
import type {
  Card,
  GameDetails,
  MediumPost,
  MusicPlayer,
  MusicPlayerData,
  SingleGameDetail,
} from "~/types/current-vibes";

export const useCurrentVibesData = async () => {
  const { playing, last_completed } = await $fetch<GameDetails>(
    "/api/video-games"
  );
  const { title, link, published_at, description } = await $fetch<MediumPost>(
    "/api/blog"
  );
  const { player } = await $fetch<MusicPlayer>("/api/music");

  const allCards = computed<Card[]>(() => {
    return [
      {
        type: "game",
        data: playing as SingleGameDetail,
        component: playing
          ? defineAsyncComponent(
              () => import("~/pages/current-vibes/VideoGameCard.vue")
            )
          : defineAsyncComponent(
              () => import("~/pages/current-vibes/ErrorCard.vue")
            ),
      },
      {
        type: "music",
        data: player as MusicPlayerData,
        component: player
          ? defineAsyncComponent(
              () => import("~/pages/current-vibes/MusicPlayerCard.vue")
            )
          : defineAsyncComponent(
              () => import("~/pages/current-vibes/ErrorCard.vue")
            ),
      },
      {
        type: "blog",
        data: { title, link, published_at, description } as MediumPost,
        component:
          title || link || published_at || description
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
        data: last_completed as SingleGameDetail,
        component: last_completed
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
