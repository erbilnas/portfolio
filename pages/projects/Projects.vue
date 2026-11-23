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
      class="flex min-h-screen flex-col items-center justify-center gap-12 bg-white px-6 py-24 dark:bg-black md:gap-16 md:px-10 md:py-32"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h2
          class="text-balance text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-6xl"
        >
          {{ t("projects.title") }}
        </h2>
        <p
          class="mt-3 text-pretty text-base text-neutral-500 dark:text-neutral-400 md:mt-4 md:text-lg"
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
        class="max-w-xl text-center text-neutral-500 dark:text-neutral-400"
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
