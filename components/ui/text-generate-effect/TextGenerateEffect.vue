<template>
  <div
    :class="
      cn(
        'flex w-full justify-center items-center leading-snug tracking-wide',
        props.class
      )
    "
  >
    <div ref="scope" class="text-center">
      <span
        v-for="(word, idx) in wordsArray"
        :key="word + idx"
        class="inline-block"
        :style="spanStyle"
      >
        {{ word }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  type HTMLAttributes,
  nextTick,
  onMounted,
  ref,
  watch,
} from "vue";

import { cn } from "@/lib/utils";
import { useSettings } from "~/composables/settings";

const props = withDefaults(
  defineProps<{
    words: string;
    filter?: boolean;
    duration?: number;
    delay?: number;
    class: HTMLAttributes["class"];
  }>(),
  { duration: 0.7, delay: 0, filter: true }
);

const { reducedMotion } = useSettings();
const scope = ref(null);
const wordsArray = computed(() => props.words.split(" "));

// Visible by default — never gate copy on animation completing.
const spanStyle = computed(() => ({
  opacity: 1,
  filter: "none",
  transition: `opacity ${props.duration}s, filter ${props.duration}s`,
}));

function shouldAnimate() {
  if (reducedMotion.value) return false;
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function animateWords() {
  if (!scope.value) return;

  const spans = (scope.value as HTMLElement).querySelectorAll("span");

  spans.forEach((span: HTMLElement) => {
    span.style.opacity = "1";
    span.style.filter = "none";
  });

  if (!shouldAnimate()) return;

  spans.forEach((span: HTMLElement) => {
    span.style.opacity = "0";
    span.style.filter = props.filter ? "blur(10px)" : "none";
  });

  setTimeout(() => {
    spans.forEach((span: HTMLElement, index: number) => {
      setTimeout(() => {
        span.style.opacity = "1";
        span.style.filter = props.filter ? "blur(0px)" : "none";
      }, index * 200);
    });
  }, props.delay);
}

onMounted(() => {
  nextTick(() => {
    animateWords();
  });
});

watch(
  () => props.words,
  () => {
    nextTick(() => {
      animateWords();
    });
  }
);
</script>
