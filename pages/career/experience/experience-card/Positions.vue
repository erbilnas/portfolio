<script lang="ts" setup>
import type { Position } from "~/types/career";

interface Props {
  positions?: Position[];
}

const props = defineProps<Props>();
</script>

<template>
  <CardItem v-if="positions?.length" class="mb-6">
    <div class="space-y-3 md:w-[600px]">
      <div
        v-for="(position, index) in positions"
        :key="index"
        class="flex flex-col sm:flex-row justify-between sm:items-center gap-1 text-sm"
      >
        <span class="text-slate-200 font-medium">{{ position.title }}</span>
        <span class="text-slate-400 text-sm">{{ position.duration }}</span>
      </div>
    </div>
  </CardItem>
</template>

<style scoped></style>
