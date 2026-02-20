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
  <div class="flex items-center justify-between gap-4">
    <div class="flex flex-col gap-1">
      <label
        :id="labelId"
        class="text-sm font-medium"
      >
        {{ label }}
      </label>
      <p
        v-if="description"
        :id="descriptionId"
        class="text-xs text-muted-foreground"
      >
        {{ description }}
      </p>
    </div>
    <slot />
  </div>
</template>
