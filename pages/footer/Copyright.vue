<script setup lang="ts">
import Version from "./Version.vue";

const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <p
    class="flex max-w-md flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[0.8125rem] leading-relaxed text-neutral-600 dark:text-neutral-400"
  >
    <span>{{ year }} © Erbil Nas</span>
    <span class="text-neutral-300 dark:text-neutral-600" aria-hidden="true"
      >·</span
    >
    <span>{{ t("footer.copyright.madeWith") }}</span>
    <span class="text-neutral-300 dark:text-neutral-600" aria-hidden="true"
      >·</span
    >
    <Version />
  </p>
</template>
