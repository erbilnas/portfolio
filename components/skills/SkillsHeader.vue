<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="mx-auto max-w-3xl text-center">
    <h2
      class="text-balance text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-6xl"
    >
      {{ t("skills.title") }}
    </h2>
    <p
      class="mt-3 text-pretty text-base text-neutral-500 dark:text-neutral-400 md:mt-4 md:text-lg"
    >
      {{ t("skills.description") }}
    </p>
  </div>
</template>
