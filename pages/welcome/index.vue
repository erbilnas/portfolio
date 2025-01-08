<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { computed, onUnmounted } from "vue";
import { observerOptions } from "~/constants";
import IntroductionText from "./IntroductionText.vue";
import SocialLinks from "./SocialLinks.vue";

const appConfig = useAppConfig();
const isMobile = useMediaQuery("(max-width: 768px)");
const { updateTitle } = usePageMeta();

const sectionRef = ref<HTMLElement | null>(null);
const hasScrolled = ref(false);

const words = computed(() => appConfig.flippingWords.split(","));

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateTitle("Welcome");
    }
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
      observer.disconnect();
    }
  });

  const handleScroll = () => {
    if (window.scrollY > 0) {
      hasScrolled.value = true;
    }
  };

  window.addEventListener("scroll", handleScroll);

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});
</script>

<template>
  <section id="welcome" ref="sectionRef">
    <LampEffect>
      <div>
        <TextGenerateEffect words="Hello" class="text-9xl font-bold" />
      </div>

      <div class="flex flex-col items-center space-y-4 py-12">
        <IntroductionText />

        <FlipWords :words />

        <SocialLinks />
      </div>

      <div
        v-show="!hasScrolled"
        class="flex flex-col gap-2 items-center text-muted-foreground animate-bounce"
      >
        <div v-if="!isMobile" class="flex flex-col items-center gap-2">
          <Icon name="ph:mouse-simple" class="w-10 h-10" />

          <span class="text-sm font-light">Scroll to see more</span>
        </div>

        <div v-else class="flex flex-col items-center gap-2">
          <Icon name="ph:arrow-fat-down" class="w-10 h-10" />

          <span class="text-sm font-light">Swipe to see more</span>
        </div>
      </div>
    </LampEffect>
  </section>
</template>
