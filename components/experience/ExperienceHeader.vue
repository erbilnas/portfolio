<script setup lang="ts">
import { useI18n } from "#imports";

const { t } = useI18n();
</script>

<template>
  <div class="text-center">
    <h2
      class="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-7xl"
    >
      {{ t("experience.title") }}
    </h2>
    <p
      class="mt-3 text-lg font-light text-gray-600 md:mt-4 md:text-xl dark:text-gray-400"
    >
      {{ t("experience.description") }}
    </p>
  </div>
</template>
