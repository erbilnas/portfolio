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
  <div class="flex items-center justify-between gap-3">
    <div class="min-w-0 flex flex-col gap-0.5">
      <label
        :id="labelId"
        class="text-sm font-medium leading-tight"
      >
        {{ label }}
      </label>
      <p
        v-if="description"
        :id="descriptionId"
        class="text-[11px] leading-snug text-muted-foreground"
      >
        {{ description }}
      </p>
    </div>
    <div class="shrink-0">
      <slot />
    </div>
  </div>
</template>
