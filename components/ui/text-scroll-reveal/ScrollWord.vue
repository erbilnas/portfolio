<template>
  <span class="inline" :style="{ opacity }">{{ display }}</span>
</template>

<script lang="ts" setup>
interface Props {
  word: string;
  progress: number;
  range: [number, number];
  /** Floor so copy stays readable before the scroll highlight. */
  minOpacity?: number;
  reducedMotion?: boolean;
  trailingSpace?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  minOpacity: 0.4,
  reducedMotion: false,
  trailingSpace: true,
});

const display = computed(() =>
  props.trailingSpace ? `${props.word} ` : props.word,
);

const opacity = computed(() => {
  if (props.reducedMotion) return 1;

  const [start, end] = props.range;
  const progress = props.progress;

  if (progress <= start) return props.minOpacity;
  if (progress >= end) return 1;

  const t = (progress - start) / (end - start);
  return props.minOpacity + t * (1 - props.minOpacity);
});
</script>
