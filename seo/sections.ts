export interface SectionMeta {
  title: string;
  description?: string;
}

const SITE_NAME = "Erbil Nas";

export const sectionMeta: Record<string, SectionMeta> = {
  Welcome: {
    title: `${SITE_NAME} | Welcome`,
    description:
      "Welcome to my personal website. I am a Software Engineer passionate about creating innovative solutions and sharing knowledge.",
  },
  "About Me": {
    title: `${SITE_NAME} | About Me`,
    description:
      "Learn more about Erbil Nas - a software engineer passionate about building with zeros and ones. Born and raised in Turkey.",
  },
  Skills: {
    title: `${SITE_NAME} | Skills`,
    description:
      "Technologies and tools I work with - from frontend and backend development to DevOps, AI, and design.",
  },
  Experience: {
    title: `${SITE_NAME} | Experience`,
    description:
      "My professional work experience and education history as a Software Engineer.",
  },
  Projects: {
    title: `${SITE_NAME} | Projects`,
    description:
      "A showcase of projects I've worked on, featuring innovative solutions and creative implementations.",
  },
  "Current Vibes": {
    title: `${SITE_NAME} | Current Vibes`,
    description:
      "What I'm currently enjoying - from music and games to books and shows.",
  },
};
