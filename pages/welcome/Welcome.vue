<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";

import enLocale from "~/locales/en.json";
import trLocale from "~/locales/tr.json";
import jaLocale from "~/locales/ja.json";
import { useWelcomeSpotlight } from "~/composables/welcome";
import { useSettings } from "~/composables/settings";
import IntroductionText from "./IntroductionText.vue";
import SocialLinks from "./SocialLinks.vue";
import WelcomeHello from "./WelcomeHello.vue";

const { locale } = useI18n();
const { reducedMotion } = useSettings();

const sectionRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);
const prefersReduced = ref(false);

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

const motionAllowed = computed(
  () => !reducedMotion.value && !prefersReduced.value,
);

/** Ease-out progress so scale settles rather than racing linearly. */
const easedProgress = computed(() => {
  const p = scrollProgress.value;
  return 1 - (1 - p) * (1 - p);
});

/** Scale after the text morph so Hello isn’t competing focal points. */
const helloScale = computed(() => {
  if (!motionAllowed.value) return 1;
  const afterMorph = Math.min(1, Math.max(0, (easedProgress.value - 0.35) / 0.65));
  return 1 + afterMorph * 0.45;
});

const helloStyle = computed(() => ({
  transform: `scale(${helloScale.value})`,
}));

const restStyle = computed(() => {
  if (!motionAllowed.value) return undefined;
  const p = easedProgress.value;
  return {
    opacity: String(1 - Math.min(0.82, p * 1.05)),
    transform: `translate3d(0, ${p * 32}px, 0)`,
    pointerEvents: p > 0.45 ? "none" : "auto",
  };
});

let ticking = false;

const updateScrollProgress = () => {
  const section = sectionRef.value;
  if (!section || !motionAllowed.value) {
    scrollProgress.value = 0;
    ticking = false;
    return;
  }

  const rect = section.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  scrollProgress.value = Math.min(1, Math.max(0, -rect.top / travel));
  ticking = false;
};

const onScrollOrResize = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollProgress);
};

useObserver("Welcome", sectionRef);

onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    prefersReduced.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }
  updateScrollProgress();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
});

watch(motionAllowed, () => {
  updateScrollProgress();
});
</script>

<template>
  <section
    id="welcome"
    ref="sectionRef"
    class="relative min-h-[155dvh] overflow-x-clip"
  >
    <div
      class="sticky top-0 z-10 mx-auto flex min-h-dvh w-full max-w-4xl flex-col justify-center px-6 py-24 md:py-28"
    >
      <div class="flex flex-col items-center text-center">
        <h1
          fetchpriority="high"
          class="origin-top w-full text-balance"
          :style="helloStyle"
        >
          <WelcomeHello :progress="easedProgress" />
        </h1>

        <div
          class="mt-5 flex w-full max-w-2xl flex-col items-center md:mt-7"
          :style="restStyle"
        >
          <div class="flex max-w-xl flex-col items-center gap-1.5 md:gap-2">
            <IntroductionText />
            <FlipWords
              :words
              class="text-lg font-light text-gray-600 md:text-2xl dark:text-gray-300"
            />
          </div>

          <div
            class="mt-10 flex w-full flex-col items-center gap-5 md:mt-14 md:gap-6"
          >
            <DownloadCvButton variant="spotlight" />
            <SocialLinks :magnet-enabled="magnetEnabled" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
