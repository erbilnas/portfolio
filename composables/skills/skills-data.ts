import { computed, type Ref } from "vue";
import { skillCategories } from "~/constants/skills";
import type { Skill } from "~/types/skills";
import { normalizeCategoryName } from "./category-normalization";

export interface SkillWithCategory extends Skill {
  category: string;
  originalCategory: string;
}

/**
 * Composable for managing skills data and filtering
 */
export const useSkillsData = (activeTab: Ref<string>) => {
  const allSkills = computed<SkillWithCategory[]>(() => {
    const skills: SkillWithCategory[] = [];

    skillCategories.forEach((category) => {
      category.skills.forEach((skill) => {
        skills.push({
          ...skill,
          category: normalizeCategoryName(category.name),
          originalCategory: category.name,
        });
      });
    });

    return skills;
  });

  const tabs = computed(() => {
    const categoryNames = skillCategories.map((cat) =>
      normalizeCategoryName(cat.name)
    );
    return categoryNames;
  });

  const filteredSkills = computed<SkillWithCategory[]>(() => {
    return allSkills.value.filter((skill) => skill.category === activeTab.value);
  });

  return {
    allSkills,
    tabs,
    filteredSkills,
  };
};

