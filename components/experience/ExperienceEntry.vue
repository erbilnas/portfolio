<script setup lang="ts">
import { useCalculateYears } from "~/composables/experience/duration-calculation";
import type { WorkExperience } from "~/types/experience";

interface Props {
  experience: WorkExperience;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const calculateYears = useCalculateYears();

const TECH_PREVIEW = 8;

const techLine = computed(() => {
  const tech = props.experience.technologies ?? [];
  if (tech.length === 0) return "";
  if (tech.length <= TECH_PREVIEW) return tech.join(" · ");
  return `${tech.slice(0, TECH_PREVIEW).join(" · ")} · +${tech.length - TECH_PREVIEW}`;
});
</script>

<template>
  <article class="relative w-full">
    <template v-if="!compact">
      <h3
        class="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ experience.currentPosition }}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ experience.company }}
      </p>
      <p
        class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400"
      >
        <span>{{ experience.location }}</span>
        <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
        <span>{{ experience.period }}</span>
        <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
        <span>{{ calculateYears(experience.period) }}</span>
      </p>
    </template>

    <p
      v-else
      class="text-sm text-gray-500 dark:text-gray-400"
    >
      {{ experience.location }}
    </p>

    <p
      class="mt-3 text-pretty text-sm leading-relaxed text-gray-700 md:text-base dark:text-gray-300"
      :class="compact ? 'mt-3' : 'mt-4'"
    >
      {{ experience.description }}
    </p>

    <p
      v-if="techLine"
      class="mt-3 text-pretty text-xs leading-relaxed text-gray-500 md:text-sm dark:text-gray-500"
    >
      {{ techLine }}
    </p>
  </article>
</template>
