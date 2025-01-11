<script setup lang="ts">
const { version, socialLinks } = useAppConfig();

const navigateTo = (url: string) => {
  window.open(url, "_blank");
};
</script>

<template>
  <Button
    variant="link"
    class="text-xs text-muted-foreground hover:text-foreground transition-colors"
    @click="() => navigateTo(`${socialLinks.github}/erbilnas-com/releases`)"
  >
    Version {{ version }}
  </Button>
</template>
