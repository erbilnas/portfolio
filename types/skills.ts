export interface Skill {
  name: string;
  description: string;
  icon?: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}
