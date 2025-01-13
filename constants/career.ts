import type {
  CareerTabs,
  Education,
  Project,
  SkillCategory,
  WorkExperience,
} from "~/types/career";

export const careerTabs: CareerTabs[] = [
  "Skills",
  "Experience",
  "Education",
  "Projects",
];

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

export const educationList: Education[] = [
  {
    school: "Manisa Celal Bayar University",
    degree: "Bachelor's in Software Engineering",
    year: "2016 - 2020",
    description:
      "Focused on software development fundamentals, algorithms, and modern web technologies.",
    achievements: [
      "3.21 GPA",
      "Full Stack Development",
      "Mobile Development",
      "Software Architecture",
    ],
  },
  {
    school: "Erasmus+ Exchange Program",
    degree: "Computer Science Exchange Student",
    year: "2019",
    description:
      "Participated in an international exchange program focusing on advanced software development practices.",
    achievements: [
      "International Experience",
      "Cross-cultural Collaboration",
      "Advanced Programming",
    ],
  },
  {
    school: "Udacity",
    degree: "React Nanodegree Program",
    year: "2020",
    description:
      "Intensive program focused on modern React development, including Redux, React Native, and advanced state management patterns.",
    achievements: [
      "React Ecosystem",
      "State Management",
      "Mobile Development",
      "Modern JavaScript",
    ],
  },
  {
    school: "AWS Training and Certification",
    degree: "AWS Certified Developer - Associate",
    year: "2021",
    description:
      "Comprehensive cloud computing certification covering AWS services, serverless architecture, and cloud-native development.",
    achievements: [
      "Cloud Architecture",
      "Serverless Computing",
      "AWS Services",
      "DevOps Practices",
    ],
  },
  {
    school: "Google Cloud Training",
    degree: "Professional Cloud Developer",
    year: "2022",
    description:
      "Advanced certification in cloud-native development, focusing on scalable and reliable applications on Google Cloud Platform.",
    achievements: [
      "Cloud Native Development",
      "Microservices",
      "Container Orchestration",
      "CI/CD Pipelines",
    ],
  },
];

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
