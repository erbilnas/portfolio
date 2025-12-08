<script setup lang="ts">
import type { Education } from "~/types/experience";
import { useCalculateYearsFromYear } from "~/composables/experience/duration-calculation";

interface Props {
  education: Education;
}

defineProps<Props>();

const calculateYearsFromYear = useCalculateYearsFromYear();
</script>

<template>
  <div class="relative pl-12 md:pl-12 pb-8 md:pb-16">
    <!-- Header -->
    <div class="mb-4">
      <!-- Show school on mobile only -->
      <h4
        class="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1 md:hidden"
      >
        {{ education.school }}
      </h4>
      <h3
        class="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {{ education.degree }}
      </h3>
      <div
        class="text-xs md:text-sm text-slate-500 dark:text-slate-400"
      >
        {{ education.year }}
        <span class="ml-2 text-slate-400 dark:text-slate-500">
          • {{ calculateYearsFromYear(education.year) }}
        </span>
      </div>
    </div>

    <!-- Description -->
    <div>
      <p
        class="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed"
      >
        {{ education.description }}
      </p>
    </div>
  </div>
</template>

