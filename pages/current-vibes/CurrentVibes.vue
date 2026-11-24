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
  <section
    id="current-vibes"
    ref="sectionRef"
    class="relative scroll-mt-5"
  >
    <div
      class="flex min-h-screen w-full flex-col items-center gap-12 overflow-hidden bg-white px-6 py-24 dark:bg-black md:gap-16 md:px-10 md:py-32"
    >
      <CurrentVibesHeader />
      <CurrentVibesShowcase :cards="cards" />
    </div>
  </section>
</template>
