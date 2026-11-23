<script setup lang="ts">
import type { Education } from "~/types/experience";
import { useCalculateYearsFromYear } from "~/composables/experience/duration-calculation";

interface Props {
  education: Education;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
});

const calculateYearsFromYear = useCalculateYearsFromYear();

const FOCUS_PREVIEW = 6;

const focusLine = computed(() => {
  const items = props.education.achievements ?? [];
  if (items.length === 0) return "";
  if (items.length <= FOCUS_PREVIEW) return items.join(" · ");
  return `${items.slice(0, FOCUS_PREVIEW).join(" · ")} · +${items.length - FOCUS_PREVIEW}`;
});
</script>

<template>
  <article class="relative w-full">
    <template v-if="!compact">
      <h3
        class="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl dark:text-white"
      >
        {{ education.degree }}
      </h3>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ education.school }}
      </p>
      <p
        class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500 dark:text-gray-400"
      >
        <span>{{ education.year }}</span>
        <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">·</span>
        <span>{{ calculateYearsFromYear(education.year) }}</span>
      </p>
    </template>

    <p
      class="text-pretty text-sm leading-relaxed text-gray-700 md:text-base dark:text-gray-300"
      :class="compact ? '' : 'mt-4'"
    >
      {{ education.description }}
    </p>

    <p
      v-if="focusLine"
      class="mt-3 text-pretty text-xs leading-relaxed text-gray-500 md:text-sm dark:text-gray-500"
    >
      {{ focusLine }}
    </p>
  </article>
</template>
