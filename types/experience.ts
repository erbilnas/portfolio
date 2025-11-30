export interface WorkExperience {
  company: string;
  currentPosition: string;
  period: string;
  location: string;
  description: string;
  technologies: string[];
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  description: string;
  achievements: string[];
}

export type TimelineItem =
  | { type: "experience"; data: WorkExperience }
  | { type: "education"; data: Education };

export type ExperienceTab = "Work Experience" | "Education";
