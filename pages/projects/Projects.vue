<script lang="ts" setup>
import { useI18n, useObserver } from "#imports";
import { computed, ref } from "vue";
import { Marquee } from "~/components/ui/marquee";
import { useProjectsData } from "~/composables/use-projects-data";
import { useSettings } from "~/composables/settings";
import type { MarqueeSpeed } from "~/composables/settings";

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const { projects, pending, error } = useProjectsData();
const { marqueeSpeed, setMarqueeSpeed } = useSettings();

const speedOptions: { value: MarqueeSpeed; labelKey: string }[] = [
  { value: "slow", labelKey: "projects.speedSlow" },
  { value: "medium", labelKey: "projects.speedMedium" },
  { value: "fast", labelKey: "projects.speedFast" },
];

// Map marquee speed to duration: slow=120s, medium=75s, fast=45s
const marqueeDuration = computed(() => {
  switch (marqueeSpeed.value) {
    case "slow":
      return 120;
    case "fast":
      return 45;
    default:
      return 75;
  }
});

// Setup observer
useObserver("Projects", sectionRef);
</script>

<template>
  <section id="projects" ref="sectionRef" class="relative">
    <div
      class="bg-white dark:bg-black flex min-h-screen items-center justify-center px-6 py-32"
    >
      <div class="max-w-7xl w-full">
        <div class="mb-16 text-center">
          <h2 class="text-5xl md:text-7xl font-semibold tracking-tight">
            <span class="inline-block text-gray-900 dark:text-white">
              {{ t("projects.title") }}
            </span>
          </h2>
          <p
            class="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl font-light animate-title-fade"
          >
            {{ t("projects.description") }}
          </p>
        </div>

        <div
          v-if="pending"
          class="flex justify-center items-center gap-2 py-16"
        >
          <span
            class="inline-block w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"
          />
          <span class="text-gray-600 dark:text-gray-400">{{
            t("common.loading")
          }}</span>
        </div>

        <div
          v-else-if="error"
          class="text-center py-16 text-gray-600 dark:text-gray-400"
        >
          {{ t("common.error") }}
        </div>

        <div v-else class="space-y-6">
          <div
            class="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
            role="group"
            :aria-label="t('projects.speed')"
          >
            <template v-for="(opt, i) in speedOptions" :key="opt.value">
              <button
                type="button"
                :class="[
                  'transition-colors',
                  marqueeSpeed === opt.value
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'hover:text-gray-700 dark:hover:text-gray-300',
                ]"
                :aria-pressed="marqueeSpeed === opt.value"
                @click="setMarqueeSpeed(opt.value)"
              >
                {{ t(opt.labelKey) }}
              </button>
              <span v-if="i < speedOptions.length - 1" class="opacity-40 select-none">·</span>
            </template>
          </div>
          <Marquee
            :pause-on-hover="true"
            :repeat="2"
            :style="{ '--duration': `${marqueeDuration}s` }"
          >
          <div
            v-for="project in projects"
            :key="project.key"
            class="relative w-80 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-6 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-start justify-between gap-2">
                <h3
                  class="text-xl font-bold text-gray-900 dark:text-white flex-1"
                >
                  {{ project.name }}
                </h3>
                <!-- Desktop: Icons only -->
                <div class="hidden md:flex items-center gap-2">
                  <a
                    v-if="project.visit"
                    :href="project.visit"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    @click.stop
                    :title="t('projects.visitTitle', { name: project.name })"
                  >
                    <Icon name="mdi:open-in-new" class="w-5 h-5" />
                  </a>
                  <a
                    v-if="project.github"
                    :href="project.github"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                    @click.stop
                    :title="t('projects.githubTitle', { name: project.name })"
                  >
                    <Icon name="mdi:github" class="w-5 h-5"></Icon>
                  </a>
                </div>
              </div>

              <!-- Mobile: Buttons -->
              <div class="flex md:hidden gap-2 mt-2">
                <a
                  v-if="project.visit"
                  :href="project.visit"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  @click.stop
                >
                  <Icon name="mdi:open-in-new" class="w-4 h-4" />
                  <span>{{ t("projects.visit") }}</span>
                </a>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  @click.stop
                >
                  <Icon name="mdi:github" class="w-4 h-4" />
                  <span>{{ t("projects.viewSource") }}</span>
                </a>
              </div>

              <p
                class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {{ project.description }}
              </p>
            </div>
          </div>
        </Marquee>
        </div>
      </div>
    </div>
  </section>
</template>
