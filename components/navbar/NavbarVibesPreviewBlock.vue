<script setup lang="ts">
/**
 * Rich Current Vibes preview for tooltip / mobile drawer.
 * Cover + category + title; motion gated by reducedMotion and live state.
 */
import type { NavbarVibesPreview } from "~/composables/navbar";
import { useSettings } from "~/composables/settings";

const props = withDefaults(
  defineProps<{
    preview: NavbarVibesPreview;
    compact?: boolean;
  }>(),
  { compact: false },
);

const { t } = useI18n();
const { reducedMotion } = useSettings();

const coverClass = computed(() => {
  const base = props.compact ? "h-8 w-8" : "h-10 w-10";
  const shape =
    props.preview.kind === "music" ? "rounded-full" : "rounded-md";
  return `${base} ${shape}`;
});

const coverMotionClass = computed(() => {
  if (reducedMotion.value) return "";
  if (props.preview.kind === "music" && props.preview.isLive) {
    return "animate-vibes-vinyl-spin-slow";
  }
  if (props.preview.kind === "game") {
    return "animate-vibes-cover-float";
  }
  if (props.preview.kind === "reading") {
    return "animate-vibes-cover-float";
  }
  if (props.preview.kind === "trakt") {
    return "animate-vibes-screen-flicker-soft";
  }
  return props.preview.isLive && !reducedMotion.value
    ? "animate-vibes-live-pulse"
    : "";
});

const titleNeedsMarquee = computed(
  () => !reducedMotion.value && props.preview.title.length > 28,
);
</script>

<template>
  <div
    :class="[
      'flex items-center gap-2.5',
      compact ? '' : 'min-w-0',
    ]"
  >
    <div
      v-if="preview.image"
      :class="[
        'relative shrink-0 overflow-hidden bg-neutral-200 outline outline-1 outline-black/10 dark:bg-neutral-800 dark:outline-white/10',
        coverClass,
      ]"
    >
      <img
        :src="preview.image"
        alt=""
        :class="['h-full w-full object-cover', coverMotionClass]"
        loading="lazy"
        decoding="async"
      />
      <span
        v-if="preview.isLive && preview.kind === 'music'"
        class="pointer-events-none absolute inset-[28%] rounded-full bg-neutral-950/80 dark:bg-neutral-950/70"
        aria-hidden="true"
      />
    </div>
    <div
      v-else
      :class="[
        'flex shrink-0 items-center justify-center bg-neutral-200 outline outline-1 outline-black/10 dark:bg-neutral-800 dark:outline-white/10',
        coverClass,
      ]"
      aria-hidden="true"
    >
      <span
        :class="[
          'h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white',
          preview.isLive && !reducedMotion ? 'animate-vibes-live-pulse' : '',
        ]"
      />
    </div>

    <div class="min-w-0 flex-1">
      <p
        class="flex items-center gap-1.5 text-[11px] font-medium leading-tight text-neutral-600 dark:text-neutral-300"
      >
        <span
          v-if="preview.isLive"
          class="inline-flex items-center gap-1 text-neutral-900 dark:text-white"
        >
          <span
            :class="[
              'inline-block h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white',
              reducedMotion ? '' : 'animate-vibes-live-pulse',
            ]"
            aria-hidden="true"
          />
          {{ t("nav.vibesLive") }}
          <span class="text-neutral-400 dark:text-neutral-500">·</span>
        </span>
        <span class="truncate">{{ preview.category }}</span>
      </p>

      <div
        :class="[
          'mt-0.5 overflow-hidden',
          compact ? 'max-w-[11rem]' : 'max-w-[13rem]',
        ]"
      >
        <div
          v-if="titleNeedsMarquee"
          class="flex w-max animate-vibes-marquee text-xs font-semibold leading-snug text-neutral-950 dark:text-white"
        >
          <span class="pr-8">{{ preview.title }}</span>
          <span class="pr-8" aria-hidden="true">{{ preview.title }}</span>
        </div>
        <p
          v-else
          class="truncate text-xs font-semibold leading-snug text-neutral-950 dark:text-white"
        >
          {{ preview.title }}
        </p>
      </div>
    </div>
  </div>
</template>
