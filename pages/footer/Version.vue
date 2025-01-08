<script setup lang="ts">
const { version, socialLinks } = useAppConfig();
</script>

<template>
  <Button
    variant="link"
    class="text-xs text-white/40"
    @click="
      () =>
        navigateTo(`${socialLinks.github}/erbilnas-com/releases`, {
          external: true,
        })
    "
  >
    Version {{ version }}
  </Button>
</template>
