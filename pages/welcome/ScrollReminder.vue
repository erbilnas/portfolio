<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";

const isMobile = useMediaQuery("(max-width: 768px)");
</script>

<template>
  <div
    class="flex flex-col items-center gap-2 text-muted-foreground animate-bounce"
  >
    <Icon name="ph:mouse-simple" :size="16" />

    <span class="text-sm font-light"
      >{{ isMobile ? "Swipe" : "Scroll" }} to see more</span
    >
  </div>
</template>
