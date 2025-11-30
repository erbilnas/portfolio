<script lang="ts" setup>
import type { Ref } from "vue";
import { ref } from "vue";

interface LifetimeStats {
  age: number;
}

const sectionRef: Ref<HTMLElement | null> = ref(null);

const { age } = await $fetch<LifetimeStats>("/api/lifetime-stats");

const text = computed(() => {
  return `I'm a software engineer, constantly learning and passionate about building my future with zeros and ones. I'm ${age} years old, born and raised in Turkey.`;
});

const { observeSectionChange } = useObserver("About Me", sectionRef);

observeSectionChange();
</script>

<template>
  <section id="about-me" ref="sectionRef">
    <div class="bg-white dark:bg-black flex min-h-screen items-center justify-center px-6 py-32">
      <div class="max-w-4xl w-full">
        <TextScrollReveal :text class="text-2xl md:text-4xl font-light leading-relaxed text-gray-900 dark:text-white tracking-tight" />
      </div>
    </div>
  </section>
</template>
