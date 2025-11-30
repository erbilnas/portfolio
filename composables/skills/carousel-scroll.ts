import { ref, nextTick, watch, type Ref } from "vue";
import { useMediaQuery } from "~/composables/use-media-query-client";

/**
 * Composable for managing carousel scroll functionality
 */
export const useCarouselScroll = (
  carouselRef: Ref<HTMLDivElement | null>,
  activeTab: Ref<string>
) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const canScrollLeft = ref(false);
  const canScrollRight = ref(true);
  let resizeObserver: ResizeObserver | null = null;

  const checkScrollability = () => {
    if (carouselRef.value) {
      requestAnimationFrame(() => {
        if (!carouselRef.value) return;

        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value;
        const threshold = 1; // Small threshold to account for rounding

        canScrollLeft.value = scrollLeft > threshold;
        canScrollRight.value = scrollLeft < scrollWidth - clientWidth - threshold;
      });
    }
  };

  const scrollLeft = () => {
    if (carouselRef.value) {
      const scrollAmount = isMobile.value
        ? carouselRef.value.clientWidth * 0.8
        : 600;
      carouselRef.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.value) {
      const scrollAmount = isMobile.value
        ? carouselRef.value.clientWidth * 0.8
        : 600;
      carouselRef.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const setupScrollListeners = () => {
    if (carouselRef.value) {
      carouselRef.value.addEventListener("scroll", checkScrollability);

      // Use ResizeObserver to detect content size changes
      resizeObserver = new ResizeObserver(() => {
        checkScrollability();
      });
      resizeObserver.observe(carouselRef.value);

      // Initial check after a short delay to ensure content is rendered
      nextTick(() => {
        setTimeout(checkScrollability, 100);
      });
    }
  };

  const cleanupScrollListeners = () => {
    if (carouselRef.value) {
      carouselRef.value.removeEventListener("scroll", checkScrollability);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };

  // Watch for tab changes and reset scroll position
  watch(activeTab, async () => {
    if (carouselRef.value) {
      // Reset scroll position immediately
      carouselRef.value.scrollTo({ left: 0, behavior: "smooth" });

      // Wait for transition to complete (500ms) + DOM update
      await nextTick();
      setTimeout(() => {
        checkScrollability();
      }, 600); // Slightly longer than transition duration (500ms)
    }
  });

  return {
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
    checkScrollability,
    setupScrollListeners,
    cleanupScrollListeners,
  };
};

