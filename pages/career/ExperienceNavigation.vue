<script setup lang="ts">
import { Button } from "@/components/ui/button";

interface Props {
  currentIndex: number;
  maxIndex: number;
  isMobile: boolean;
}

interface Emits {
  (e: "previous"): void;
  (e: "next"): void;
  (e: "select", index: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <!-- Navigation buttons at sides - visible on desktop -->
  <div
    v-if="!isMobile"
    class="absolute inset-x-0 top-0 -translate-y-1/2 flex items-center justify-between px-4"
    role="navigation"
    aria-label="Experience navigation"
  >
    <Button
      variant="ghost"
      size="icon"
      class="group w-12 h-12 rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 -translate-x-4 border border-slate-800/50 hover:border-violet-500/50"
      :disabled="currentIndex === 0"
      @click="emit('previous')"
      aria-label="Previous experience"
    >
      <Icon
        name="ph:arrow-left-bold"
        class="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition-colors"
      />
    </Button>

    <Button
      variant="ghost"
      size="icon"
      class="group w-12 h-12 rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 translate-x-4 border border-slate-800/50 hover:border-violet-500/50"
      :disabled="currentIndex === maxIndex"
      @click="emit('next')"
      aria-label="Next experience"
    >
      <Icon
        name="ph:arrow-right-bold"
        class="w-6 h-6 text-slate-400 group-hover:text-violet-400 transition-colors"
      />
    </Button>
  </div>

  <!-- Progress indicator at bottom -->
  <div
    class="absolute top-0 left-0 right-0 flex justify-center gap-2 sm:gap-3 pb-4 sm:pb-6"
    role="tablist"
  >
    <button
      v-for="index in maxIndex + 1"
      :key="index - 1"
      class="group relative"
      @click="emit('select', index - 1)"
      :aria-selected="index - 1 === currentIndex"
      :aria-label="'View experience ' + index"
      role="tab"
    >
      <div
        class="w-12 sm:w-16 h-1 sm:h-1.5 rounded-full transition-all duration-300 focus:outline-none group-hover:scale-110"
        :class="[
          index - 1 === currentIndex
            ? 'bg-gradient-to-r from-violet-500 to-violet-700 scale-110'
            : 'bg-slate-700/50 scale-100 group-hover:bg-slate-600/50',
        ]"
      />
      <div
        v-if="index - 1 === currentIndex"
        class="absolute inset-0 -z-10 blur-lg bg-violet-500/20 rounded-full"
      />
    </button>
  </div>

  <!-- Mobile swipe indicator -->
  <div
    v-if="isMobile"
    class="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-muted-foreground flex items-center gap-1.5 sm:gap-2 animate-fade-in bg-slate-950/30 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-slate-800/50"
    aria-hidden="true"
  >
    <Icon
      name="ph:hand-swipe-left"
      class="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-violet-400"
    />
    <span class="text-xs sm:text-sm text-slate-400">Swipe to navigate</span>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
</style>
