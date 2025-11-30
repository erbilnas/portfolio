<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { MorphingTabs } from "~/components/ui/morphing-tabs";
import { Timeline } from "~/components/ui/timeline";
import { useMediaQuery } from "~/composables/use-media-query-client";
import { educationList, experiences } from "~/constants/career";
import type { Education, WorkExperience } from "~/types/career";

const sectionRef = ref<HTMLElement | null>(null);

const { observeSectionChange } = useObserver("Experience", sectionRef);
observeSectionChange();

const isMobile = useMediaQuery("(max-width: 768px)");

const tabs = ["Work Experience", "Education"];
const activeTab = ref("Work Experience");

type TimelineItem =
  | { type: "experience"; data: WorkExperience }
  | { type: "education"; data: Education };

function parseDate(dateStr: string): Date | null {
  // Format: "Month YYYY" (e.g., "July 2021", "October 2019")
  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const parts = dateStr.split(" ");
  if (parts.length !== 2) return null;

  const monthName = parts[0].toLowerCase();
  const year = parseInt(parts[1], 10);

  if (!months[monthName] || isNaN(year)) return null;

  return new Date(year, months[monthName], 1);
}

function parseYear(yearStr: string): Date | null {
  // Format: "YYYY - Present" or "YYYY - YYYY"
  const parts = yearStr.split(" - ");
  if (parts.length !== 2) return null;

  const startYear = parseInt(parts[0].trim(), 10);
  if (isNaN(startYear)) return null;

  return new Date(startYear, 0, 1);
}

function getStartDate(item: TimelineItem): Date | null {
  if (item.type === "experience") {
    const parts = item.data.period.split(" - ");
    if (parts.length !== 2) return null;
    return parseDate(parts[0].trim());
  } else {
    return parseYear(item.data.year);
  }
}

