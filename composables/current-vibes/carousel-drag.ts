import { ref } from "vue";
import type { Ref } from "vue";

export const useCarouselDrag = (
  currentIndex: Ref<number>,
  maxIndex: Ref<number>,
  goToPrevious: () => void,
  goToNext: () => void
) => {
  const touchStartX = ref(0);
  const touchDeltaX = ref(0);
  const isDragging = ref(false);
  const mouseStartX = ref(0);
  const mouseDeltaX = ref(0);
  const isMouseDown = ref(false);

  /**
   * Handle touch start event
   */
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    isDragging.value = true;
  };

  /**
   * Handle touch move event
   */
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value) return;
    const currentX = e.touches[0].clientX;
    touchDeltaX.value = currentX - touchStartX.value;
  };

  /**
   * Handle touch end event
   */
  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.value) > 100) {
      if (touchDeltaX.value > 0 && currentIndex.value > 0) {
        goToPrevious();
      } else if (touchDeltaX.value < 0 && currentIndex.value < maxIndex.value) {
        goToNext();
      }
    }
    touchDeltaX.value = 0;
    isDragging.value = false;
  };

  /**
   * Handle mouse down event
   */
  const handleMouseDown = (e: MouseEvent) => {
    mouseStartX.value = e.clientX;
    isMouseDown.value = true;
    isDragging.value = true;
    e.preventDefault();
  };

  /**
   * Handle mouse move event
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown.value) return;
    const currentX = e.clientX;
    mouseDeltaX.value = currentX - mouseStartX.value;
  };

  /**
   * Handle mouse up event
   */
  const handleMouseUp = () => {
    if (isMouseDown.value) {
      if (Math.abs(mouseDeltaX.value) > 100) {
        if (mouseDeltaX.value > 0 && currentIndex.value > 0) {
          goToPrevious();
        } else if (
          mouseDeltaX.value < 0 &&
          currentIndex.value < maxIndex.value
        ) {
          goToNext();
        }
      }
      mouseDeltaX.value = 0;
      isMouseDown.value = false;
      isDragging.value = false;
    }
  };

  /**
   * Handle mouse leave event
   */
  const handleMouseLeave = () => {
    if (isMouseDown.value) {
      mouseDeltaX.value = 0;
      isMouseDown.value = false;
      isDragging.value = false;
    }
  };

  /**
   * Setup global mouse event listeners
   */
  const setupMouseListeners = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  /**
   * Remove global mouse event listeners
   */
  const removeMouseListeners = () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  return {
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
  };
};

