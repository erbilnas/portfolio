interface Project {
  name: string;
  description: string;
  tech: string[];
  features: string[];
  status: "Active" | "In Progress" | "Archived";
  github?: string;
}

export const projectsList: Project[] = [
  {
    name: "erbilnas.com",
    description:
      "Personal website built with modern web technologies, featuring a unique design and interactive elements.",
    tech: ["Vue.js", "Nuxt.js", "TailwindCSS", "TypeScript"],
    features: [
      "Dark Mode",
      "Responsive Design",
      "Interactive UI",
      "SEO Optimized",
    ],
    status: "Active",
    github: "https://github.com/erbilnas/erbilnas-com",
  },
  {
    name: "Perfanalytics",
    description:
      "A web analytics tool focused on performance metrics and user experience monitoring.",
    tech: ["Node.js", "MongoDB", "Vue.js", "Docker"],
    features: [
      "Real-time Analytics",
      "Performance Monitoring",
      "API Integration",
    ],
    status: "In Progress",
    github: "https://github.com/erbilnas/perfanalytics",
  },
];
