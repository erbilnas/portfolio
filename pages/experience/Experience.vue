<script setup lang="ts">
import { useI18n, useObserver } from "#imports";
import {
  EducationEntry,
  ExperienceEntry,
  ExperienceHeader,
  ExperienceTabs,
} from "~/components/experience";
import { Timeline } from "~/components/ui/timeline";
import {
  useTimelineItems,
  useTimelineItemsForComponent,
  useTimelineItemsWithSlots,
} from "~/composables/experience";
import type { ExperienceTab } from "~/types/experience";

const sectionRef = ref<HTMLElement | null>(null);

useObserver("Experience", sectionRef);

const { t, locale } = useI18n();

// Use keys instead of translated strings for tab matching
const WORK_EXPERIENCE_KEY = "workExperience";
const EDUCATION_KEY = "education";

const tabs = computed<ExperienceTab[]>(() => [
  t(`experience.${WORK_EXPERIENCE_KEY}`) as ExperienceTab,
  t(`experience.${EDUCATION_KEY}`) as ExperienceTab,
]);

const activeTab = ref<ExperienceTab>(
  t(`experience.${WORK_EXPERIENCE_KEY}`) as ExperienceTab
);

// Track active tab by key for reliable comparison
const activeTabKey = ref<"workExperience" | "education">(WORK_EXPERIENCE_KEY);

// Update activeTab when locale changes
watch(
  () => locale.value,
  () => {
    const currentTabIndex = tabs.value.findIndex(
      (tab) => tab === activeTab.value
    );
    if (currentTabIndex === 0) {
      activeTab.value = tabs.value[0];
      activeTabKey.value = WORK_EXPERIENCE_KEY;
    } else if (currentTabIndex === 1) {
      activeTab.value = tabs.value[1];
      activeTabKey.value = EDUCATION_KEY;
    } else {
      // Default to first tab if current tab doesn't match
      activeTab.value = tabs.value[0];
      activeTabKey.value = WORK_EXPERIENCE_KEY;
    }
  }
);

// Watch for tab changes to update the key
watch(activeTab, (newTab) => {
  const tabIndex = tabs.value.findIndex((tab) => tab === newTab);
  if (tabIndex === 0) {
    activeTabKey.value = WORK_EXPERIENCE_KEY;
  } else if (tabIndex === 1) {
    activeTabKey.value = EDUCATION_KEY;
  }
});

// Handler for tab updates
function handleTabUpdate(tab: ExperienceTab) {
  activeTab.value = tab;
  const tabIndex = tabs.value.findIndex((t) => t === tab);
  if (tabIndex === 0) {
    activeTabKey.value = WORK_EXPERIENCE_KEY;
  } else if (tabIndex === 1) {
    activeTabKey.value = EDUCATION_KEY;
  }
}

const timelineItems = useTimelineItems(activeTabKey);
const timelineItemsForComponent = useTimelineItemsForComponent(timelineItems);
const timelineItemsWithSlots = useTimelineItemsWithSlots(timelineItems);

</script>

<template>
  <section id="experience" ref="sectionRef" class="relative">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <ExperienceHeader />

      <ExperienceTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @update:activeTab="handleTabUpdate"
      />

      <div class="relative w-full max-w-4xl">
        <Timeline :items="timelineItemsForComponent">
          <template
            v-for="{ item, slotName } in timelineItemsWithSlots"
            :key="slotName"
            #[slotName]
          >
            <ExperienceEntry
              v-if="item.type === 'experience'"
              :experience="item.data"
            />
            <EducationEntry v-else :education="item.data" />
          </template>
        </Timeline>
      </div>
    </div>
  </section>
</template>
