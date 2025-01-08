<script lang="ts" setup>
import type { Ref } from "vue";
import { onMounted, ref } from "vue";
import { observerOptions } from "~/constants";

interface LifetimeStats {
  age: number;
}

const { updateTitle } = usePageMeta();

const sectionRef: Ref<HTMLElement | null> = ref(null);

const { age } = await $fetch<LifetimeStats>("/api/lifetime-stats");

const text = computed(() => {
  return `I'm a software engineer, constantly learning and passionate about building my future with zeros and ones. I'm ${age} years old, born and raised in Turkey.`;
});

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateTitle("About Me");
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
});
</script>

<template>
  <section id="about-me" ref="sectionRef">
    <div class="bg-gradient-to-b from-slate-950 to-violet-950 flex">
      <TextScrollReveal :text />
    </div>
  </section>
</template>
