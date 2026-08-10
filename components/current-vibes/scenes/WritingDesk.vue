<script setup lang="ts">
/**
 * Direction: manuscript on a quiet desk — typed line reveal, spring tilt,
 * carriage cursor. Content stays visible without waiting on animation.
 */
import { useSceneTilt } from "~/composables/current-vibes/use-scene-tilt";

const props = defineProps<{
  title?: string;
}>();

const {
  containerRef,
  reducedMotion,
  spring,
  transformStyle,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
} = useSceneTilt({ maxDeg: 7 });

const snippet = computed(() => {
  const raw = (props.title ?? "").trim();
  if (!raw) return "Untitled draft";
  return raw.length > 48 ? `${raw.slice(0, 48)}…` : raw;
});

const lines = [
  0.92, 0.78, 0.86, 0.64, 0.9, 0.72, 0.55, 0.84, 0.7, 0.48, 0.88, 0.62,
];

const paperShift = computed(() => {
  if (reducedMotion.value) return {};
  return {
    transform: `translate3d(${spring.x * 0.55}px, ${-spring.y * 0.55}px, 0)`,
  };
});

const carriagePct = ref(18);

let carriageRaf = 0;
let carriageStart = 0;

function tickCarriage(now: number) {
  if (reducedMotion.value) {
    carriagePct.value = 42;
    return;
  }
  if (!carriageStart) carriageStart = now;
  const elapsed = (now - carriageStart) / 1000;
  // Sweep across the line, pause, reset — typewriter cadence
  const cycle = elapsed % 4.2;
  if (cycle < 2.6) {
    carriagePct.value = 12 + (cycle / 2.6) * 72;
  } else if (cycle < 3.1) {
    carriagePct.value = 84;
  } else {
    carriagePct.value = 12;
  }
  carriageRaf = requestAnimationFrame(tickCarriage);
}

onMounted(() => {
  carriageRaf = requestAnimationFrame(tickCarriage);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(carriageRaf);
});

watch(reducedMotion, (off) => {
  if (off) {
    cancelAnimationFrame(carriageRaf);
    carriagePct.value = 42;
  } else {
    carriageStart = 0;
    carriageRaf = requestAnimationFrame(tickCarriage);
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 cursor-grab touch-none overflow-hidden bg-neutral-100 active:cursor-grabbing dark:bg-neutral-950"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerLeave"
  >
    <!-- Desk surface -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900"
      aria-hidden="true"
    />
    <!-- Soft desk wash -->
    <div
      class="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30"
      style="
        background: radial-gradient(
          ellipse 70% 55% at 50% 40%,
          transparent 0%,
          rgba(0, 0, 0, 0.12) 100%
        );
      "
      aria-hidden="true"
    />

    <div
      class="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-10"
      :style="transformStyle"
      style="transform-style: preserve-3d"
    >
      <div
        class="relative w-full max-w-[18rem]"
        :class="reducedMotion ? '' : 'animate-vibes-cover-float'"
        style="transform-style: preserve-3d"
      >
        <div
          class="relative w-full"
          :style="paperShift"
          style="transform-style: preserve-3d"
        >
        <!-- Stacked sheets -->
        <div
          class="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-sm bg-neutral-300/90 dark:bg-neutral-800/90"
          style="transform: translateZ(-14px)"
          aria-hidden="true"
        />
        <div
          class="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-sm bg-neutral-200 dark:bg-neutral-800"
          style="transform: translateZ(-7px)"
          aria-hidden="true"
        />

        <div
          class="relative overflow-hidden rounded-sm bg-neutral-50 px-5 py-6 outline outline-1 outline-black/10 dark:bg-neutral-900 dark:outline-white/10 sm:px-6 sm:py-7"
          style="transform: translateZ(0)"
        >
          <p
            class="relative mb-5 text-[11px] font-semibold tracking-tight text-neutral-900 [text-wrap:pretty] dark:text-neutral-100 sm:text-xs"
          >
            {{ snippet }}
          </p>

          <div class="relative flex flex-col gap-2.5" aria-hidden="true">
            <div
              v-for="(w, i) in lines"
              :key="i"
              class="h-[3px] origin-left rounded-full bg-neutral-400/75 dark:bg-neutral-600/85"
              :class="reducedMotion ? '' : 'animate-vibes-line-type'"
              :style="{
                width: `${w * 100}%`,
                opacity: 0.5 + (i % 3) * 0.14,
                animationDelay: reducedMotion ? '0ms' : `${i * 110}ms`,
              }"
            />
          </div>

          <!-- Carriage rail + cursor -->
          <div class="relative mt-6 h-4" aria-hidden="true">
            <div
              class="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-neutral-300 dark:bg-neutral-700"
            />
            <div
              class="absolute top-1/2 h-3.5 w-1.5 -translate-y-1/2 rounded-[1px] bg-neutral-800 dark:bg-neutral-200"
              :class="reducedMotion ? '' : 'animate-vibes-type-cursor'"
              :style="{ left: `${carriagePct}%` }"
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
