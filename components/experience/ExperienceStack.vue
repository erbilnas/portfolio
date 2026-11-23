<script setup lang="ts">
import { useCalculateYears } from "~/composables/experience/duration-calculation";
import { useCalculateYearsFromYear } from "~/composables/experience/duration-calculation";
import { useSettings } from "~/composables/settings";
import type { TimelineItem } from "~/types/experience";
import EducationEntry from "./EducationEntry.vue";
import ExperienceEntry from "./ExperienceEntry.vue";

interface Props {
  items: TimelineItem[];
}

const props = defineProps<Props>();

const { reducedMotion } = useSettings();
const activeIndex = ref(0);
const slideDirection = ref<"next" | "prev">("next");
const calculateYears = useCalculateYears();
const calculateYearsFromYear = useCalculateYearsFromYear();

const dragX = ref(0);
const dragging = ref(false);
const settling = ref(false);
let settleTimer: ReturnType<typeof setTimeout> | null = null;

const clearSettleTimer = () => {
  if (settleTimer) {
    clearTimeout(settleTimer);
    settleTimer = null;
  }
};

watch(
  () => props.items,
  () => {
    activeIndex.value = 0;
    slideDirection.value = "next";
    dragX.value = 0;
    dragging.value = false;
    settling.value = false;
    clearSettleTimer();
  },
);

onBeforeUnmount(() => {
  clearSettleTimer();
});

const count = computed(() => props.items.length);
const slideName = computed(() =>
  slideDirection.value === "next" ? "stack-next" : "stack-prev",
);

const itemKey = (item: TimelineItem, index: number) =>
  item.type === "experience"
    ? `exp-${item.data.company}-${index}`
    : `edu-${item.data.school}-${index}`;

const org = (item: TimelineItem) =>
  item.type === "experience" ? item.data.company : item.data.school;

const title = (item: TimelineItem) =>
  item.type === "experience"
    ? item.data.currentPosition
    : item.data.degree;

const meta = (item: TimelineItem) => {
  if (item.type === "experience") {
    return `${item.data.period} · ${calculateYears(item.data.period)}`;
  }
  return `${item.data.year} · ${calculateYearsFromYear(item.data.year)}`;
};

const go = (index: number) => {
  if (index < 0 || index >= count.value || index === activeIndex.value) return;
  slideDirection.value = index > activeIndex.value ? "next" : "prev";
  activeIndex.value = index;
  dragX.value = 0;
  dragging.value = false;
  settling.value = false;
  clearSettleTimer();
};

const prev = () => go(activeIndex.value - 1);
const next = () => go(activeIndex.value + 1);

const SWIPE_THRESHOLD_PX = 56;
const PEEK_STEP_PX = 10;
const DRAG_RESISTANCE = 0.72;
const SETTLE_MS = 320;
const peekCount = computed(() =>
  Math.min(2, Math.max(0, count.value - activeIndex.value - 1)),
);

const swipe = ref<{
  pointerId: number;
  x: number;
  y: number;
  locked: "x" | "y" | null;
} | null>(null);

const onPointerDown = (event: PointerEvent) => {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  swipe.value = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    locked: null,
  };
  dragging.value = false;
  dragX.value = 0;
};

const onPointerMove = (event: PointerEvent) => {
  const start = swipe.value;
  if (!start || start.pointerId !== event.pointerId) return;

  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;

  if (!start.locked) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    // Lock axis once: horizontal swipes the deck, vertical stays page scroll.
    start.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
  }

  if (start.locked !== "x" || reducedMotion.value) return;

  event.preventDefault();
  dragging.value = true;

  let offset = dx * DRAG_RESISTANCE;
  // Soft edge resistance past first / last card.
  if (
    (activeIndex.value === 0 && offset > 0) ||
    (activeIndex.value >= count.value - 1 && offset < 0)
  ) {
    offset *= 0.35;
  }
  dragX.value = offset;
};

const endSwipe = (event: PointerEvent) => {
  const start = swipe.value;
  if (!start || start.pointerId !== event.pointerId) return;

  const dx = event.clientX - start.x;
  const wasHorizontal = start.locked === "x";
  swipe.value = null;

  if (wasHorizontal && Math.abs(dx) >= SWIPE_THRESHOLD_PX) {
    if (dx < 0) next();
    else prev();
    return;
  }

  dragging.value = false;
  if (reducedMotion.value || Math.abs(dragX.value) < 0.5) {
    dragX.value = 0;
    settling.value = false;
    return;
  }

  settling.value = true;
  // Double-rAF so the browser applies transition-none → settle class before zeroing.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dragX.value = 0;
      clearSettleTimer();
      settleTimer = setTimeout(() => {
        settling.value = false;
        settleTimer = null;
      }, SETTLE_MS);
    });
  });
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    prev();
    return;
  }
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    next();
  }
};

const activeItem = computed(() => props.items[activeIndex.value]);

const frontCardStyle = computed(() => {
  if (reducedMotion.value) return undefined;
  if (!dragging.value && !settling.value && dragX.value === 0) {
    return undefined;
  }
  return {
    transform: `translate3d(${dragX.value}px, 0, 0)`,
  };
});