function calculateYears(period: string): string {
  const parts = period.split(" - ");
  if (parts.length !== 2) return "";

  const startStr = parts[0].trim();
  const endStr = parts[1].trim();

  // Parse start date
  const startDate = parseDate(startStr);
  if (!startDate) return "";

  // Parse end date
  let endDate: Date | null = null;
  if (endStr.toLowerCase() === "present") {
    endDate = new Date();
  } else {
    endDate = parseDate(endStr);
  }

  if (!endDate) return "";

  // Calculate difference in years
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  if (diffYears < 1) {
    const months = Math.round(diffYears * 12);
    return months === 1 ? "1 month" : `${months} months`;
  }

  const years = Math.floor(diffYears);
  const remainingMonths = Math.round((diffYears - years) * 12);

  if (years === 0) {
    return remainingMonths === 1 ? "1 month" : `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return years === 1 ? "1 year" : `${years} years`;
  }

  return `${years} ${years === 1 ? "year" : "years"} ${remainingMonths} ${
    remainingMonths === 1 ? "month" : "months"
  }`;
}

function calculateYearsFromYear(yearStr: string): string {
  const parts = yearStr.split(" - ");
  if (parts.length !== 2) return "";

  const startYear = parseInt(parts[0].trim(), 10);
  const endStr = parts[1].trim();

  if (isNaN(startYear)) return "";

  let endYear: number;
  if (endStr.toLowerCase() === "present") {
    endYear = new Date().getFullYear();
  } else {
    endYear = parseInt(endStr, 10);
    if (isNaN(endYear)) return "";
  }

  const diffYears = endYear - startYear + 1;

  if (diffYears === 1) {
    return "1 year";
  }

  return `${diffYears} years`;
}

// Separate work experience and education timelines
const workExperienceItems = computed<TimelineItem[]>(() => {
  const items: TimelineItem[] = experiences.map((exp) => ({
    type: "experience" as const,
    data: exp,
  }));

  // Sort by start date (most recent first)
  return items.sort((a, b) => {
    const dateA = getStartDate(a);
    const dateB = getStartDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateB.getTime() - dateA.getTime();
  });
});

const educationItems = computed<TimelineItem[]>(() => {
  const items: TimelineItem[] = educationList.map((edu) => ({
    type: "education" as const,
    data: edu,
  }));

  // Sort by start date (most recent first)
  return items.sort((a, b) => {
    const dateA = getStartDate(a);
    const dateB = getStartDate(b);

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    return dateB.getTime() - dateA.getTime();
  });
});

// Get the current timeline items based on active tab
const timelineItems = computed<TimelineItem[]>(() => {
  return activeTab.value === "Work Experience"
    ? workExperienceItems.value
    : educationItems.value;
});

// Transform timelineItems into Timeline component format
const timelineItemsForComponent = computed(() => {
  return timelineItems.value.map((item, index) => {
    const id =
      item.type === "experience"
        ? `exp-${item.data.company}-${index}`
        : `edu-${item.data.school}-${index}`;
    const label =
      item.type === "experience" ? item.data.company : item.data.school;
    return { id, label };
  });
});

// Create items with slot names for template iteration
const timelineItemsWithSlots = computed(() => {
  return timelineItems.value.map((item, index) => ({
    item,
    slotName:
      item.type === "experience"
        ? `exp-${item.data.company}-${index}`
        : `edu-${item.data.school}-${index}`,
  }));
});
</script>

<template>
  <section id="experience" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-7xl font-semibold tracking-tight">
          <span class="inline-block text-gray-900 dark:text-white">
            Experience
          </span>
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl font-light animate-title-fade"
        >
          My professional journey, work experience, and education
        </p>
      </div>

      <!-- Mobile Tabs -->
      <div v-if="isMobile" class="flex justify-center items-center w-full">
        <div class="w-full max-w-2xl px-4">
          <div
            class="flex justify-center overflow-x-auto scrollbar-hide gap-2 py-2"
          >
            <Button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/30 text-muted-foreground hover:text-primary',
              ]"
            >
              {{ tab }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Desktop Tabs -->
      <div v-else class="flex justify-center items-center">
        <MorphingTabs
          :tabs="tabs"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
        />
      </div>

      <div class="w-full max-w-4xl">
        <Timeline :items="timelineItemsForComponent">
          <template
            v-for="{ item, slotName } in timelineItemsWithSlots"
            :key="slotName"
            #[slotName]
          >
            <div class="relative pl-12 md:pl-12 pb-8 md:pb-16">
              <!-- Experience Entry -->
              <div v-if="item.type === 'experience'">
                <!-- Header -->
                <div class="mb-4">
                  <!-- Show company on mobile only -->
                  <h4
                    class="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1 md:hidden"
                  >
                    {{ item.data.company }}
                  </h4>
                  <h3
                    class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {{ item.data.currentPosition }}
                  </h3>
                  <div
                    class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2"
                  >
                    <span>{{ item.data.location }}</span>
                  </div>
                  <div
                    class="text-xs md:text-sm text-slate-500 dark:text-slate-400"
                  >
                    {{ item.data.period }}
                    <span class="ml-2 text-slate-400 dark:text-slate-500">
                      • {{ calculateYears(item.data.period) }}
                    </span>
                  </div>
                </div>

                <!-- Positions (if available) -->
                <div
                  v-if="item.data.positions && item.data.positions.length > 0"
                  class="mb-4 space-y-2"
                >
                  <h4
                    class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 tracking-wide"
                  >
                    Positions
                  </h4>
                  <div class="space-y-2">
                    <div
                      v-for="(position, posIndex) in item.data.positions"
                      :key="posIndex"
                      class="flex flex-col sm:flex-row justify-between sm:items-center gap-1 text-sm"
                    >
                      <span
                        class="text-slate-900 dark:text-slate-200 font-medium"
                        >{{ position.title }}</span
                      >
                      <span
                        class="text-slate-600 dark:text-slate-400 text-xs"
                        >{{ position.duration }}</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <div
                    class="space-y-3 text-slate-700 dark:text-slate-300 text-sm md:text-base"
                  >
                    <div
                      v-for="(desc, i) in item.data.description"
                      :key="i"
                      class="leading-relaxed hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      {{ desc }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Education Entry -->
              <div v-else>
                <!-- Header -->
                <div class="mb-4">
                  <!-- Show school on mobile only -->
                  <h4
                    class="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1 md:hidden"
                  >
                    {{ item.data.school }}
                  </h4>
                  <h3
                    class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    {{ item.data.degree }}
                  </h3>
                  <div
                    class="text-xs md:text-sm text-slate-500 dark:text-slate-400"
                  >
                    {{ item.data.year }}
                    <span class="ml-2 text-slate-400 dark:text-slate-500">
                      • {{ calculateYearsFromYear(item.data.year) }}
                    </span>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <p
                    class="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed"
                  >
                    {{ item.data.description }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </Timeline>
      </div>
    </div>
  </section>
</template>
