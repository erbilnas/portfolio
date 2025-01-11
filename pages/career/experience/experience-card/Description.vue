<script lang="ts" setup>
interface Props {
  description: string[];
}

const props = defineProps<Props>();
</script>

<template>
  <CardItem>
    <ul
      class="space-y-2 md:space-y-3 list-disc list-inside text-slate-300 text-sm md:text-base"
      role="list"
    >
      <li
        v-for="(item, i) in description"
        :key="i"
        class="leading-relaxed hover:text-violet-400 transition-colors"
      >
        {{ item }}
      </li>
    </ul>
  </CardItem>
</template>

<style scoped></style>
