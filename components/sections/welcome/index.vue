<script setup lang="ts">
import { computed } from "vue";
import IntroductionText from "./IntroductionText.vue";
import SocialLinks from "./SocialLinks.vue";

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

const hasScrolled = ref(false);

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

      <div class="w-full flex flex-col items-center space-y-4 py-12">
        <IntroductionText />

        <FlipWords :words class="text-xl font-light text-center" />

        <SocialLinks />
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 transform translate-y-4"
        leave-to-class="opacity-0 transform translate-y-4"
      >
        <div
          v-show="!hasScrolled"
          class="flex flex-col items-center text-muted-foreground animate-bounce"
        >
          <Icon name="ph:mouse-simple" class="w-6 h-6" />
          <span class="text-sm font-light">Scroll to see more</span>
        </div>
      </Transition>
    </LampEffect>
  </section>
</template>
