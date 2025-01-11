const observerOptions: IntersectionObserverInit = {
  root: null,
  threshold: 0.1,
};

export const useObserver = (section: string, ref: Ref<HTMLElement | null>) => {
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        useHead({
          titleTemplate: `${section} | Erbil Nas`,
        });
      }
    });
  };

  const observeSectionChange = () => {
    onMounted(() => {
      const observer = new IntersectionObserver(
        handleIntersection,
        observerOptions
      );

      if (ref.value) {
        observer.observe(ref.value);

        onUnmounted(() => {
          if (ref.value) {
            observer.unobserve(ref.value);

            observer.disconnect();
          }
        });
      }
    });
  };

  return {
    observeSectionChange,
  };
};
