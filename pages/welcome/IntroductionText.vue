<script setup lang="ts">
const { t } = useI18n();
const name = computed(() => t("welcome.name"));
const introduction = computed(() =>
  t("welcome.introduction", { name: name.value }),
);
</script>

<template>
  <p
    class="text-center text-2xl font-light tracking-tight text-gray-900 md:text-4xl dark:text-white"
  >
    {{ introduction }}
  </p>
</template>
