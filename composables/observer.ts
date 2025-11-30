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

  let observer: IntersectionObserver | null = null;
  let stopWatcher: (() => void) | null = null;

  onMounted(() => {
    const setupObserver = () => {
      if (ref.value && !observer) {
        observer = new IntersectionObserver(
          handleIntersection,
          observerOptions
        );
        observer.observe(ref.value);
      }
    };

    // Try to setup immediately
    setupObserver();

    // Watch for ref changes in case it's not available yet
    stopWatcher = watch(
      () => ref.value,
      () => {
        setupObserver();
      },
      { immediate: true }
    );
  });

  onUnmounted(() => {
    if (stopWatcher) {
      stopWatcher();
    }
    if (observer && ref.value) {
      observer.unobserve(ref.value);
      observer.disconnect();
    }
  });
};
