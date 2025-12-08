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
  const { t } = useI18n();

  const allSkills = computed<SkillWithCategory[]>(() => {
    const skills: SkillWithCategory[] = [];

    skillCategories.forEach((category) => {
      const translatedCategoryName = t(category.name);
      const normalizedCategoryName = normalizeCategoryName(
        translatedCategoryName
      );

      category.skills.forEach((skill) => {
        skills.push({
          name: t(skill.name),
          description: t(skill.description),
          icon: skill.icon,
          skillKey: skill.skillKey,
          category: normalizedCategoryName,
          originalCategory: translatedCategoryName,
        });
      });
    });

    return skills;
  });

  const tabs = computed(() => {
    const categoryNames = skillCategories.map((cat) => {
      const translatedName = t(cat.name);
      return normalizeCategoryName(translatedName);
    });
    return categoryNames;
  });

  const filteredSkills = computed<SkillWithCategory[]>(() => {
    return allSkills.value.filter(
      (skill) => skill.category === activeTab.value
    );
  });

  return {
    allSkills,
    tabs,
    filteredSkills,
  };
};
