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
/** Locale hello first so LCP/CLS never catch a mid-crossfade frame. */
const visibleWord = ref<string>(t("welcome.hello"));
const incomingWord = ref<string>(t("welcome.hello"));
/** 0 = visible word, 1 = incoming word */
const blend = ref(0);
const index = ref(0);
let cycleStartTimer: number | null = null;

const motionAllowed = computed(
  () => !reducedMotion.value && !prefersReduced.value,
);

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);
const easeIn = (t: number) => t * t;

/** Morph greeting → scroll line. Wait for a bit of scroll, then ease in. */
const startMix = computed(() => {
  const p = props.progress;
  return Math.min(1, Math.max(0, (p - 0.28) / 0.34));
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
/** Past typical Lighthouse LCP window before any greeting swap. */
const CYCLE_START_DELAY_MS = 10000;

let cycleTimer: number | null = null;
let crossRaf: number | null = null;
let crossStart = 0;

const clearTimers = () => {
  if (cycleStartTimer != null) {
    clearTimeout(cycleStartTimer);
    cycleStartTimer = null;
  }
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
  settleOnLocaleHello();
  // Mobile / coarse pointer: never cycle — stable LCP element.
  const cheapMotion =
    window.matchMedia("(pointer: coarse)").matches ||
    window.matchMedia("(max-width: 768px)").matches;
  if (!motionAllowed.value || cheapMotion) {
    return;
  }
  // Desktop: wait well past LCP before the first crossfade.
  const start = () => {
    if (cyclingPaused.value) return;
    index.value = 0;
    scheduleCycle();
  };
  const arm = () => {
    cycleStartTimer = window.setTimeout(start, CYCLE_START_DELAY_MS);
  };
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(arm, { timeout: 2000 });
  } else {
    arm();
  }
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <div
    class="relative mx-auto grid min-h-[clamp(5rem,19vw,12rem)] w-full place-items-center px-2"
    aria-live="polite"
  >
    <span class="sr-only">{{ t("welcome.hello") }}</span>

    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-center text-[clamp(4.5rem,18vw,11rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="visibleStyle"
    >
      {{ visibleWord }}
    </span>
    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-center text-[clamp(4.5rem,18vw,11rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="incomingStyle"
    >
      {{ incomingWord }}
    </span>
    <span
      aria-hidden="true"
      class="col-start-1 row-start-1 origin-center text-balance text-center text-[clamp(3rem,11vw,7rem)] font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
      :style="startStyle"
    >
      {{ startText }}
    </span>
  </div>
</template>
