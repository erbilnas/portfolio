<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="text-center mb-16">
    <h2 class="text-5xl md:text-7xl font-semibold tracking-tight">
      <span class="inline-block text-gray-900 dark:text-white">
        {{ t('currentVibes.title') }}
      </span>
    </h2>
    <p
      class="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl font-light"
    >
      {{ t('currentVibes.description') }}
    </p>
  </div>
</template>
