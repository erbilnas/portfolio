<script lang="ts" setup>
import { useMediaQuery } from "@/composables/use-media-query-client";

const isMobile = useMediaQuery("(max-width: 768px)");
</script>

<template>
  <div
    class="flex flex-col items-center gap-2 text-muted-foreground animate-bounce"
  >
    <Icon name="ph:mouse-simple" :size="16" />

    <span class="text-sm font-light"
      >{{ isMobile ? $t("common.swipe") : $t("common.scroll") }}
      {{ $t("common.toSeeMore") }}</span
    >
  </div>
</template>
