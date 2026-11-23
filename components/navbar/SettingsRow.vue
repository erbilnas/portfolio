<script lang="ts" setup>
interface Props {
  label: string;
  description?: string;
  labelId?: string;
  descriptionId?: string;
}

defineProps<Props>();
</script>

<template>
  <div
    class="flex items-center justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
  >
    <div class="min-w-0 flex flex-col gap-0.5">
      <label
        :id="labelId"
        class="text-[13px] font-medium leading-snug text-neutral-950 dark:text-white"
      >
        {{ label }}
      </label>
      <p
        v-if="description"
        :id="descriptionId"
        class="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400"
      >
        {{ description }}
      </p>
    </div>
    <div class="shrink-0">
      <slot />
    </div>
  </div>
</template>
