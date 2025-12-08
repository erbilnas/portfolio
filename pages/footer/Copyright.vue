<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <p class="text-sm text-muted-foreground">
    {{ new Date().getFullYear() }} © Erbil Nas.
    {{ t("footer.copyright.madeWith") }}
  </p>
</template>
