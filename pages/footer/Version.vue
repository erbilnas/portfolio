<script setup lang="ts">
const { t } = useI18n();
const { version, socialLinks } = useAppConfig();

const releasesUrl = socialLinks.github
  ? `${socialLinks.github}/erbilnas-com/releases`
  : "https://github.com/erbilnas/erbilnas-com/releases";
</script>

<template>
  <a
    :href="releasesUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="text-xs text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
  >
    {{ t("footer.version", { version }) }}
  </a>
</template>
