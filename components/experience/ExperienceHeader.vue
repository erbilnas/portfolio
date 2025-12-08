<script setup lang="ts">
import { useI18n } from "#imports";

const { t } = useI18n();
</script>

<template>
  <div class="text-center mb-16">
    <h2 class="text-5xl md:text-7xl font-semibold tracking-tight">
      <span class="inline-block text-gray-900 dark:text-white">
        {{ t("experience.title") }}
      </span>
    </h2>
    <p
      class="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl font-light animate-title-fade"
    >
      {{ t("experience.description") }}
    </p>
  </div>
</template>