const frontCardClass = computed(() => {
  if (reducedMotion.value) return "";
  if (dragging.value) return "transition-none";
  if (settling.value) return "experience-drag-settle";
  return "";
});
</script>

<template>
  <div
    class="mx-auto w-full max-w-2xl outline-none"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div
      class="touch-pan-y"
      aria-live="polite"
      :style="{
        paddingBottom: `${peekCount * PEEK_STEP_PX + (peekCount ? 4 : 0)}px`,
      }"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endSwipe"
      @pointercancel="endSwipe"
    >
      <div class="relative">
        <!-- Peek shells match the front card; outer padding keeps nav clear. -->
        <div
          v-for="n in peekCount"
          :key="`peek-${n}`"
          class="pointer-events-none absolute inset-0 origin-top rounded-2xl border border-foreground/20 bg-neutral-100 dark:border-white/20 dark:bg-neutral-900"
          :class="
            reducedMotion
              ? ''
              : 'transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]'
          "
          :style="{
            transform: `translate3d(0, ${n * PEEK_STEP_PX}px, 0) scale(${1 - n * 0.035})`,
            zIndex: 10 - n,
          }"
          aria-hidden="true"
        />

        <Transition :name="reducedMotion ? 'stack-static' : slideName">
          <article
            v-if="activeItem"
            :key="itemKey(activeItem, activeIndex)"
            class="relative z-20 select-none rounded-2xl border border-foreground/15 bg-white p-5 will-change-transform md:p-6 dark:border-white/15 dark:bg-neutral-950"
            :class="frontCardClass"
            :style="frontCardStyle"
          >
            <header class="mb-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ org(activeItem) }}
              </p>
              <h3
                class="mt-1 text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white"
              >
                {{ title(activeItem) }}
              </h3>
              <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-500">
                {{ meta(activeItem) }}
              </p>
            </header>

            <ExperienceEntry
              v-if="activeItem.type === 'experience'"
              :experience="activeItem.data"
              compact
            />
            <EducationEntry v-else :education="activeItem.data" compact />
          </article>
        </Transition>
      </div>
    </div>

    <div
      class="relative z-20 mt-3 flex items-center justify-between gap-3 pb-24 md:mt-4 md:pb-8"
      role="navigation"
      :aria-label="$t('experience.title')"
    >
      <Button
        type="button"
        variant="outline"
        size="sm"
        class="shrink-0 px-3 text-muted-foreground"
        aria-label="Previous"
        :disabled="activeIndex === 0"
        @click="prev"
      >
        ←
      </Button>

      <p
        class="min-w-0 truncate text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <span class="tabular-nums text-foreground">{{ activeIndex + 1 }}</span>
        <span aria-hidden="true"> / </span>
        <span class="tabular-nums">{{ count }}</span>
        <span class="mx-2 text-foreground/20" aria-hidden="true">·</span>
        <span class="text-foreground">{{ org(activeItem!) }}</span>
      </p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        class="shrink-0 px-3 text-muted-foreground"
        aria-label="Next"
        :disabled="activeIndex >= count - 1"
        @click="next"
      >
        →
      </Button>
    </div>
  </div>
</template>

<style scoped>
/* iOS-like drawer curve — soft settle without bounce. Transform only. */
.experience-drag-settle {
  transition: transform 320ms cubic-bezier(0.32, 0.72, 0, 1);
}

.stack-next-enter-active,
.stack-prev-enter-active {
  transition: transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
  z-index: 20;
}

.stack-next-leave-active,
.stack-prev-leave-active {
  position: absolute;
  inset-inline: 0;
  top: 0;
  z-index: 10;
  width: 100%;
  pointer-events: none;
  transition:
    transform 150ms cubic-bezier(0.32, 0.72, 0, 1),
    opacity 120ms linear;
}

.stack-next-leave-from,
.stack-prev-leave-from {
  opacity: 1;
}

/* Next / swipe-left: old card slips into the deck; new card rises in front. */
.stack-next-enter-from {
  transform: translate3d(0, 10px, 0) scale(0.975);
}

.stack-next-leave-to {
  transform: translate3d(0, 14px, 0) scale(0.96);
  opacity: 0;
}

/* Prev / swipe-right: reverse path. */
.stack-prev-enter-from {
  transform: translate3d(0, -6px, 0) scale(0.99);
}

.stack-prev-leave-to {
  transform: translate3d(0, 14px, 0) scale(0.96);
  opacity: 0;
}

.stack-static-enter-active,
.stack-static-leave-active {
  transition: none;
}

@media (prefers-reduced-motion: reduce) {
  .experience-drag-settle,
  .stack-next-enter-active,
  .stack-next-leave-active,
  .stack-prev-enter-active,
  .stack-prev-leave-active {
    transition: none;
  }

  .stack-next-enter-from,
  .stack-next-leave-to,
  .stack-prev-enter-from,
  .stack-prev-leave-to {
    transform: none;
    opacity: 1;
  }
}
</style>
