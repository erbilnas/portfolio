export const useNavigation = (currentIndex: Ref<number>, maxIndex: number) => {
  const touchStartX = ref(0);
  const touchDeltaX = ref(0);
  const isDragging = ref(false);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    isDragging.value = true;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;

    const currentX = e.touches[0].clientX;
    touchDeltaX.value = currentX - touchStartX.value;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.value) > 100) {
      if (touchDeltaX.value > 0 && currentIndex.value > 0) {
        goToPrevious();
      } else if (touchDeltaX.value < 0 && currentIndex.value < maxIndex) {
        goToNext();
      }
    }

    touchDeltaX.value = 0;
    isDragging.value = false;
  };

  const goToPrevious = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const goToNext = () => {
    if (currentIndex.value < maxIndex) {
      currentIndex.value++;
    }
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToPrevious,
    goToNext,
  };
};
