<script setup lang="ts">
interface Props {
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

interface Emits {
  (e: "scroll-left"): void;
  (e: "scroll-right"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="hidden md:flex justify-end gap-2 mb-4">
    <button
      class="flex size-12 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
      :disabled="!canScrollLeft"
      @click="emit('scroll-left')"
    >
      <Icon
        name="tabler:arrow-narrow-left"
        class="size-5 text-gray-900 dark:text-gray-100"
      />
    </button>
    <button
      class="flex size-12 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
      :disabled="!canScrollRight"
      @click="emit('scroll-right')"
    >
      <Icon
        name="tabler:arrow-narrow-right"
        class="size-5 text-gray-900 dark:text-gray-100"
      />
    </button>
  </div>
</template>

