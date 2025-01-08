<script setup lang="ts">
import { useExperience } from "@/composables/useExperience";
import { useSwipeNavigation } from "@/composables/useSwipeNavigation";
import ExperienceCard from "./ExperienceCard.vue";
import ExperienceNavigation from "./ExperienceNavigation.vue";

const {
  experiences,
  currentIndex,
  maxIndex,
  isMobile,
  goToPrevious,
  goToNext,
  setIndex,
  getCardStyle,
} = useExperience();

// Use the swipe navigation composable with enhanced sensitivity for mobile
const { handleTouchStart, handleTouchMove, handleTouchEnd } =
  useSwipeNavigation({
    onPrevious: goToPrevious,
    onNext: goToNext,
    threshold: 40, // Even more reduced threshold for easier swiping
    isMobile: isMobile.value,
  });

// Track swipe progress for visual feedback
const swipeProgress = ref<number>(0);
const touchStartX = ref<number>(0);

const handleEnhancedTouchMove = (e: TouchEvent) => {
  handleTouchMove(e);
  // Calculate swipe progress for visual feedback
  const touch = e.touches[0];
  if (!touchStartX.value) {
    touchStartX.value = touch.clientX;
  }
  const deltaX = touch.clientX - touchStartX.value;
  swipeProgress.value = Math.max(-100, Math.min(100, deltaX));
};

const resetSwipeProgress = () => {
  swipeProgress.value = 0;
  touchStartX.value = 0;
};

// Handle keyboard navigation
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      goToNext();
    }
  };

  window.addEventListener("keydown", handleKeydown);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
});
</script>

<template>
  <div class="w-full max-w-6xl mx-auto px-3 md:px-8">
    <div
      class="relative min-h-[800px] sm:min-h-[700px] md:min-h-[500px] pt-12 sm:pt-4 md:pt-12"
    >
      <!-- Mobile swipe indicator -->
      <div
        v-if="isMobile"
        class="absolute top-0 left-0 right-0 flex items-center justify-center gap-2 py-1 sm:py-2 text-xs sm:text-sm text-slate-400"
      >
        <span class="uppercase tracking-wider font-medium">
          {{ currentIndex + 1 }} / {{ maxIndex + 1 }}
        </span>
      </div>

      <!-- Experience cards stack with enhanced touch handling -->
      <TransitionGroup
        name="stack"
        tag="div"
        class="relative w-full h-full flex items-center justify-center"
        @touchstart="handleTouchStart"
        @touchmove="handleEnhancedTouchMove"
        @touchend="
          () => {
            handleTouchEnd();
            resetSwipeProgress();
          }
        "
        @touchcancel="
          () => {
            handleTouchEnd();
            resetSwipeProgress();
          }
        "
      >
        <ExperienceCard
          v-for="(experience, index) in experiences"
          :key="experience.company"
          :experience="experience"
          :is-active="index === currentIndex"
          v-show="Math.abs(index - currentIndex) <= 1"
          :style="{
            ...getCardStyle(index),
            ...(index === currentIndex && {
              transform: `${getCardStyle(index).transform} translateX(${
                swipeProgress * 0.2
              }px)`,
            }),
          }"
          :is-mobile="isMobile"
        />
      </TransitionGroup>

      <!-- Navigation dots for mobile -->
      <div
        v-if="isMobile"
        class="absolute -bottom-6 sm:-bottom-8 left-0 right-0 flex justify-center gap-1.5 sm:gap-2"
      >
        <button
          v-for="index in maxIndex + 1"
          :key="index"
          class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300"
          :class="
            index - 1 === currentIndex
              ? 'bg-violet-500 scale-125'
              : 'bg-slate-600'
          "
          @click="setIndex(index - 1)"
        />
      </div>

      <!-- Desktop navigation -->
      <ExperienceNavigation
        v-if="!isMobile"
        :current-index="currentIndex"
        :max-index="maxIndex"
        :is-mobile="isMobile"
        @previous="goToPrevious"
        @next="goToNext"
        @select="setIndex"
      />
    </div>
  </div>
</template>
