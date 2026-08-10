<script setup lang="ts">
import { computed } from "vue";

import enLocale from "~/locales/en.json";
import trLocale from "~/locales/tr.json";
import jaLocale from "~/locales/ja.json";
import { useWelcomeSpotlight } from "~/composables/welcome";
import IntroductionText from "./IntroductionText.vue";
import SocialLinks from "./SocialLinks.vue";

const { locale } = useI18n();

const sectionRef = ref<HTMLElement | null>(null);

const { magnetEnabled } = useWelcomeSpotlight();

const words = computed(() => {
  const currentLocale = locale.value;

  const fallbackMessages =
    currentLocale === "tr"
      ? trLocale
      : currentLocale === "ja"
        ? jaLocale
        : enLocale;
  const flippingWords = (fallbackMessages as any).welcome?.flippingWords;

  if (Array.isArray(flippingWords) && flippingWords.length > 0) {
    const filtered = flippingWords.filter(
      (word: any) => word != null && typeof word === "string",
    );
    return filtered;
  }

  return ["Developer", "Engineer", "Creator"];
});

useObserver("Welcome", sectionRef);
</script>

<template>
  <section
    id="welcome"
    ref="sectionRef"
    class="relative min-h-screen overflow-hidden"
  >
    <div
      class="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-24 md:gap-10 md:py-28"
    >
      <h1 fetchpriority="high" class="text-center">
        <TextGenerateEffect
          :words="$t('welcome.hello')"
          class="text-gray-900 dark:text-white text-8xl md:text-[200px] font-semibold tracking-tight leading-none"
          :duration="0.3"
          :delay="0"
          :filter="false"
        />
      </h1>

      <div class="flex max-w-2xl flex-col items-center gap-2 text-center md:gap-3">
        <IntroductionText />
        <FlipWords
          :words
          class="text-base font-light text-gray-600 md:text-xl dark:text-gray-300"
        />
      </div>

      <DownloadCvButton variant="spotlight" />
      <SocialLinks :magnet-enabled="magnetEnabled" />
    </div>
  </section>
</template>
