<script lang="ts" setup>
interface Props {
  currentPosition: string;
  company: string;
  location: string;
  period: string;
}

const props = defineProps<Props>();
</script>

<template>
  <CardItem class="space-y-1 md:space-y-2" :translateZ="30">
    <h3
      class="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-violet-600"
    >
      {{ currentPosition }}
    </h3>

    <div
      class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-slate-400"
    >
      <span>{{ company }}</span>
      <span class="hidden sm:inline text-slate-600">•</span>
      <span>{{ location }}</span>
    </div>

    <div class="text-sm text-violet-400">
      {{ period }}
    </div>
  </CardItem>
</template>

<style scoped></style>
