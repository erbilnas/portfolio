<script setup lang="ts">
import {
  SkillsCarousel,
  SkillsCarouselNavigation,
  SkillsHeader,
  SkillsTabs,
} from "~/components/skills";
import { useCarouselScroll, useSkillsData } from "~/composables/skills";
import { normalizeCategoryName } from "~/composables/skills/category-normalization";

const sectionRef = ref<HTMLElement | null>(null);
const carouselComponentRef = ref<InstanceType<typeof SkillsCarousel> | null>(
  null,
);

useObserver("Skills", sectionRef);

const { t, locale } = useI18n();

const activeTab = ref(normalizeCategoryName(t("skills.categories.favorites")));

const { tabs, filteredSkills } = useSkillsData(activeTab);

watch(
  () => locale.value,
  () => {
    const currentTabIndex = tabs.value.findIndex(
      (tab) => tab === activeTab.value,
    );
    if (currentTabIndex >= 0) {
      activeTab.value = tabs.value[currentTabIndex];
    } else {
      activeTab.value = tabs.value[0];
    }
  },
);

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

watch(
  () => carouselComponentRef.value?.carouselRef,
  (newRef) => {
    if (newRef && !carouselRef.value) {
      carouselRef.value = newRef;
      if (!listenersSetup) {
        nextTick(() => {
          setupScrollListeners();
          listenersSetup = true;
        });
      }
    }
  },
  { immediate: true },
);

onMounted(() => {
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
  <section id="skills" ref="sectionRef" class="relative">
    <div
      class="flex min-h-screen flex-col items-center gap-12 overflow-hidden bg-white px-6 py-24 dark:bg-black md:gap-16 md:px-10 md:py-32"
    >
      <SkillsHeader />

      <div class="flex w-full max-w-6xl flex-col gap-6 md:gap-8">
        <div
          class="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <SkillsTabs
            :tabs="tabs"
            :active-tab="activeTab"
            @update:active-tab="activeTab = $event"
          />

          <SkillsCarouselNavigation
            :can-scroll-left="canScrollLeft"
            :can-scroll-right="canScrollRight"
            @scroll-left="scrollLeft"
            @scroll-right="scrollRight"
          />
        </div>

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
