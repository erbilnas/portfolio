import type { SkillCategory } from "~/types/skills";

export const skillCategories: SkillCategory[] = [
  {
    name: "Favorites",
    icon: "lucide:star",
    skills: [
      {
        name: "Vue.js",
        description: "Expert",
        icon: "simple-icons:vuedotjs",
      },
      { name: "React", description: "Advanced", icon: "lucide:star" },
      {
        name: "TypeScript",
        description: "Expert",
        icon: "lucide:star",
      },
      {
        name: "TailwindCSS",
        description: "Expert",
        icon: "lucide:star",
      },
    ],
  },
  {
    name: "Frontend",
    icon: "lucide:panel-top",
    skills: [
      {
        name: "Vue.js",
        description: "Expert",
        icon: "simple-icons:vuedotjs",
      },
      {
        name: "React",
        description: "Advanced",
        icon: "simple-icons:react",
      },
      {
        name: "TypeScript",
        description: "Expert",
        icon: "simple-icons:typescript",
      },
      {
        name: "TailwindCSS",
        description: "Expert",
        icon: "simple-icons:tailwindcss",
      },
    ],
  },
  {
    name: "Backend",
    icon: "mdi:server",
    skills: [
      {
        name: "Node.js",
        description: "Expert",
        icon: "simple-icons:nodedotjs",
      },
      {
        name: "Express",
        description: "Advanced",
        icon: "simple-icons:express",
      },
      {
        name: "MongoDB",
        description: "Advanced",
        icon: "simple-icons:mongodb",
      },
      {
        name: "PostgreSQL",
        description: "Advanced",
        icon: "simple-icons:postgresql",
      },
    ],
  },
  {
    name: "DevOps",
    icon: "mdi:cloud",
    skills: [
      {
        name: "Docker",
        description: "Advanced",
        icon: "simple-icons:docker",
      },
      {
        name: "AWS",
        description: "Intermediate",
        icon: "simple-icons:amazonaws",
      },
      {
        name: "CI/CD",
        description: "Advanced",
        icon: "lucide:git-branch",
      },
      {
        name: "Linux",
        description: "Advanced",
        icon: "simple-icons:linux",
      },
    ],
  },
  {
    name: "Design",
    icon: "lucide:palette",
    skills: [
      {
        name: "Figma",
        description: "Expert",
        icon: "simple-icons:figma",
      },
      {
        name: "Photoshop",
        description: "Advanced",
        icon: "simple-icons:adobephotoshop",
      },
    ],
  },
  {
    name: "Languages",
    icon: "lucide:earth",
    skills: [
      {
        name: "English",
        description: "Native",
        icon: "circle-flags:uk",
      },
      {
        name: "French",
        description: "Native",
        icon: "circle-flags:fr",
      },
    ],
  },
];
