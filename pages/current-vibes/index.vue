<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { onUnmounted } from "vue";
import { useCardNavigation } from "~/composables/useCardNavigation";
import { useCardTouch } from "~/composables/useCardTouch";
import { useCurrentVibesData } from "~/composables/useCurrentVibesData";
import type {
  Card,
  CardProps,
  MediumPost,
  MusicPlayerData,
  SingleGameDetail,
} from "~/types/current-vibes";
import Navigation from "./Navigation.vue";

const sectionRef = ref<HTMLElement | null>(null);

// Get data from composable
const { allCards } = await useCurrentVibesData();

const { updateTitle } = usePageMeta();

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateTitle("Current Vibes");
    }
  });
};

const isMobile = useMediaQuery("(max-width: 768px)");

// Initialize card navigation
const {
  currentIndex,
  handleKeydown,
  getCardStyle,
  navigateToNext,
  navigateToPrev,
} = useCardNavigation(allCards.value);

// Initialize touch handling
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCardTouch(
  navigateToNext,
  navigateToPrev
);

// Get props for card component
const getCardProps = (card: Card, index: number): CardProps => {
  const isActive = index === currentIndex.value;

  switch (card.type) {
    case "game":
      return { game: card.data as SingleGameDetail, isActive };
    case "music":
      return { player: card.data as MusicPlayerData, isActive };
    case "map":
      return { map: undefined, isActive };
    case "blog":
      return { post: card.data as MediumPost, isActive };
    default:
      return { isActive };
  }
};

// Lifecycle hooks
onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });

  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <section id="current-vibes" ref="sectionRef">
    <div
      class="overflow-hidden h-screen flex flex-col gap-4 py-16 items-center bg-gradient-to-b from-red-950 to-zinc-950"
    >
      <!-- Swipe indicator - only visible on mobile -->
      <div class="text-white/80 flex items-center gap-2 md:hidden">
        <Icon name="ph:hand-swipe-left" class="w-5 h-5 animate-pulse" />
        <span class="text-sm">Swipe to navigate</span>
      </div>

      <!-- Cards container with touch handling -->
      <div
        class="relative h-[600px] flex items-center justify-center"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <TransitionGroup name="card">
          <div
            v-for="(card, index) in allCards"
            :key="index"
            class="absolute w-[330px] md:w-[400px] transition-all duration-500"
            :style="getCardStyle(index) as any"
          >
            <component
              :is="card.component"
              v-bind="getCardProps(card, index)"
              class="w-full transform-gpu"
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Navigation -->
      <Navigation
        v-show="!isMobile"
        :current-index="currentIndex"
        :total-cards="allCards.length"
        @previous="navigateToPrev"
        @next="navigateToNext"
      />
    </div>
  </section>
</template>
