<script setup lang="ts">
import { computed } from "vue";

import IntroductionText from "./IntroductionText.vue";
import ScrollReminder from "./ScrollReminder.vue";
import SocialLinks from "./SocialLinks.vue";

const appConfig = useAppConfig();

const sectionRef = ref<HTMLElement | null>(null);

const words = computed(() => appConfig.flippingWords.split(","));

const { observeSectionChange } = useObserver("Welcome", sectionRef);

observeSectionChange();
</script>

<template>
  <section id="welcome" ref="sectionRef">
    <LampEffect>
      <div class="flex flex-col gap-12">
        <h1 fetchpriority="high">
          <TextGenerateEffect
            words="Hello"
            class="text-gray-900 dark:text-white text-9xl font-bold"
            :duration="0.3"
            :delay="0"
            :filter="false"
          />
        </h1>

        <div class="flex flex-col items-center gap-2">
          <IntroductionText />
          <FlipWords :words />
        </div>

        <SocialLinks />
        <ScrollReminder />
      </div>
    </LampEffect>
  </section>
</template>
