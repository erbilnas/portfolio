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
  <div>
    <div>
      <!-- Mobile swipe indicator -->
      <div
        v-if="isMobile"
        class="flex items-center justify-center gap-2 py-1 sm:py-2 text-xs sm:text-sm text-slate-400"
      >
        <span class="uppercase tracking-wider font-medium">
          {{ currentIndex + 1 }} / {{ maxIndex + 1 }}
        </span>
      </div>

      <!-- Desktop navigation -->
      <ExperienceNavigation
        v-if="!isMobile"
        :current-index="currentIndex"
        :max-index="maxIndex"
        @previous="goToPrevious"
        @next="goToNext"
        @select="setIndex"
      />

      <!-- Experience cards stack with enhanced touch handling -->
      <TransitionGroup
        name="stack"
        tag="div"
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
          :is-mobile="isMobile"
        />
      </TransitionGroup>
    </div>
  </div>
</template>
