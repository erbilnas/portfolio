<template>
  <Card @click="useOpenUrl(profiles.trendyol)">
    <template #title>
      Trendyol
    </template>

    <template #subtitle>
      Works here
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { profiles } = useAppConfig()
</script>

<style></style>