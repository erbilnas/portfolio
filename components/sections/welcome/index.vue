<script setup lang="ts">
import { computed } from "vue"
import IntroductionText from "./IntroductionText.vue"
import SocialLinks from "./SocialLinks.vue"

const app_config = useAppConfig();

const sectionRef = ref<HTMLElement | null>(null);

const words = computed(() => app_config.flipping_words.split(","));

const updateMetaTitle = (title: string) => {
  useHead({
    title,
  });
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateMetaTitle("Welcome | Erbil Nas");
    }
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });
});
</script>

<template>
  <section id="welcome" ref="sectionRef">
    <LampEffect>
      <div>
        <TextGenerateEffect words="Hello" class="text-9xl font-bold" />
      </div>

      <div class="w-full flex flex-col items-center space-y-4 pt-12">
        <IntroductionText />

        <FlipWords :words class="text-xl font-light" />

        <SocialLinks />
      </div>
    </LampEffect>
  </section>
</template>
