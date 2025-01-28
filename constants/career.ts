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
    company: "Trendyol Group",
    currentPosition: "Senior Software Engineer",
    period: "July 2021 - Present",
    location: "Remote",
    description: [
      "As a Senior Software Engineer at Trendyol, I lead the design and development of scalable software solutions, mentor junior engineers, and drive technical initiatives to improve platform performance, reliability, and security. I collaborate with cross-functional teams to ensure high-quality code and contribute to shaping the company’s technology strategy.",
      "As a Software Engineer at Trendyol, I design and maintain scalable software solutions, collaborate with cross-functional teams, and ensure platform performance, reliability, and security, contributing to the company’s mission of enabling commerce through technology.",
      "As an Associate Software Engineer at Trendyol, I contributed to designing and developing software solutions, collaborated with teams to ensure code quality, and supported system performance and reliability.",
    ],
    technologies: [
      "Vue",
      "React",
      "React Native",
      "Astro",
      "TypeScript",
      "SCSS",
      "BEM Methodology",
      "Design System",
      "Web Components",
      "Lit",
      "Golang",
      "Kotlin",
      "Couchbase",
      "PostgreSQL",
      "Redis",
      "Kafka",
      "Microservice Architecture",
      "Microfrontend Architecture",
      "Docker",
      "Kubernetes",
      "Nginx",
      "Gitlab",
      "CI/CD",
      "Cypress",
      "Playwright",
      "Jest",
      "Vitest",
    ],
    positions: [
      {
        title: "Senior Software Engineer",
        duration: "Nov 2024 - Present",
      },
      {
        title: "Software Engineer",
        duration: "Jul 2022 - Nov 2024",
      },
      {
        title: "Associate Software Engineer",
        duration: "Jul 2021 - Jul 2022",
      },
    ],
  },
  {
    company: "Mindbehind (acquired by Insider)",
    currentPosition: "Software Engineer",
    period: "October 2019 - July 2021",
    location: "Hybrid",
    description: [
      "Led the frontend development for the renewal of the company’s flagship product. Implemented modern web development practices using React Hooks, Redux, and Router. Delivered cross-platform mobile applications for iOS and Android using WebView.",
    ],
    technologies: [
      "React",
      "React Native",
      "Java",
      "AI Chatbot",
      "Amazon Web Services",
      "Spring Boot",
      "Software as a Service",
    ],
  },
  {
    company: "Yuxek Internet Technologies",
    currentPosition: "Web Application Developer",
    period: "June 2019 - August 2019",
    location: "On-site",
    description: [
      "Part-time internship as a web application developer at Yuxek Internet Technologies, where I gained experience in developing web applications using Vue.js.",
    ],
    technologies: ["Vue", "ASP.NET Core"],
  },
  {
    company: "Freelance",
    currentPosition: "Frontend Developer & UI/UX Designer",
    period: "December 2017 - October 2018",
    location: "Remote",
    description: [
      "Developed responsive and user-focused web applications for various clients. Designed intuitive UI/UX interfaces to improve user engagement.",
    ],
    technologies: [
      "JavaScript",
      "HTML",
      "CSS",
      "UI/UX Design",
      "jQuery",
      "Bootstrap",
      "Wordpress",
      "PHP",
      "User Experience Design (UED)",
      "AJAX",
      "MySQL",
    ],
  },
  {
    company: "Mikrodev Information Technology & Electronics",
    currentPosition: "Intern",
    period: "August 2018 - September 2018",
    location: "On-site",
    description: [
      "Part-time internship as a software developer at Mikrodev Information Technology & Electronics, where I gained experience in developing hardware and software solutions.",
    ],
    technologies: ["Assembly", "C", "C++", "Computer Architecture"],
  },
  {
    company: "Otokar Automotive and Defense Industry",
    currentPosition: "Intern",
    period: "July 2017 - August 2017",
    location: "On-site",
    description: [
      "Part-time internship as a software developer at Otokar Automotive and Defense Industry, where I gained experience in developing hardware and software solutions.",
    ],
    technologies: ["C#", ".NET", "SQL", "MVC", "Entity Framework"],
  },
];

