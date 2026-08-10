<script lang="ts" setup>
import SponsoredShowcase from "~/components/sponsored-by-me/SponsoredShowcase.vue";
import ProjectsRepoStrip from "~/components/projects/ProjectsRepoStrip.vue";
import { sponsoredApps } from "~/constants/sponsored-apps";
import { useProjectsData } from "~/composables/use-projects-data";

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const { projects, pending, error } = useProjectsData();

useObserver("Projects", sectionRef);

const showRepoStrip = computed(
  () => !pending.value && !error.value && projects.value.length > 0,
);
</script>

<template>
  <section id="projects" ref="sectionRef" class="relative">
    <div
      class="flex min-h-screen flex-col items-center justify-center gap-12 bg-white px-6 py-20 dark:bg-black md:gap-14 md:py-24"
    >
      <div class="w-full max-w-6xl text-center">
        <h2
          class="text-5xl font-semibold tracking-tight text-gray-900 dark:text-white md:text-7xl"
        >
          {{ t("projects.title") }}
        </h2>
        <p
          class="mx-auto mt-4 max-w-2xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400 md:text-xl"
        >
          {{ t("projects.description") }}
        </p>
      </div>

      <SponsoredShowcase
        v-if="sponsoredApps.length > 0"
        :items="sponsoredApps"
      />

      <p
        v-else
        class="max-w-xl text-center text-gray-500 dark:text-gray-400"
      >
        {{ t("projects.empty") }}
      </p>

      <ProjectsRepoStrip
        v-if="showRepoStrip"
        :projects="projects"
      />
    </div>
  </section>
</template>
