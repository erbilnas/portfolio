<script setup lang="ts">
import { computed } from "vue";

import enLocale from "~/locales/en.json";
import trLocale from "~/locales/tr.json";
import IntroductionText from "./IntroductionText.vue";
import ScrollReminder from "./ScrollReminder.vue";
import SocialLinks from "./SocialLinks.vue";

const { locale } = useI18n();

const sectionRef = ref<HTMLElement | null>(null);

const words = computed(() => {
  const currentLocale = locale.value;

  // Use direct imports - same pattern as experience composable
  const fallbackMessages = currentLocale === "tr" ? trLocale : enLocale;
  const flippingWords = (fallbackMessages as any).welcome?.flippingWords;

  // Ensure we have an array of strings
  if (Array.isArray(flippingWords) && flippingWords.length > 0) {
    const filtered = flippingWords.filter(
      (word: any) => word != null && typeof word === "string"
    );
    return filtered;
  }

  // Fallback to default words if localization fails
  return ["Developer", "Engineer", "Creator"];
});

useObserver("Welcome", sectionRef);
</script>

<template>
  <section id="welcome" ref="sectionRef" class="relative">
    <div
      class="flex flex-col gap-16 min-h-screen items-center justify-center px-6 py-32"
    >
      <h1 fetchpriority="high" class="text-center">
        <TextGenerateEffect
          :words="$t('welcome.hello')"
          class="text-gray-900 dark:text-white text-8xl md:text-[180px] font-semibold tracking-tight leading-none"
          :duration="0.3"
          :delay="0"
          :filter="false"
        />
      </h1>

      <div class="flex flex-col items-center gap-4 max-w-2xl text-center">
        <IntroductionText />
        <FlipWords
          :words
          class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 font-light"
        />
      </div>

      <SocialLinks />
      <ScrollReminder />
    </div>
  </section>
</template>