export const educationList: Education[] = [
  {
    school: "Mugla Sitki Kocman University",
    degree: "Master's Degree",
    year: "2021 - Present",
    description: "Digital Game Design and Technologies",
    achievements: [
      "Game Design",
      "Game Development",
      "Game Programming",
      "Game Testing",
      "Game Management",
      "Game Marketing",
      "Game Distribution",
      "Game Analytics",
      "Game Optimization",
      "Game Localization",
      "Game Modding",
    ],
  },
  {
    school: "Anadolu University",
    degree: "Bachelor's Degree",
    year: "2019 - Present",
    description: "Management Information Systems and Services",
    achievements: [
      "Software Development",
      "Project Management",
      "Business Intelligence",
      "Financial Management",
      "Financial Accounting",
      "Management Accounting",
      "Business Law",
      "Business Ethics",
      "Business Communication",
      "Business English",
    ],
  },
  {
    school: "Sakarya University",
    degree: "Bachelor's Degree",
    year: "2015 - 2019",
    description: "Computer Science and Engineering",
    achievements: [
      "Computer Networks",
      "Software Engineering",
      "Database Management",
      "Artificial Intelligence",
      "Computer Graphics",
      "Computer Vision",
      "Machine Learning",
      "Data Structures",
      "Algorithms",
      "Operating Systems",
      "Computer Architecture",
      "Software Testing",
      "Software Quality Assurance",
      "Software Project Management",
      "Software Engineering Ethics",
      "Software Engineering Practices",
      "Software Engineering Principles",
      "Human Computer Interaction",
      "Hardware Architecture",
      "Computer Networks",
      "Computer Security",
      "Computer Forensics",
      "Computer Ethics",
    ],
  },
  {
    school: "Florya Tevfik Ercan Anatolian High School",
    degree: "High School",
    year: "2011 - 2015",
    description: "Mathematics & Science",
    achievements: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "English",
      "Turkish",
      "History",
      "Geography",
      "Civics",
      "Economics",
      "Computer Science",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Favorites",
    icon: "lucide:star",
    skills: [
      {
        name: "Vue",
        description: "JavaScript Framework",
        icon: "simple-icons:vuedotjs",
      },
      {
        name: "Nuxt",
        description: "Full Stack Vue Framework",
        icon: "simple-icons:nuxt",
      },
      {
        name: "TypeScript",
        description: "JavaScript Superset",
        icon: "simple-icons:typescript",
      },
      {
        name: "Vite",
        description: "Build Tool",
        icon: "simple-icons:vite",
      },
      {
        name: "Bun",
        description: "JavaScript Runtime",
        icon: "simple-icons:bun",
      },
      {
        name: "Lit",
        description: "Web Components",
        icon: "simple-icons:lit",
      },
      {
        name: "BEM",
        description: "CSS Methodology",
        icon: "simple-icons:bem",
      },
      {
        name: "Hono",
        description: "Minimalist Web Framework",
        icon: "simple-icons:hono",
      },
      {
        name: "Supabase",
        description: "Database",
        icon: "simple-icons:supabase",
      },
      {
        name: "Drizzle",
        description: "Database ORM",
        icon: "simple-icons:drizzle",
      },
      {
        name: "Cloudflare",
        description: "Web Services",
        icon: "simple-icons:cloudflare",
      },
      {
        name: "Vercel",
        description: "Web Services",
        icon: "simple-icons:vercel",
      },
      {
        name: "Vitest",
        description: "Unit Testing Framework",
        icon: "simple-icons:vitest",
      },
      {
        name: "Cypress",
        description: "End-to-End Testing Framework",
        icon: "simple-icons:cypress",
      },
    ],
  },
  {
    name: "Frontend Development",
    icon: "lucide:panel-top",
    skills: [
      {
        name: "Vue",
        description: "JavaScript Framework",
        icon: "simple-icons:vuedotjs",
      },
      {
        name: "Nuxt",
        description: "Full Stack Vue Framework",
        icon: "simple-icons:nuxt",
      },
      {
        name: "React",
        description: "JavaScript Framework",
        icon: "simple-icons:react",
      },
      {
        name: "Next",
        description: "Full Stack React Framework",
        icon: "simple-icons:nextdotjs",
      },
      {
        name: "TypeScript",
        description: "JavaScript Superset",
        icon: "simple-icons:typescript",
      },
      {
        name: "Tailwind",
        description: "CSS Framework",
        icon: "simple-icons:tailwindcss",
      },
      {
        name: "Styled Components",
        description: "CSS-in-JS Library",
        icon: "simple-icons:styledcomponents",
      },
      {
        name: "BEM",
        description: "CSS Methodology",
        icon: "simple-icons:bem",
      },
      {
        name: "SASS",
        description: "CSS Preprocessor",
        icon: "simple-icons:sass",
      },
      {
        name: "Bun",
        description: "JavaScript Runtime",
        icon: "simple-icons:bun",
      },
      {
        name: "pnpm",
        description: "Package Manager",
        icon: "simple-icons:pnpm",
      },
      {
        name: "Lit",
        description: "Web Components",
        icon: "simple-icons:lit",
      },
      {
        name: "Vitest",
        description: "Unit Testing Framework",
        icon: "simple-icons:vitest",
      },
      {
        name: "Jest",
        description: "Unit Testing Framework",
        icon: "simple-icons:jest",
      },
      {
        name: "Cypress",
        description: "End-to-End Testing Framework",
        icon: "simple-icons:cypress",
      },
      {
        name: "Playwright",
        description: "End-to-End Testing Framework",
        icon: "simple-icons:playwright",
      },
    ],
  },
  {
    name: "Backend Development",
    icon: "mdi:server",
    skills: [
      {
        name: "Hono",
        description: "Minimalist Web Framework",
        icon: "simple-icons:hono",
      },
      {
        name: "Node.js",
        description: "JavaScript Runtime",
        icon: "simple-icons:nodedotjs",
      },
      {
        name: "Express",
        description: "JavaScript Framework",
        icon: "simple-icons:express",
      },
      {
        name: "MongoDB",
        description: "Database",
        icon: "simple-icons:mongodb",
      },
      {
        name: "PostgreSQL",
        description: "Database",
        icon: "simple-icons:postgresql",
      },
      {
        name: "MySQL",
        description: "Database",
        icon: "simple-icons:mysql",
      },
      {
        name: "Drizzle",
        description: "Database ORM",
        icon: "simple-icons:drizzle",
      },
    ],
  },
  {
    name: "DevOps",
    icon: "mdi:cloud",
    skills: [
      {
        name: "Docker",
        description: "Containerization",
        icon: "simple-icons:docker",
      },
      {
        name: "Nginx",
        description: "Web Server",
        icon: "simple-icons:nginx",
      },
      {
        name: "Vercel",
        description: "Web Services",
        icon: "simple-icons:vercel",
      },
      {
        name: "Cloudflare",
        description: "Web Services",
        icon: "simple-icons:cloudflare",
      },
      {
        name: "Linux",
        description: "Operating System",
        icon: "simple-icons:linux",
      },
      {
        name: "Git",
        description: "Version Control System",
        icon: "simple-icons:git",
      },
      {
        name: "GitHub",
        description: "Version Control System",
        icon: "simple-icons:github",
      },
      {
        name: "GitHub Actions",
        description: "CI/CD",
        icon: "simple-icons:githubactions",
      },
      {
        name: "GitLab",
        description: "Version Control System",
        icon: "simple-icons:gitlab",
      },
    ],
  },
  {
    name: "AI",
    icon: "lucide:brain",
    skills: [
      {
        name: "ChatGPT",
        description: "Chatbot",
        icon: "simple-icons:openai",
      },
      {
        name: "Claude",
        description: "Chatbot",
        icon: "simple-icons:claude",
      },
      {
        name: "Cursor",
        description: "Code Editor",
        icon: "lucide:brain",
      },
      {
        name: "v0",
        description: "Code Editor",
        icon: "simple-icons:v0",
      },
      {
        name: "GitHub Copilot",
        description: "Code Assistant",
        icon: "simple-icons:github",
      },
    ],
  },
  {
    name: "Design",
    icon: "lucide:palette",
    skills: [
      {
        name: "Figma",
        description: "UI Design Tool",
        icon: "simple-icons:figma",
      },
      {
        name: "Adobe XD",
        description: "UI Design Tool",
        icon: "simple-icons:adobexd",
      },
      {
        name: "Canva",
        description: "UI Design Tool",
        icon: "simple-icons:canva",
      },
    ],
  },
  {
    name: "Languages",
    icon: "lucide:earth",
    skills: [
      {
        name: "Turkish",
        description: "Native",
        icon: "circle-flags:tr",
      },
      {
        name: "English",
        description: "Upper Intermediate",
        icon: "circle-flags:us",
      },
      {
        name: "German",
        description: "Elementary",
        icon: "circle-flags:de",
      },
    ],
  },
];

