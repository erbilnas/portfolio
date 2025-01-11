<script lang="ts" setup>
interface Props {
  index: {
    current: number;
    max: number;
  };
  data: unknown[];
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex justify-center gap-2 pt-4">
    <div
      v-for="(_, idx) in data"
      :key="idx"
      class="w-2 h-2 rounded-full transition-all duration-300"
      :class="[
        idx === index.current
          ? 'bg-violet-500 scale-125'
          : 'bg-slate-700 scale-100',
      ]"
    ></div>
  </div>
</template>
