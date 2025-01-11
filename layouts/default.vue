<template>
  <header class="sticky top-0 z-50 w-full h-1">
    <Progress :model-value="scrollProgress" />
  </header>

  <main>
    <SpeedInsights />
    <slot />
  </main>

  <footer
    class="fixed bottom-0 left-0 right-0 transition-all duration-500 ease-in-out transform"
    :class="{
      'translate-y-full opacity-0': isNavbarHidden,
      'translate-y-0 opacity-100': !isNavbarHidden,
    }"
  >
    <Navbar />
  </footer>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/vue";
import { useThrottleFn } from "@vueuse/core";

const scrollProgress = ref(0);
const lastScrollPosition = ref(0);
const isNavbarHidden = ref(false);

const SCROLL_THRESHOLD = 50;
const SCROLL_DELAY = 50;

const handleScroll = () => {
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

// Throttle the scroll handler for better performance
const throttledScrollHandler = useThrottleFn(handleScroll, SCROLL_DELAY);

onMounted(() => {
  window.addEventListener("scroll", throttledScrollHandler);
  handleScroll(); // Initial call

  onUnmounted(() => {
    window.removeEventListener("scroll", throttledScrollHandler);
  });
});
</script>
