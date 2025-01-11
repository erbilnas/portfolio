<script lang="ts" setup>
defineProps<{
  name: string;
  icon: string;
}>();
</script>

<template>
  <div
    class="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 md:mb-8 flex flex-row items-center gap-2 sm:gap-3"
  >
    <div
      class="rounded-lg sm:rounded-xl shrink-0 inline-flex items-center justify-center p-2 sm:p-3 shadow-glow"
      :class="['bg-primary/10 text-primary']"
    >
      <Icon :name="icon" class="w-6 h-6 sm:w-8 sm:h-8 animate-glow" />
    </div>
    <span
      class="text-2xl sm:text-3xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
    >
      {{ name }}
    </span>
  </div>
</template>
