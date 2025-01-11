<script lang="ts" setup>
import type { SkillCategory } from "~/types/skills";
import CategoryHeader from "./CategoryHeader.vue";
import SkillItem from "./SkillItem.vue";

defineProps<{
  category: SkillCategory;
}>();
</script>

<template>
  <div
    class="relative p-4 sm:p-6 md:p-8 w-[calc(100vw-50px)] md:max-w-xl"
    :aria-label="category.name + ' skills'"
  >
    <CategoryHeader :name="category.name" :icon="category.icon" />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-2" role="list">
      <SkillItem
        v-for="skill in category.skills"
        :key="skill.name"
        :skill="skill"
        role="listitem"
      />
    </div>
  </div>
</template>
