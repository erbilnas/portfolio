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
    <div class="bg-gradient-to-b from-slate-950 to-violet-950 flex">
      <TextScrollReveal :text />
    </div>
  </section>
</template>
