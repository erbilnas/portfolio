<script setup lang="ts">
import { usePointerGlow } from "~/composables/use-pointer-glow";

const glowRef = ref<HTMLElement | null>(null);

usePointerGlow(glowRef);
</script>

<template>
  <div
    ref="glowRef"
    class="pointer-glow"
    style="--glow-x: 50%; --glow-y: 42%"
    aria-hidden="true"
  />
</template>

<style>
.pointer-glow {
  --pointer-glow-core: hsl(0 0% 0% / 0.07);
  --pointer-glow-mid: hsl(0 0% 0% / 0.03);
  --pointer-glow-rim: hsl(0 0% 0% / 0.035);
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(
      48rem 36rem at var(--glow-x) var(--glow-y),
      var(--pointer-glow-core) 0%,
      var(--pointer-glow-mid) 40%,
      transparent 70%
    ),
    radial-gradient(
      24rem 20rem at var(--glow-x) var(--glow-y),
      var(--pointer-glow-rim) 0%,
      transparent 72%
    );
}

html.dark .pointer-glow {
  --pointer-glow-core: hsl(0 0% 100% / 0.09);
  --pointer-glow-mid: hsl(0 0% 100% / 0.035);
  --pointer-glow-rim: hsl(0 0% 100% / 0.045);
}

@media (max-width: 767px), (pointer: coarse) {
  .pointer-glow {
    background:
      radial-gradient(
        42rem 32rem at 50% 42%,
        var(--pointer-glow-core) 0%,
        var(--pointer-glow-mid) 40%,
        transparent 70%
      );
  }
}
</style>
