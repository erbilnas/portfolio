<script setup lang="ts">
// No props needed for this component
</script>

<template>
  <div class="text-center mb-8">
    <h1 class="text-4xl md:text-6xl font-bold animate-title-float">
      <span class="inline-block text-gray-900 dark:text-white">
        Current Vibes
      </span>
    </h1>
    <p class="text-foreground/80 mt-3 text-sm md:text-base animate-title-fade">
      Discover what keeps me going
    </p>
    <div
      class="flex items-center justify-center gap-2 mt-4 text-gray-900/60 dark:text-white/60 text-xs md:text-sm animate-title-fade"
    >
      <Icon name="ph:hand-swipe-left" class="w-5 h-5 animate-pulse" />
      <span>Swipe or drag to navigate</span>
    </div>
  </div>
</template>
