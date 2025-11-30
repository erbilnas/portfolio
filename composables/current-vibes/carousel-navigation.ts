import { ref } from "vue";
import type { Ref, ComponentPublicInstance } from "vue";
import type { AppleCardCarousel } from "~/components/ui/apple-card-carousel/AppleCardCarousel.vue";

export const useCarouselNavigation = (
  carouselRef: Ref<ComponentPublicInstance<typeof AppleCardCarousel> | null>,
  maxIndex: Ref<number>
) => {
  const currentIndex = ref(0);

  /**
   * Update current index based on scroll position
   */
  const updateCurrentIndex = () => {
    if (carouselRef.value?.carouselRef) {
      const scrollLeft = carouselRef.value.carouselRef.scrollLeft;
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

      if (isMobile) {
        // On mobile, each card is viewport width
        const cardWidth = carouselRef.value.carouselRef.clientWidth;
        const newIndex = Math.round(scrollLeft / cardWidth);
        currentIndex.value = Math.min(
          Math.max(0, newIndex),
          maxIndex.value
        );
      } else {
        // On desktop, use card width + gap
        const cardWidth = 512; // md:w-[32rem] (512px) + padding + gap
        const gap = 16; // gap-4 = 16px
        const cardWidthWithGap = cardWidth + gap;
        const newIndex = Math.round(scrollLeft / cardWidthWithGap);
        currentIndex.value = Math.min(
          Math.max(0, newIndex),
          maxIndex.value
        );
      }
    }
  };

  /**
   * Navigate to previous card
   */
  const goToPrevious = () => {
    if (carouselRef.value && currentIndex.value > 0) {
      carouselRef.value.scrollLeft();
      // Update index after a short delay to allow scroll to complete
      setTimeout(updateCurrentIndex, 100);
    }
  };

  /**
   * Navigate to next card
   */
  const goToNext = () => {
    if (carouselRef.value && currentIndex.value < maxIndex.value) {
      carouselRef.value.scrollRight();
      // Update index after a short delay to allow scroll to complete
      setTimeout(updateCurrentIndex, 100);
    }
  };

  /**
   * Setup scroll event listener
   */
  const setupScrollListener = () => {
    if (carouselRef.value?.carouselRef) {
      carouselRef.value.carouselRef.addEventListener(
        "scroll",
        updateCurrentIndex
      );
    }
  };

  /**
   * Remove scroll event listener
   */
  const removeScrollListener = () => {
    if (carouselRef.value?.carouselRef) {
      carouselRef.value.carouselRef.removeEventListener(
        "scroll",
        updateCurrentIndex
      );
    }
  };

  return {
    currentIndex,
    goToPrevious,
    goToNext,
    updateCurrentIndex,
    setupScrollListener,
    removeScrollListener,
  };
};

