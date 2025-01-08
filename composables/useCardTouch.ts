import { ref, type Ref } from "vue";

interface TouchState {
  touchStartX: Ref<number>;
  isDragging: Ref<boolean>;
  currentTouchX: Ref<number>;
}

const SWIPE_THRESHOLD = 50;

export const useCardTouch = (
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): TouchState & {
  handleTouchStart: (e: TouchEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  handleTouchEnd: () => void;
} => {
  const touchStartX: Ref<number> = ref(0);
  const isDragging: Ref<boolean> = ref(false);
  const currentTouchX: Ref<number> = ref(0);

  const handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    if (!touch) return;

    touchStartX.value = touch.clientX;
    currentTouchX.value = touch.clientX;
    isDragging.value = true;
  };

  const handleTouchMove = (e: TouchEvent): void => {
    if (!isDragging.value) return;

    const touch = e.touches[0];
    if (!touch) return;

    currentTouchX.value = touch.clientX;
  };

  const handleTouchEnd = (): void => {
    if (!isDragging.value) return;

    const diff = currentTouchX.value - touchStartX.value;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
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
