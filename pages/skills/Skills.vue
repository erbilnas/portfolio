<script setup lang="ts">
import {
  SkillsCarousel,
  SkillsCarouselNavigation,
  SkillsHeader,
  SkillsTabs,
} from "~/components/skills";
import { useCarouselScroll, useSkillsData } from "~/composables/skills";

const sectionRef = ref<HTMLElement | null>(null);
const carouselComponentRef = ref<InstanceType<typeof SkillsCarousel> | null>(
  null
);

useObserver("Skills", sectionRef);

const activeTab = ref("Favorites");

const { tabs, filteredSkills } = useSkillsData(activeTab);

const carouselRef = ref<HTMLDivElement | null>(null);
let listenersSetup = false;

const {
  canScrollLeft,
  canScrollRight,
  scrollLeft,
  scrollRight,
  checkScrollability,
  setupScrollListeners,
  cleanupScrollListeners,
} = useCarouselScroll(carouselRef, activeTab);

// Watch for carousel component to be mounted and update ref
watch(
  () => carouselComponentRef.value?.carouselRef,
  (newRef) => {
    if (newRef && !carouselRef.value) {
      carouselRef.value = newRef;
      // Setup listeners when ref becomes available (only once)
      if (!listenersSetup) {
        nextTick(() => {
          setupScrollListeners();
          listenersSetup = true;
        });
      }
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Also try to setup listeners on mount in case watch already fired
  if (carouselRef.value && !listenersSetup) {
    setupScrollListeners();
    listenersSetup = true;
  }
});

onUnmounted(() => {
  cleanupScrollListeners();
  listenersSetup = false;
});
</script>

<template>
  <section id="skills" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <SkillsHeader />

      <SkillsTabs
        :tabs="tabs"
        :active-tab="activeTab"
        @update:active-tab="activeTab = $event"
      />

      <div class="max-w-7xl w-full px-4 sm:px-6 lg:px-8 relative">
        <SkillsCarouselNavigation
          :can-scroll-left="canScrollLeft"
          :can-scroll-right="canScrollRight"
          @scroll-left="scrollLeft"
          @scroll-right="scrollRight"
        />

        <SkillsCarousel
          ref="carouselComponentRef"
          :skills="filteredSkills"
          :active-tab="activeTab"
          :on-scrollability-change="checkScrollability"
        />
      </div>
    </div>
  </section>
</template>
