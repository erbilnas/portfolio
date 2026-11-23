<script setup lang="ts">
import { useI18n, useObserver } from "#imports";
import {
  ExperienceHeader,
  ExperienceStack,
  ExperienceTabs,
} from "~/components/experience";
import { useTimelineItems } from "~/composables/experience";
import { useSettings } from "~/composables/settings";
import type { ExperienceTabKey } from "~/types/experience";

const sectionRef = ref<HTMLElement | null>(null);

useObserver("Experience", sectionRef);

const { t } = useI18n();
const { reducedMotion } = useSettings();

const activeTabKey = ref<ExperienceTabKey>("workExperience");

const tabs = computed(() => [
  {
    key: "workExperience" as const,
    label: t("experience.workExperience"),
  },
  {
    key: "education" as const,
    label: t("experience.education"),
  },
]);

const timelineItems = useTimelineItems(activeTabKey);
</script>

<template>
  <section id="experience" ref="sectionRef" class="relative">
    <div
      class="flex min-h-screen flex-col items-center gap-12 bg-white px-6 py-24 dark:bg-black md:gap-16 md:px-10 md:py-32"
    >
      <div class="flex w-full max-w-2xl flex-col items-center gap-6 md:gap-8">
        <ExperienceHeader />
        <ExperienceTabs
          :tabs="tabs"
          :active-key="activeTabKey"
          @update:active-key="activeTabKey = $event"
        />
      </div>

      <div class="relative w-full max-w-2xl">
        <Transition
          mode="out-in"
          :enter-active-class="
            reducedMotion
              ? ''
              : 'transition duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]'
          "
          :enter-from-class="reducedMotion ? '' : 'translate-y-1'"
          :enter-to-class="reducedMotion ? '' : 'translate-y-0'"
          :leave-active-class="
            reducedMotion
              ? ''
              : 'transition duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]'
          "
          :leave-from-class="reducedMotion ? '' : 'translate-y-0'"
          :leave-to-class="reducedMotion ? '' : 'translate-y-1'"
        >
          <div
            :id="`experience-panel-${activeTabKey}`"
            :key="activeTabKey"
            role="tabpanel"
            :aria-labelledby="`experience-tab-${activeTabKey}`"
          >
            <ExperienceStack :items="timelineItems" />
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
