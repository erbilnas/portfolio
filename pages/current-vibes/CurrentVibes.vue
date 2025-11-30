<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import {
  CurrentVibesCard,
  CurrentVibesHeader,
} from "~/components/current-vibes";
import {
  AppleCardCarousel,
  AppleCarouselItem,
} from "~/components/ui/apple-card-carousel";
import {
  useCardsContrast,
  useCardsMetadata,
  useCarouselDrag,
  useCarouselNavigation,
  useCurrentVibesData,
} from "~/composables/current-vibes";

const sectionRef = ref<HTMLElement | null>(null);

// Setup observer
const { observeSectionChange } = useObserver("Current Vibes", sectionRef);
observeSectionChange();

// Data fetching
const { cards } = useCurrentVibesData();

// Card metadata
const { getCardMetadata } = useCardsMetadata();

// Image contrast analysis
const { cardContrast } = useCardsContrast(cards, getCardMetadata);

// Carousel navigation
const carouselRef = ref<ComponentPublicInstance<
  typeof AppleCardCarousel
> | null>(null);
const maxIndex = computed(() => cards.value.length - 1);

const {
  currentIndex,
  goToPrevious,
  goToNext,
  setupScrollListener,
  removeScrollListener,
} = useCarouselNavigation(carouselRef, maxIndex);

// Drag handling
const {
  isDragging,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  setupMouseListeners,
  removeMouseListeners,
} = useCarouselDrag(currentIndex, maxIndex, goToPrevious, goToNext);

// Setup lifecycle hooks
onMounted(() => {
  setupScrollListener();
  setupMouseListeners();
});

onUnmounted(() => {
  removeScrollListener();
  removeMouseListeners();
});
</script>

<template>
  <section id="current-vibes" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <CurrentVibesHeader />

      <div
        :class="[
          'relative mx-auto max-w-screen-2xl w-full px-0 md:px-4 sm:px-8',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
        ]"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseLeave"
      >
        <AppleCardCarousel
          ref="carouselRef"
          :hide-navigation="false"
          class="px-4 md:px-0"
        >
          <AppleCarouselItem
            v-for="(card, index) in cards"
            :key="index"
            :index="index"
          >
            <CurrentVibesCard
              :card="card"
              :index="index"
              :metadata="getCardMetadata(card, index)"
              :contrast-class="cardContrast.get(index)?.textColorClass"
              :is-light="cardContrast.get(index)?.isLight"
              :is-dragging="isDragging"
            />
          </AppleCarouselItem>
        </AppleCardCarousel>
      </div>
    </div>
  </section>
</template>
