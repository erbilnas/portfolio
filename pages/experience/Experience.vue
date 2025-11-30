<script setup lang="ts">
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

const tabs: ExperienceTab[] = ["Work Experience", "Education"];
const activeTab = ref<ExperienceTab>("Work Experience");

const timelineItems = useTimelineItems(activeTab);
const timelineItemsForComponent = useTimelineItemsForComponent(timelineItems);
const timelineItemsWithSlots = useTimelineItemsWithSlots(timelineItems);
</script>

<template>
  <section id="experience" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <ExperienceHeader />

      <ExperienceTabs
        :tabs="tabs"
        :activeTab="activeTab"
        @update:activeTab="activeTab = $event"
      />

      <div class="w-full max-w-4xl">
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
