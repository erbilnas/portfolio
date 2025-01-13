export type CareerTabs = "Skills" | "Experience" | "Education" | "Projects";

export interface Position {
  title: string;
  duration: string;
}

export interface WorkExperience {
  company: string;
  currentPosition: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
  positions?: Position[];
}

export interface Skill {
  name: string;
  description: string;
  icon: string;
}

export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  description: string;
  achievements: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  features: string[];
  status: "Active" | "In Progress" | "Archived";
  github?: string;
}
