<script setup lang="ts">
import { WELCOME_HELLOS } from "~/constants/welcome-hellos";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  /** 0–1 scroll progress through Welcome. */
  progress: number;
}>();

const { t } = useI18n();
const { reducedMotion } = useSettings();

const prefersReduced = ref(false);
const visibleWord = ref<string>(WELCOME_HELLOS[0]!);
const incomingWord = ref<string>(WELCOME_HELLOS[1]!);
/** 0 = visible word, 1 = incoming word */
const blend = ref(0);
const index = ref(0);

const motionAllowed = computed(
  () => !reducedMotion.value && !prefersReduced.value,
);

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const easeIn = (t: number) => t * t;

/** Morph greeting → scroll line. Exit builds (ease-in), entrance settles (ease-out). */
const startMix = computed(() => {
  const p = props.progress;
  return Math.min(1, Math.max(0, (p - 0.06) / 0.38));
});

const greetingMix = computed(() => 1 - easeIn(startMix.value));
const startReveal = computed(() => easeOut(startMix.value));

const cyclingPaused = computed(
  () => startMix.value > 0.015 || !motionAllowed.value,
);

const startText = computed(() => t("welcome.letsStart"));

const visibleStyle = computed(() => ({
  opacity: (1 - easeIn(blend.value)) * greetingMix.value,
  transform: `scale(${1 - startMix.value * 0.03})`,
}));

const incomingStyle = computed(() => ({
  opacity: easeOut(blend.value) * greetingMix.value,
  transform: `scale(${1 - startMix.value * 0.03})`,
}));

const startStyle = computed(() => ({
  opacity: startReveal.value,
  transform: `scale(${0.97 + startReveal.value * 0.03})`,
}));

const CYCLE_MS = 2000;
const CROSS_MS = 200;

let cycleTimer: number | null = null;
let crossRaf: number | null = null;
let crossStart = 0;

const clearTimers = () => {
  if (cycleTimer != null) {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }
  if (crossRaf != null) {
    cancelAnimationFrame(crossRaf);
    crossRaf = null;
  }
};

const settleOnLocaleHello = () => {
  visibleWord.value = t("welcome.hello");
  incomingWord.value = t("welcome.hello");
  blend.value = 0;
};

const runCrossfade = (nextWord: string) => {
  incomingWord.value = nextWord;
  blend.value = 0;
  crossStart = performance.now();

  const step = (now: number) => {
    const tNorm = Math.min(1, (now - crossStart) / CROSS_MS);
    blend.value = tNorm;
    if (tNorm < 1) {
      crossRaf = requestAnimationFrame(step);
      return;
    }
    blend.value = 1;
    visibleWord.value = nextWord;
    blend.value = 0;
    crossRaf = null;
    scheduleCycle();
  };

  crossRaf = requestAnimationFrame(step);
};

const scheduleCycle = () => {
  if (cycleTimer != null) {
    clearTimeout(cycleTimer);
    cycleTimer = null;
  }
  if (cyclingPaused.value) return;
  cycleTimer = window.setTimeout(() => {
    index.value = (index.value + 1) % WELCOME_HELLOS.length;
    runCrossfade(WELCOME_HELLOS[index.value]!);
  }, CYCLE_MS);
};

watch(cyclingPaused, (paused) => {
  if (paused) {
    clearTimers();
    settleOnLocaleHello();
    return;
  }
  scheduleCycle();
});

onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    prefersReduced.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }
  if (!motionAllowed.value) {
    settleOnLocaleHello();
    return;
  }
  scheduleCycle();
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <div
    class="relative mx-auto grid min-h-[clamp(4.5rem,17vw,10rem)] w-full place-items-center px-2"
    aria-live="polite"
  >
    <span class="sr-only">{{ t("welcome.hello") }}</span>

    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-center text-[clamp(4.25rem,16vw,9.5rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="visibleStyle"
    >
      {{ visibleWord }}
    </span>
    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-center text-[clamp(4.25rem,16vw,9.5rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="incomingStyle"
    >
      {{ incomingWord }}
    </span>
    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-balance text-center text-[clamp(2.75rem,9vw,5.75rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="startStyle"
    >
      {{ startText }}
    </span>
  </div>
</template>
