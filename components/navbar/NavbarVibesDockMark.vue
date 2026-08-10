<script setup lang="ts">
/**
 * Compact Current Vibes now-playing mark for dock / mobile icons.
 * Cover is the signal; live state uses ink pulse (no brand hue).
 */
import type { NavbarVibesPreview } from "~/composables/navbar";
import { useSettings } from "~/composables/settings";

const props = withDefaults(
  defineProps<{
    preview: NavbarVibesPreview;
    size?: "sm" | "md";
  }>(),
  { size: "sm" },
);

const { reducedMotion } = useSettings();

const sizeClass = computed(() =>
  props.size === "md" ? "h-3.5 w-3.5" : "h-3 w-3",
);

const coverMotionClass = computed(() => {
  if (reducedMotion.value) return "";
  if (props.preview.kind === "music" && props.preview.isLive) {
    return "animate-vibes-vinyl-spin-slow";
  }
  if (props.preview.isLive) {
    return "animate-vibes-cover-float";
  }
  return "";
});
</script>

<template>
  <span class="absolute -bottom-0.5 -right-0.5 block" aria-hidden="true">
    <span
      v-if="preview.image"
      :class="[
        'block overflow-hidden bg-neutral-200 outline outline-1 outline-black/10 dark:bg-neutral-800 dark:outline-white/10',
        preview.kind === 'music' && preview.isLive ? 'rounded-full' : 'rounded-[3px]',
        sizeClass,
        coverMotionClass,
      ]"
    >
      <img
        :src="preview.image"
        alt=""
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    </span>
    <span
      v-else-if="preview.isLive"
      :class="[
        'block rounded-full bg-neutral-900 dark:bg-white',
        sizeClass,
        reducedMotion ? '' : 'animate-vibes-live-pulse',
      ]"
    />
  </span>
</template>
