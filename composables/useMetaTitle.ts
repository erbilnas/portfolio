export const useMetaTitle = (
  sectionRef: Ref<HTMLElement | null>,
  title: string
) => {
  const updateMetaTitle = (): void => {
    useHead({
      title,
    });
  };

  const handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateMetaTitle();
      }
    });
  };

  onMounted(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0.1,
    });

    if (sectionRef.value) {
      observer.observe(sectionRef.value);
    }

    onUnmounted(() => {
      if (sectionRef.value) {
        observer.unobserve(sectionRef.value);
      }
    });
  });

  return {
    updateMetaTitle,
  };
};
