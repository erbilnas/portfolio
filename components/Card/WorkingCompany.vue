<template>
  <Card @click="useOpenUrl(trendyol)">
    <template #title> Trendyol </template>

    <template #subtitle> Works here </template>
  </Card>
</template>

<script lang="ts" setup>
const {
  profiles: { trendyol },
} = useAppConfig();
</script>

<style lang="scss" scoped>
.p-card {
  max-height: 14vh;
}
</style>
