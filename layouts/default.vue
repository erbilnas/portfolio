<template>
  <main>
    <SpeedInsights />

    <Header />
    <slot />

    <Footer />

    <SidebarAboutMe />

    <SidebarChangelog />
  </main>
</template>

<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/vue";
</script>

<style lang="scss" scoped></style>
