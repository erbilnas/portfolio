export interface Skill {
  name: string;
  description: string;
  icon?: string;
  skillKey?: string;
}

export interface SkillCategory {
  name: string;
  categoryKey?: string;
  icon: string;
  skills: Skill[];
}
