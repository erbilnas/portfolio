<template>
  <Card @click="useOpenUrl(config.public.trendyolProfileUrl)">
    <template #title>
      Trendyol
    </template>

    <template #subtitle>
      Working Company
    </template>
  </Card>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
</script>

<style></style>