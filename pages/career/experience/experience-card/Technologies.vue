<script lang="ts" setup>
interface Props {
  technologies: string[];
}

const props = defineProps<Props>();
</script>

<template>
  <CardItem class="flex flex-wrap gap-2 pt-4">
    <Badge
      v-for="technology in technologies"
      :key="technology"
      variant="secondary"
      class="px-3 py-1.5 text-xs bg-slate-900/50 hover:bg-violet-500/20 hover:text-violet-400 hover:scale-110 transition-all duration-300 border border-slate-800"
    >
      {{ technology }}
    </Badge>
  </CardItem>
</template>

<style scoped></style>
