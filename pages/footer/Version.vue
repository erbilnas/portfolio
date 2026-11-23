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
    class="underline-offset-2 transition-colors duration-150 hover:text-neutral-900 hover:underline dark:hover:text-white"
  >
    {{ t("footer.version", { version }) }}
  </a>
</template>
