<script setup lang="ts">
import {
  CurrentVibesHeader,
  CurrentVibesShowcase,
} from "~/components/current-vibes";
import { useCurrentVibesData } from "~/composables/current-vibes";

const sectionRef = ref<HTMLElement | null>(null);

useObserver("Current Vibes", sectionRef);

const { cards } = useCurrentVibesData();
</script>

<template>
  <section id="current-vibes" ref="sectionRef" class="relative">
    <div
      class="flex min-h-screen w-full flex-col items-center gap-10 overflow-hidden bg-white px-6 py-20 dark:bg-black md:gap-14 md:px-10"
    >
      <CurrentVibesHeader />
      <CurrentVibesShowcase :cards="cards" />
    </div>
  </section>
</template>
