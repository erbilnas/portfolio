<script lang="ts" setup>
import { ref } from "vue";
import { Marquee } from "~/components/ui/marquee";
import { projectsList } from "~/constants/projects";

const sectionRef = ref<HTMLElement | null>(null);

// Setup observer
const { observeSectionChange } = useObserver("Projects", sectionRef);
observeSectionChange();
</script>

<template>
  <section id="projects" ref="sectionRef">
    <div
      class="bg-white dark:bg-black flex min-h-screen items-center justify-center px-6 py-32"
    >
      <div class="max-w-7xl w-full">
        <div class="mb-16 text-center">
          <h2
            class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Projects
          </h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A showcase of projects I've worked on, featuring innovative
            solutions and creative implementations.
          </p>
        </div>

        <Marquee :pause-on-hover="true" :repeat="2" style="--duration: 15s">
          <div
            v-for="(project, index) in projectsList"
            :key="index"
            class="relative w-80 cursor-pointer overflow-hidden rounded-xl border border-gray-950/[.1] bg-gray-950/[.01] p-6 hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
          >
            <div class="flex flex-col gap-4">
              <div class="flex items-start justify-between gap-2">
                <h3
                  class="text-xl font-bold text-gray-900 dark:text-white flex-1"
                >
                  {{ project.name }}
                </h3>
                <a
                  v-if="project.github"
                  :href="project.github"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  @click.stop
                >
                  <Icon name="mdi:github" class="w-5 h-5" />
                </a>
              </div>

              <p
                class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {{ project.description }}
              </p>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tech in project.tech"
                  :key="tech"
                  class="text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </Marquee>
      </div>
    </div>
  </section>
</template>
