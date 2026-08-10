<script lang="ts" setup>
import { Marquee } from "~/components/ui/marquee";
import { useSettings } from "~/composables/settings";
import type { Project } from "~/types/projects";

defineProps<{
  projects: Project[];
}>();

const { t } = useI18n();
const { reducedMotion } = useSettings();
</script>

<template>
  <div
    v-if="projects.length > 0"
    class="w-full max-w-6xl"
  >
    <p
      class="mb-3 text-xs font-medium text-neutral-500 dark:text-neutral-400"
    >
      {{ t("projects.openSource") }}
    </p>

    <Marquee
      v-if="!reducedMotion"
      :pause-on-hover="true"
      :repeat="2"
      class="p-0 [--duration:50s] [--gap:1.5rem]"
    >
      <a
        v-for="project in projects"
        :key="project.key"
        :href="project.github || project.visit"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex shrink-0 items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
        :title="
          project.github
            ? t('projects.githubTitle', { name: project.name })
            : t('projects.visitTitle', { name: project.name })
        "
      >
        <span class="whitespace-nowrap">{{ project.name }}</span>
        <span
          class="text-neutral-400 dark:text-neutral-500"
          aria-hidden="true"
        >↗</span>
      </a>
    </Marquee>

    <ul
      v-else
      class="flex flex-wrap gap-x-6 gap-y-2"
    >
      <li
        v-for="project in projects"
        :key="project.key"
      >
        <a
          :href="project.github || project.visit"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          :title="
            project.github
              ? t('projects.githubTitle', { name: project.name })
              : t('projects.visitTitle', { name: project.name })
          "
        >
          <span class="whitespace-nowrap">{{ project.name }}</span>
          <span
            class="text-neutral-400 dark:text-neutral-500"
            aria-hidden="true"
          >↗</span>
        </a>
      </li>
    </ul>
  </div>
</template>
