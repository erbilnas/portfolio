<template>
  <div
    ref="trackRef"
    :class="cn('relative z-0 h-[135vh]', props.class)"
  >
    <div
      class="sticky top-0 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-4 py-24 md:gap-10 md:py-28"
    >
      <p
        class="w-full text-pretty text-center text-2xl font-light leading-relaxed tracking-tight text-gray-900 md:text-4xl md:leading-snug dark:text-white"
      >
        <ScrollWord
          v-for="(word, i) in units"
          :key="`${i}-${word}`"
          :word="word"
          :progress="scrollProgress"
          :range="rangeFor(i)"
          :reduced-motion="motionOff"
          :trailing-space="i < units.length - 1"
        />
      </p>

      <p
        v-if="detail"
        class="max-w-xl text-pretty text-center text-base font-light leading-relaxed text-gray-600 transition-opacity duration-200 ease-out md:text-lg dark:text-gray-300"
        :style="{ opacity: detailOpacity }"
      >
        {{ detail }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMediaQuery } from "@/composables/use-media-query-client";
import { cn } from "~/lib/utils";
import ScrollWord from "./ScrollWord.vue";

interface Props {
  class?: string;
  text: string;
  detail?: string;
}

const props = defineProps<Props>();

const { reducedMotion } = useSettings();
const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
const motionOff = computed(
  () => reducedMotion.value || prefersReduced.value,
);

const trackRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);

const units = computed(() => splitRevealUnits(props.text));

const detailOpacity = computed(() => {
  if (!props.detail) return 0;
  if (motionOff.value) return 1;
  // Keep readable, then settle to full as the lead finishes.
  const t = clamp01((scrollProgress.value - 0.55) / 0.35);
  return 0.4 + t * 0.6;
});

const rangeFor = (index: number): [number, number] => {
  const total = Math.max(units.value.length, 1);
  const start = index / total;
  const end = (index + 1) / total;
  return [start, end];
};

function splitRevealUnits(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (/\s/.test(trimmed)) {
    return trimmed.split(/\s+/).filter(Boolean);
  }

  const clauses = trimmed
    .split(/(?<=[。、．！？!?])/)
    .map((part) => part.trim())
    .filter(Boolean);

  return clauses.length > 0 ? clauses : [trimmed];
}

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function updateScrollProgress() {
  if (motionOff.value) {
    scrollProgress.value = 1;
    return;
  }

  const track = trackRef.value;
  if (!track) return;

  const rect = track.getBoundingClientRect();
  const travel = Math.max(track.offsetHeight - window.innerHeight, 1);
  scrollProgress.value = clamp01(-rect.top / travel);
}

let ticking = false;
function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateScrollProgress();
    ticking = false;
  });
}

onMounted(() => {
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
  updateScrollProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
});

watch(motionOff, (off) => {
  if (off) scrollProgress.value = 1;
  else updateScrollProgress();
});
</script>
