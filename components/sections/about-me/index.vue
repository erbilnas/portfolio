<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";

const sectionRef = ref<HTMLElement | null>(null);

const { age } = await $fetch("/api/lifetime-stats");

const text = computed(() => {
  return `I'm a software engineer, constantly learning and passionate about building my future with zeros and ones. I'm ${age} years old, born and raised in Turkey.`;
});

const updateMetaTitle = (title: string) => {
  useHead({
    title,
  });
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateMetaTitle("About Me | Erbil Nas");
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
  <section id="about-me" ref="sectionRef" class="min-h-screen">
    <div class="bg-gradient-to-b from-slate-950 to-violet-950">
      <TextScrollReveal :text />
    </div>
  </section>
</template>

<style scoped></style>
