<script setup lang="ts">
const { t } = useI18n();
const name = computed(() => t('welcome.name'));
const introduction = computed(() => t('welcome.introduction', { name: name.value }));
</script>

<template>
  <span
    class="text-gray-900 dark:text-white text-4xl md:text-5xl font-light tracking-tight"
  >
    <TextHighlight
      class="rounded-lg bg-gray-900 dark:bg-white px-5 py-2 text-white dark:text-gray-900"
      text-end-color="hsl(var(--accent))"
    >
      {{ introduction }}
    </TextHighlight>
  </span>
</template>
