<script lang="ts" setup>
import type { Ref } from "vue";
import { ref } from "vue";

interface LifetimeStats {
  age: number;
}

const sectionRef: Ref<HTMLElement | null> = ref(null);

// Use useFetch instead of top-level await $fetch to avoid $r initialization errors
const { data: lifetimeStats } = useFetch<LifetimeStats>("/api/lifetime-stats");
const age = computed(() => lifetimeStats.value?.age ?? 0);

const { t } = useI18n();
const text = computed(() => {
  return t('aboutMe.description', { age: age.value });
});

useObserver("About Me", sectionRef);
</script>

<template>
  <section id="about-me" ref="sectionRef" class="relative">
    <div
      class="bg-white dark:bg-black flex min-h-screen items-center justify-center px-6 py-32"
    >
      <div class="max-w-4xl w-full">
        <TextScrollReveal
          :text
          class="text-2xl md:text-4xl font-light leading-relaxed text-gray-900 dark:text-white tracking-tight"
        />
      </div>
    </div>
  </section>
</template>
