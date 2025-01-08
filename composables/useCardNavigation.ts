import { ref, type Ref } from "vue";
import type { Card } from "~/types/current-vibes";

interface CardStyle {
  transform: string;
  zIndex: number;
  transition: string;
}

const CARD_DISTANCE = 300;
const ACTIVE_SCALE = 1.1;
const INACTIVE_SCALE = 0.8;
const ACTIVE_Z_INDEX = 10;
const INACTIVE_Z_INDEX = 0;
const TRANSITION = "all 0.5s ease-in-out";

export const useCardNavigation = (cards: Card[]) => {
  const currentIndex: Ref<number> = ref(0);

  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        navigateToPrev();
        break;
      case "ArrowRight":
        navigateToNext();
        break;
    }
  };

  const getCardStyle = (index: number): CardStyle => {
    const diff = index - currentIndex.value;
    const isActive = index === currentIndex.value;

    return {
      transform: `translateX(${diff * CARD_DISTANCE}px) scale(${
        isActive ? ACTIVE_SCALE : INACTIVE_SCALE
      })`,
      zIndex: isActive ? ACTIVE_Z_INDEX : INACTIVE_Z_INDEX,
      transition: TRANSITION,
    };
  };

  const navigateToNext = () => {
    currentIndex.value = (currentIndex.value + 1) % cards.length;
  };

  const navigateToPrev = () => {
    currentIndex.value = (currentIndex.value - 1 + cards.length) % cards.length;
  };

  return {
    currentIndex,
    handleKeydown,
    getCardStyle,
    navigateToNext,
    navigateToPrev,
  };
};