export const projectsList: Project[] = [
  {
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
    status: "Active",
    github: "https://github.com/Trendyol/baklava",
  },
  {
    name: "Spaceflash",
    description:
      "Spaceflash is a wave-based shooter playable with a VR headset (Oculus, HTC, etc.) where you destroy endless enemies coming to defend your moon base.",
    tech: ["Unity", "C#", "Game Development"],
    features: ["Wave-based Shooter", "VR", "Game Development"],
    status: "Completed",
    github: "https://github.com/erbilnas/spaceflash",
  },
  {
    name: "Perfanalytics",
    description:
      "A client-side library which collects some performance related key metrics from browser and sends to the API.",
    tech: ["JavaScript", "Performance Monitoring"],
    features: ["Performance Monitoring", "JavaScript"],
    status: "Archived",
    github: "https://github.com/erbilnas/perfanalytics-js",
  },
  {
    name: "Crossing of the Rhine: A.D. 406",
    description:
      "Crossing of the Rhine: A.D. 406 is a turn-based/RPG game based on a historical event and developed with Python.",
    tech: ["Python", "Unity", "Game Development"],
    features: ["Turn-based/RPG", "Historical Event", "Game Development"],
    status: "Completed",
    github: "https://github.com/team-horse-oclock/AD406",
  },
];
