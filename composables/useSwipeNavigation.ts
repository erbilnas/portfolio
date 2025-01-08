export const useSwipeNavigation = (options: {
  onPrevious: () => void;
  onNext: () => void;
  threshold?: number;
  isMobile?: boolean;
}) => {
  const touchStartX = ref(0);
  const isDragging = ref(false);
  const currentTouchX = ref(0);

  const handleTouchStart = (e: TouchEvent) => {
    isDragging.value = true;
    touchStartX.value = e.touches[0].clientX;
    currentTouchX.value = touchStartX.value;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    currentTouchX.value = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isDragging.value) return;

    const swipeThreshold = options.threshold ?? 50;
    const diff = currentTouchX.value - touchStartX.value;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        options.onPrevious();
      } else {
        options.onNext();
      }
    }

    isDragging.value = false;
  };

  return {
    touchStartX,
    isDragging,
    currentTouchX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};
