<script lang="ts" setup>
import { useMediaQuery } from "@vueuse/core";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

interface NavigationProps {
  index: {
    current: number;
    max: number;
  };
  navigation: {
    previous: () => void;
    next: () => void;
  };
  items: unknown[];
}

const props = defineProps<NavigationProps>();

const isMobile = useMediaQuery("(max-width: 768px)");
</script>

<template>
  <div
    class="flex flex-col justify-center items-center gap-4 py-2"
    role="navigation"
    aria-label="Navigation"
  >
    <div v-if="isMobile" class="text-white/80 flex items-center gap-2">
      <Icon name="ph:hand-swipe-left" class="w-5 h-5 animate-pulse" />

      <span class="text-sm">Swipe to navigate</span>
    </div>

    <div class="flex flex-row justify-center items-center gap-4">
      <Button
        v-if="!isMobile"
        size="icon"
        @click="navigation.previous"
        :disabled="index.current === 0"
        class="rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 border border-slate-800/50 hover:border-violet-500/50"
        aria-label="Previous item"
      >
        <ChevronLeft />
      </Button>

      <div
        class="flex justify-center items-center gap-2"
        role="tablist"
        aria-label="Navigation indicators"
      >
        <Button
          v-for="(_, idx) in items"
          aria-label="Navigation tab"
          role="tab"
          :key="idx"
          class="w-6 h-1.5 sm:h-2 rounded-full transition-all duration-300 focus:outline-none group-hover:scale-110 relative overflow-hidden"
          :class="[
            idx === index.current
              ? 'bg-gradient-to-r from-violet-500 to-violet-700 shadow-glow'
              : 'bg-white/10 hover:bg-white/20',
          ]"
        >
          <div
            v-if="idx === index.current"
            class="absolute inset-0 bg-gradient-to-r from-violet-400/20 to-violet-600/20 animate-pulse-subtle blur-sm"
          />
        </Button>
      </div>

      <Button
        v-if="!isMobile"
        class="rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 border border-slate-800/50 hover:border-violet-500/50"
        size="icon"
        @click="navigation.next"
        :disabled="index.current === index.max"
        aria-label="Next item"
      >
        <ChevronRight />
      </Button>
    </div>
  </div>
</template>
