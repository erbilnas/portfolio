import type { WorkExperience } from "~/types/experience";

export const experiences: WorkExperience[] = [
  {
    company: "Company A",
    currentPosition: "Senior Frontend Developer",
    period: "2022 - Present",
    location: "Remote",
    description: [
      "Led development of mission-critical web applications using Vue 3 and Nuxt 3",
      "Implemented robust state management solutions with Pinia",
      "Mentored junior developers and conducted code reviews",
    ],
    technologies: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS"],
    positions: [
      {
        title: "Lead Frontend Developer",
        duration: "Jan 2023 - Present",
      },
      {
        title: "Senior Frontend Developer",
        duration: "Jun 2022 - Dec 2022",
      },
    ],
  },
  {
    company: "Tech Innovators Inc",
    currentPosition: "Full Stack Developer",
    period: "2020 - 2022",
    location: "San Francisco, CA",
    description: [
      "Architected and developed scalable microservices using Node.js and Express",
      "Built responsive web applications with React and Redux",
      "Implemented CI/CD pipelines using GitHub Actions and Docker",
      "Reduced API response times by 40% through optimization and caching",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    positions: [
      {
        title: "Senior Full Stack Developer",
        duration: "Jan 2021 - Dec 2022",
      },
      {
        title: "Full Stack Developer",
        duration: "Mar 2020 - Dec 2020",
      },
    ],
  },
  {
    company: "Digital Solutions Lab",
    currentPosition: "Frontend Developer",
    period: "2018 - 2020",
    location: "Berlin, Germany",
    description: [
      "Developed and maintained multiple client-facing web applications",
      "Implemented responsive designs and ensured cross-browser compatibility",
      "Collaborated with UX designers to create intuitive user interfaces",
      "Reduced bundle size by 35% through code splitting and lazy loading",
    ],
    technologies: ["Angular", "SCSS", "JavaScript", "Jest", "Cypress"],
    positions: [
      {
        title: "Frontend Developer",
        duration: "Jun 2018 - Feb 2020",
      },
      {
        title: "Junior Frontend Developer",
        duration: "Jan 2018 - May 2018",
      },
    ],
  },
  {
    company: "StartupHub",
    currentPosition: "Software Engineer Intern",
    period: "2017",
    location: "Amsterdam, Netherlands",
    description: [
      "Assisted in developing features for a SaaS platform",
      "Wrote unit tests and integration tests using Jest",
      "Participated in daily stand-ups and sprint planning meetings",
      "Contributed to the company's internal component library",
    ],
    technologies: ["React", "TypeScript", "GraphQL", "Material-UI"],
  },
];
