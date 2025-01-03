<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null);

const updateMetaTitle = (title: string) => {
  useHead({
    title,
  });
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateMetaTitle("Career | Erbil Nas");
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
  <section
    id="career"
    ref="sectionRef"
    class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-red-950 to-zinc-950"
  ></section>
</template>
