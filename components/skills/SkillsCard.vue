<script setup lang="ts">
import { BentoGridItem } from "~/components/ui/bento-grid";
import type { SkillWithCategory } from "~/composables/skills";

interface Props {
  skill: SkillWithCategory;
}

defineProps<Props>();
</script>

<template>
  <BentoGridItem
    class="p-6 space-y-3 w-[280px] md:w-[280px] flex-shrink-0 snap-start bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300"
  >
    <template #icon>
      <Icon
        v-if="skill.icon"
        :name="skill.icon"
        class="size-6 text-primary"
      />
    </template>
    <template #title>
      {{ skill.name }}
    </template>
    <template #description>
      {{ skill.description }}
    </template>
  </BentoGridItem>
</template>

