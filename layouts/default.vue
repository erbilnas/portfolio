<template>
  <header class="sticky top-0 z-50 w-full h-1">
    <Progress :model-value="scrollProgress" />
  </header>

  <main>
    <SpeedInsights />
    <Cursor />
    <slot />
  </main>

  <footer>
    <Navbar />
  </footer>
</template>

<script setup lang="ts">
import { Cursor } from "@/components/ui/cursor";
import { SpeedInsights } from "@vercel/speed-insights/vue";

const scrollProgress = ref(0);

onMounted(() => {
  const updateProgress = () => {
    const winScroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.value = (winScroll / height) * 100;
  };

  window.addEventListener("scroll", updateProgress);
  updateProgress();

  onUnmounted(() => {
    window.removeEventListener("scroll", updateProgress);
  });
});
</script>
