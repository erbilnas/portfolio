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
}

const props = defineProps<NavigationProps>();

const isMobile = useMediaQuery("(max-width: 768px)");

const baseButtonClasses = [
  "absolute",
  "top-1/2",
  "-translate-y-1/2",
  "transform",
  "text-white/50",
  "hover:text-white",
  "disabled:opacity-30",
  "disabled:cursor-not-allowed",
  "transition-all",
  "duration-300",
  "hover:scale-110",
  "disabled:hover:scale-100",
  "bg-slate-900/50",
  "rounded-full",
  "backdrop-blur-sm",
  "border",
  "border-slate-800/50",
  "hover:border-violet-500/50",
  "disabled:hover:border-slate-800/50",
];

const previousButtonClasses = [
  ...baseButtonClasses,
  "left-0",
  "translate-x-1",
  "sm:translate-x-2",
];

const nextButtonClasses = [
  ...baseButtonClasses,
  "right-0",
  "-translate-x-1",
  "sm:-translate-x-2",
];
</script>

<template>
  <div>
    <Button
      v-if="!isMobile"
      size="icon"
      @click="navigation.previous"
      :disabled="index.current === 0"
      :class="previousButtonClasses"
    >
      <ChevronLeft />
    </Button>

    <Button
      v-if="!isMobile"
      size="icon"
      @click="navigation.next"
      :disabled="index.current === index.max"
      :class="nextButtonClasses"
    >
      <ChevronRight />
    </Button>
  </div>
</template>
