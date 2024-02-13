<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<template>
  <SpeedInsights />

  <LazyNuxtLayout>
    <NuxtPage />
  </LazyNuxtLayout>
</template>

<style lang="scss" scoped></style>
