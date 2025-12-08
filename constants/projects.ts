import type { Project } from "~/types/projects";

export const projectsList: Project[] = [
  {
    key: "baklava",
    name: "Baklava Design System",
    description:
      "Baklava is a design system provided by Trendyol to create a consistent UI/UX for app users.",
    tech: ["TypeScript", "Web Components", "Lit", "Design System"],
    features: [
      "Framework Agnostic",
      "Accessible",
      "Responsive",
      "Performance Optimized",
      "Design System",
    ],
    github: "https://github.com/Trendyol/baklava",
  },
  {
    key: "spaceflash",
    name: "Spaceflash",
    description:
      "Spaceflash is a wave-based shooter playable with a VR headset (Oculus, HTC, etc.) where you destroy endless enemies coming to defend your moon base.",
    tech: ["Unity", "C#", "Game Development"],
    features: ["Wave-based Shooter", "VR", "Game Development"],
    github: "https://github.com/erbilnas/spaceflash",
  },
  {
    key: "perfanalytics",
    name: "Perfanalytics",
    description:
      "A client-side library which collects some performance related key metrics from browser and sends to the API.",
    tech: ["JavaScript", "Performance Monitoring"],
    features: ["Performance Monitoring", "JavaScript"],
    github: "https://github.com/erbilnas/perfanalytics-js",
  },
  {
    key: "crossingOfTheRhine",
    name: "Crossing of the Rhine: A.D. 406",
    description:
      "Crossing of the Rhine: A.D. 406 is a turn-based/RPG game based on a historical event and developed with Python.",
    tech: ["Python", "Unity", "Game Development"],
    features: ["Turn-based/RPG", "Historical Event", "Game Development"],
    github: "https://github.com/team-horse-oclock/AD406",
  },
];
