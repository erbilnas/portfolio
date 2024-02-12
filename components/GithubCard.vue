<template>
  <Card @click="useOpenUrl(config.githubProfileUrl)">
    <template #content>
      <i v-badge="99" class="pi pi-github p-overlay-badge" style="font-size: 8rem" />
    </template>
  </Card>
</template>

<script lang="ts" setup>
const config = useAppConfig();
</script>

<style lang="scss" scoped>
@media (max-width: 768px) {
  .p-card {
    align-items: center;
  }
}
</style>
