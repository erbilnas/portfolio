interface UseCategoryNavigationProps {
  maxCategories: number;
  isMobile?: boolean;
}

export const useCategoryNavigation = ({
  maxCategories,
  isMobile,
}: UseCategoryNavigationProps) => {
  const currentCategory = ref(0);

  const getCategoryStyle = (index: number) => {
    const diff = index - currentCategory.value;
    const scale = index === currentCategory.value ? 1 : 0.95;
    const opacity = index === currentCategory.value ? 1 : 0.5;
    const zIndex = maxCategories - Math.abs(diff);
    const transform = isMobile
      ? `translateX(${diff * 300}px) scale(${scale})`
      : `translateY(${diff * 20}px) scale(${scale})`;
    const widthScale = Math.max(0.85, 1 - Math.abs(diff) * 0.1);

    return {
      transform,
      opacity,
      zIndex,
      filter: index === currentCategory.value ? "blur(0)" : "blur(1px)",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      width: `${widthScale * 100}%`,
      margin: "0 auto",
    };
  };

  const goToPrevious = () => {
    if (currentCategory.value > 0) {
      currentCategory.value--;
    }
  };

  const goToNext = () => {
    if (currentCategory.value < maxCategories) {
      currentCategory.value++;
    }
  };

  const setCategory = (index: number) => {
    currentCategory.value = index;
  };

  // Add keyboard navigation
  onMounted(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeydown);

    onUnmounted(() => {
      window.removeEventListener("keydown", handleKeydown);
    });
  });

  return {
    currentCategory: readonly(currentCategory),
    getCategoryStyle,
    goToPrevious,
    goToNext,
    setCategory,
  };
};
