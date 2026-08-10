<script setup lang="ts">
const { t } = useI18n();
const year = new Date().getFullYear();
</script>

<template>
  <p class="text-sm text-gray-600 dark:text-gray-400">
    {{ year }} © Erbil Nas.
    {{ t("footer.copyright.madeWith") }}
  </p>
</template>
