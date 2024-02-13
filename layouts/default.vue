<template>
  <main>
    <SpeedInsights />

    <Header />
    <slot />

    <Footer />
  </main>
</template>

<script lang="ts" setup>
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

<style lang="scss" scoped></style>
