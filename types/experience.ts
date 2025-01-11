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
