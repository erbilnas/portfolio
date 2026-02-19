<script lang="ts" setup>
import { useI18n, useObserver } from "#imports";
import { computed, ref } from "vue";
import { Marquee } from "~/components/ui/marquee";
import { useProjectsData } from "~/composables/use-projects-data";

const { t } = useI18n();
const sectionRef = ref<HTMLElement | null>(null);
const marqueeDuration = ref(75);
const { projects, pending, error } = useProjectsData();

const speedLabel = computed(() => {
  if (marqueeDuration.value <= 45) return t("projects.speedFast");
  if (marqueeDuration.value <= 85) return t("projects.speedMedium");
  return t("projects.speedSlow");
});

const speedSlider = computed({
  get: () => 145 - marqueeDuration.value,
  set: (v) => { marqueeDuration.value = 145 - v; },
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
            class="flex items-center justify-center gap-2"
            :title="t('projects.speed')"
          >
            <Icon
              name="mdi:speedometer"
              class="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0"
            />
            <input
              v-model.number="speedSlider"
              type="range"
              min="25"
              max="120"
              class="w-32 h-1.5 rounded-full appearance-none bg-gray-200 dark:bg-gray-700 accent-gray-600 dark:accent-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-black"
            />
            <span
              class="min-w-[3.5rem] text-sm text-gray-500 dark:text-gray-400"
            >
              {{ speedLabel }}
            </span>
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
