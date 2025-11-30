<template>
  <header v-if="!isMobile" class="sticky top-0 z-50 w-full h-1">
    <Progress :model-value="scrollProgress" />
  </header>

  <ScrollIsland v-if="isMobile" title="Scroll to see more" />

  <main>
    <SpeedInsights />

    <AdBlockWarning />
    <slot />
  </main>

  <footer
    class="fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out transform"
    :class="{
      'translate-y-full opacity-0': isNavbarHidden,
      'translate-y-0 opacity-100': !isNavbarHidden,
    }"
  >
    <Navbar />
  </footer>
</template>

<script setup lang="ts">
import { ScrollIsland } from "@/components/ui/scroll-island";
import { SpeedInsights } from "@vercel/speed-insights/vue";

const scrollProgress = ref(0);
const lastScrollPosition = ref(0);
const isNavbarHidden = ref(false);
const isMobile = ref(false);

const SCROLL_THRESHOLD = 50;
const SCROLL_DELAY = 50;

const handleScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const currentScrollPosition = window.scrollY;
  const winScroll = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;

  // Update progress bar
  scrollProgress.value = (winScroll / height) * 100;

  // Don't hide navbar if we're at the top of the page
  if (currentScrollPosition < SCROLL_THRESHOLD) {
    isNavbarHidden.value = false;
    lastScrollPosition.value = currentScrollPosition;
    return;
  }

  // Don't hide navbar if we're at the bottom of the page
  if (
    currentScrollPosition + window.innerHeight >=
    document.documentElement.scrollHeight - SCROLL_THRESHOLD
  ) {
    isNavbarHidden.value = false;
    lastScrollPosition.value = currentScrollPosition;
    return;
  }

  // Determine scroll direction
  if (
    Math.abs(currentScrollPosition - lastScrollPosition.value) <
    SCROLL_THRESHOLD
  ) {
    lastScrollPosition.value = currentScrollPosition;
    return;
  }

  lastScrollPosition.value = currentScrollPosition;
};

// Simple throttle implementation to avoid VueUse import on server
const throttle = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  return ((...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      fn(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
};

// Throttle the scroll handler for better performance
const throttledScrollHandler = throttle(handleScroll, SCROLL_DELAY);

onMounted(() => {
  // Only run on client side
  if (typeof window === "undefined" || typeof document === "undefined") return;

  // Detect mobile devices
  if (typeof navigator !== "undefined") {
    const userAgent =
      navigator.userAgent || navigator.vendor || (window as any).opera;
    // Check for mobile devices: iPhone, iPad, Android, and other mobile user agents
    isMobile.value =
      /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile|mobile|CriOS/i.test(
        userAgent
      ) ||
      (window.innerWidth <= 768 && "ontouchstart" in window);
  }

  window.addEventListener("scroll", throttledScrollHandler);
  handleScroll(); // Initial call

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", throttledScrollHandler);
    }
  });
});
</script>
