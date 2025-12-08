<script setup lang="ts">
import { useCalculateYears } from "~/composables/experience/duration-calculation";
import type { WorkExperience } from "~/types/experience";

interface Props {
  experience: WorkExperience;
}

defineProps<Props>();

const calculateYears = useCalculateYears();
</script>

<template>
  <div class="relative pl-12 md:pl-12 pb-8 md:pb-16">
    <!-- Header -->
    <div class="mb-4">
      <!-- Show company on mobile only -->
      <h4
        class="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1 md:hidden"
      >
        {{ experience.company }}
      </h4>
      <h3
        class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {{ experience.currentPosition }}
      </h3>
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2"
      >
        <span>{{ experience.location }}</span>
      </div>
      <div class="text-xs md:text-sm text-slate-500 dark:text-slate-400">
        {{ experience.period }}
        <span class="ml-2 text-slate-400 dark:text-slate-500">
          • {{ calculateYears(experience.period) }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div>
      <div
        class="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        {{ experience.description }}
      </div>
    </div>
  </div>
</template>
