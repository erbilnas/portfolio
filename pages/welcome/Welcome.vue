<script setup lang="ts">
import { computed } from "vue";

import IntroductionText from "./IntroductionText.vue";
import ScrollReminder from "./ScrollReminder.vue";
import SocialLinks from "./SocialLinks.vue";

const appConfig = useAppConfig();

const sectionRef = ref<HTMLElement | null>(null);

const words = computed(() => appConfig.flippingWords.split(","));

useObserver("Welcome", sectionRef);
</script>

<template>
  <section id="welcome" ref="sectionRef">
    <div class="flex flex-col gap-16 min-h-screen items-center justify-center px-6 py-32">
      <h1 fetchpriority="high" class="text-center">
        <TextGenerateEffect
          words="Hello"
          class="text-gray-900 dark:text-white text-8xl md:text-[180px] font-semibold tracking-tight leading-none"
          :duration="0.3"
          :delay="0"
          :filter="false"
        />
      </h1>

      <div class="flex flex-col items-center gap-4 max-w-2xl text-center">
        <IntroductionText />
        <FlipWords :words class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light" />
      </div>

      <SocialLinks />
      <ScrollReminder />
    </div>
  </section>
</template>
