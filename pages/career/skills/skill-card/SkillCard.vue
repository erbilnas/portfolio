<script lang="ts" setup>
import type { SkillCategory } from "~/types/career";
import CategoryHeader from "./CategoryHeader.vue";
import SkillItem from "./SkillItem.vue";

defineProps<{
  category: SkillCategory;
}>();
</script>

<template>
  <div class="relative p-8" :aria-label="category.name + ' skills'">
    <CategoryHeader :name="category.name" :icon="category.icon" />

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 p-2"
      role="list"
    >
      <SkillItem
        v-for="skill in category.skills"
        :key="skill.name"
        :skill="skill"
        role="listitem"
      />
    </div>
  </div>
</template>
