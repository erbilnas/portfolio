export type SkillMastery = "learning" | "mastered";

export interface SkillItem {
  name: string;
  mastery: SkillMastery;
  icon?: string;
  description?: string;
}

export interface Skill {
  category: string;
  items: SkillItem[];
}
