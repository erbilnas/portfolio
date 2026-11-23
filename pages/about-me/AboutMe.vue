<script lang="ts" setup>
import type { Ref } from "vue";
import { ref } from "vue";

interface LifetimeStats {
  age: number;
}

const sectionRef: Ref<HTMLElement | null> = ref(null);

const { data: lifetimeStats } = useFetch<LifetimeStats>("/api/lifetime-stats");
const age = computed(() => lifetimeStats.value?.age ?? 0);

const { t } = useI18n();
const lead = computed(() => t("aboutMe.lead"));
const detail = computed(() => t("aboutMe.detail", { age: age.value }));

useObserver("About Me", sectionRef);
</script>

<template>
  <section id="about-me" ref="sectionRef" class="relative">
    <div class="bg-white dark:bg-black">
      <TextScrollReveal :text="lead" :detail="detail" />
    </div>
  </section>
</template>
