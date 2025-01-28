<script setup lang="ts">
import type {
  Card,
  CardProps,
  GameDetails,
  MediumPost,
  MusicPlayer,
  MusicPlayerData,
  SingleGameDetail,
} from "~/types/current-vibes";

const sectionRef = ref<HTMLElement | null>(null);

const { data: gameData, error: gameError } =
  useFetch<GameDetails>("/api/video-games");
const { data: blogData, error: blogError } = useFetch<MediumPost>("/api/blog");
const { data: musicData, error: musicError } =
  useFetch<MusicPlayer>("/api/music");

// Helper to check if blog data is valid
const isBlogDataValid = (data: MediumPost | null) => {
  return !!(
    data?.title &&
    data?.link &&
    data?.published_at &&
    data?.description
  );
};

// Helper to check if game data is valid
const isGameDataValid = (game: SingleGameDetail | null | undefined) => {
  return !!(game?.title && game?.platform && game?.description);
};

// Helper to check if music data is valid
const isMusicDataValid = (player: MusicPlayerData | null | undefined) => {
  return !!(player?.album?.name && player?.artist && player?.name);
};

const ErrorComponent = defineAsyncComponent(() => import("./cards/Error.vue"));
const VideoGameComponent = defineAsyncComponent(
  () => import("./cards/VideoGame.vue")
);
const BlogPostComponent = defineAsyncComponent(
  () => import("./cards/BlogPost.vue")
);
const MusicPlayerComponent = defineAsyncComponent(
  () => import("./cards/MusicPlayer.vue")
);
const CustomMapComponent = defineAsyncComponent(
  () => import("./cards/CustomMap.vue")
);

const cards = computed<Card[]>(() => {
  const cardConfigs: Card[] = [
    {
      type: "game",
      data: gameData.value?.playing,
      component:
        isGameDataValid(gameData.value?.playing) && !gameError.value
          ? VideoGameComponent
          : ErrorComponent,
    },
    {
      type: "music",
      data: musicData.value?.player,
      component: MusicPlayerComponent,
    },
    {
      type: "blog",
      data: blogData.value || undefined,
      component:
        isBlogDataValid(blogData.value) && !blogError.value
          ? BlogPostComponent
          : ErrorComponent,
    },
    {
      type: "map",
      component: CustomMapComponent,
    },
    {
      type: "game",
      data: gameData.value?.last_completed,
      component:
        isGameDataValid(gameData.value?.last_completed) && !gameError.value
          ? VideoGameComponent
          : ErrorComponent,
    },
  ];

  return cardConfigs;
});

const { observeSectionChange } = useObserver("Current Vibes", sectionRef);
observeSectionChange();

const currentIndex = ref(0);
const maxIndex = cards.value.length - 1;

const {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  goToPrevious,
  goToNext,
} = useNavigation(currentIndex, maxIndex);

// Get props for card component with improved type safety
const getCardProps = (card: Card, index: number): CardProps => {
  const baseProps = { isActive: index === currentIndex.value };

  switch (card.type) {
    case "game":
      return { ...baseProps, game: card.data as SingleGameDetail };
    case "music":
      return { ...baseProps, player: card.data as MusicPlayerData };
    case "map":
      return { ...baseProps, map: undefined };
    case "blog":
      return { ...baseProps, post: card.data as MediumPost };
    default:
      return baseProps;
  }
};
</script>

<template>
  <section id="current-vibes" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-6 py-16 items-center bg-gradient-to-b from-red-950 to-zinc-950"
    >
      <div class="text-center mb-8">
        <h1 class="text-4xl md:text-6xl font-bold animate-title-float">
          <span
            class="inline-block animate-title-gradient bg-gradient-to-r from-cyan-400 via-purple-500 to-rose-500 bg-[length:200%_auto] bg-clip-text text-transparent"
          >
            Current Vibes
          </span>
        </h1>
        <p
          class="text-foreground/80 mt-3 text-sm md:text-base animate-title-fade"
        >
          Discover what keeps me going
        </p>
      </div>

      <CommonNavigation
        :index="{ current: currentIndex, max: maxIndex }"
        :navigation="{
          previous: goToPrevious,
          next: goToNext,
        }"
        :items="cards"
      />

      <div
        class="relative mx-auto max-w-screen-lg w-full px-4 sm:px-8 md:px-16"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <TransitionGroup name="card">
          <div
            v-for="(card, index) in cards"
            :key="index"
            v-show="index === currentIndex"
            class="group relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-lg shadow-2xl transition-all duration-500 border border-white/10 hover:border-blue-400/30 animate-card-move [&.card-enter-active]:animate-card-enter [&.card-leave-active]:animate-card-leave [&.card-leave-active]:absolute [&.card-leave-active]:w-full"
          >
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10"
            ></div>

            <component
              :is="card.component"
              v-bind="getCardProps(card, index)"
              class="w-full transform-gpu h-[calc(100vh-10rem)] md:h-full"
            />
          </div>
        </TransitionGroup>
      </div>
    </div>
  </section>
</template>
