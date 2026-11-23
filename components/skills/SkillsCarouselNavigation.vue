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
  <div class="hidden items-center gap-1.5 md:flex">
    <Button
      type="button"
      size="icon"
      variant="outline"
      class="size-10"
      aria-label="Previous"
      :disabled="!canScrollLeft"
      @click="emit('scroll-left')"
    >
      <Icon
        name="tabler:arrow-narrow-left"
        class="size-4 text-neutral-900 dark:text-neutral-100"
      />
    </Button>
    <Button
      type="button"
      size="icon"
      variant="outline"
      class="size-10"
      aria-label="Next"
      :disabled="!canScrollRight"
      @click="emit('scroll-right')"
    >
      <Icon
        name="tabler:arrow-narrow-right"
        class="size-4 text-neutral-900 dark:text-neutral-100"
      />
    </Button>
  </div>
</template>
