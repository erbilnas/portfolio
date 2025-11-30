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
    company: "Trendyol Go by Uber Eats",
    currentPosition: "Senior Software Engineer",
    period: "July 2025 - Present",
    location: "Remote",
    description: [
      "As a Senior Software Engineer at Trendyol Go By Uber Eats, I lead the design and development of scalable software solutions, mentor junior engineers, and drive technical initiatives to improve platform performance, reliability, and security. I collaborate with cross-functional teams to ensure high-quality code and contribute to shaping the company’s technology strategy.",
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
  },
  {
    company: "Trendyol",
    currentPosition: "Senior Software Engineer",
    period: "July 2021 - July 2025",
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
        duration: "Nov 2024 - Jul 2025",
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
        description:
          "Progressive JavaScript framework for building user interfaces with reactive data binding and component-based architecture",
        icon: "simple-icons:vuedotjs",
      },
      {
        name: "Nuxt",
        description:
          "Full-stack Vue framework providing SSR, SSG, and powerful features like auto-imports, file-based routing, and server API routes",
        icon: "simple-icons:nuxt",
      },
      {
        name: "TypeScript",
        description:
          "Strongly typed programming language that builds on JavaScript, adding static type definitions for better code quality and developer experience",
        icon: "simple-icons:typescript",
      },
      {
        name: "Vite",
        description:
          "Next-generation frontend build tool that provides lightning-fast HMR and optimized production builds using native ES modules",
        icon: "simple-icons:vite",
      },
      {
        name: "Bun",
        description:
          "Ultra-fast JavaScript runtime, bundler, and package manager all-in-one, built with Zig and designed for modern JavaScript development",
        icon: "simple-icons:bun",
      },
      {
        name: "Lit",
        description:
          "Lightweight library for building fast, reusable web components using Web Components standards with a simple, expressive API",
        icon: "simple-icons:lit",
      },
      {
        name: "BEM",
        description:
          "CSS methodology that provides a naming convention for classes, making styles more maintainable and scalable in large projects",
        icon: "simple-icons:bem",
      },
      {
        name: "Hono",
        description:
          "Ultrafast web framework for the Edge, providing a minimal API with excellent performance and TypeScript support out of the box",
        icon: "simple-icons:hono",
      },
      {
        name: "Supabase",
        description:
          "Open-source Firebase alternative providing PostgreSQL database, authentication, real-time subscriptions, and storage with a great developer experience",
        icon: "simple-icons:supabase",
      },
      {
        name: "Drizzle",
        description:
          "Lightweight TypeScript ORM with a focus on performance and type safety, providing a SQL-like query builder and migrations",
        icon: "simple-icons:drizzle",
      },
      {
        name: "Cloudflare",
        description:
          "Global cloud platform offering CDN, DDoS protection, DNS, security services, and edge computing with Workers for serverless functions",
        icon: "simple-icons:cloudflare",
      },
      {
        name: "Vercel",
        description:
          "Platform for frontend frameworks providing zero-config deployments, edge functions, and automatic HTTPS with global CDN",
        icon: "simple-icons:vercel",
      },
      {
        name: "Vitest",
        description:
          "Blazing fast unit test framework powered by Vite, featuring native ESM support, HMR, and Jest-compatible API",
        icon: "simple-icons:vitest",
      },
      {
        name: "Cypress",
        description:
          "End-to-end testing framework that runs in the browser, providing real-time reloading, time-travel debugging, and automatic waiting",
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
        description:
          "Progressive JavaScript framework for building user interfaces with reactive data binding and component-based architecture",
        icon: "simple-icons:vuedotjs",
      },
      {
        name: "Nuxt",
        description:
          "Full-stack Vue framework providing SSR, SSG, and powerful features like auto-imports, file-based routing, and server API routes",
        icon: "simple-icons:nuxt",
      },
      {
        name: "React",
        description:
          "Popular JavaScript library for building user interfaces using a component-based architecture with virtual DOM for efficient rendering",
        icon: "simple-icons:react",
      },
      {
        name: "Next",
        description:
          "Production-ready React framework with server-side rendering, static site generation, API routes, and optimized performance",
        icon: "simple-icons:nextdotjs",
      },
      {
        name: "TypeScript",
        description:
          "Strongly typed programming language that builds on JavaScript, adding static type definitions for better code quality and developer experience",
        icon: "simple-icons:typescript",
      },
      {
        name: "Tailwind",
        description:
          "Utility-first CSS framework that enables rapid UI development with low-level utility classes and customizable design system",
        icon: "simple-icons:tailwindcss",
      },
      {
        name: "Styled Components",
        description:
          "CSS-in-JS library for React that enables component-scoped styling with JavaScript template literals and dynamic styling",
        icon: "simple-icons:styledcomponents",
      },
      {
        name: "BEM",
        description:
          "CSS methodology that provides a naming convention for classes, making styles more maintainable and scalable in large projects",
        icon: "simple-icons:bem",
      },
      {
        name: "SASS",
        description:
          "CSS preprocessor that extends CSS with variables, nesting, mixins, and functions for more maintainable and powerful stylesheets",
        icon: "simple-icons:sass",
      },
      {
        name: "Bun",
        description:
          "Ultra-fast JavaScript runtime, bundler, and package manager all-in-one, built with Zig and designed for modern JavaScript development",
        icon: "simple-icons:bun",
      },
      {
        name: "pnpm",
        description:
          "Fast, disk space efficient package manager that uses hard links and symlinks to save disk space and improve installation speed",
        icon: "simple-icons:pnpm",
      },
      {
        name: "Lit",
        description:
          "Lightweight library for building fast, reusable web components using Web Components standards with a simple, expressive API",
        icon: "simple-icons:lit",
      },
      {
        name: "Vitest",
        description:
          "Blazing fast unit test framework powered by Vite, featuring native ESM support, HMR, and Jest-compatible API",
        icon: "simple-icons:vitest",
      },
      {
        name: "Jest",
        description:
          "Delightful JavaScript testing framework with a focus on simplicity, featuring snapshot testing and built-in code coverage",
        icon: "simple-icons:jest",
      },
      {
        name: "Cypress",
        description:
          "End-to-end testing framework that runs in the browser, providing real-time reloading, time-travel debugging, and automatic waiting",
        icon: "simple-icons:cypress",
      },
      {
        name: "Playwright",
        description:
          "Reliable end-to-end testing framework for modern web apps, supporting multiple browsers and providing powerful automation capabilities",
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
        description:
          "Ultrafast web framework for the Edge, providing a minimal API with excellent performance and TypeScript support out of the box",
        icon: "simple-icons:hono",
      },
      {
        name: "Node.js",
        description:
          "JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript development with non-blocking I/O and event-driven architecture",
        icon: "simple-icons:nodedotjs",
      },
      {
        name: "Express",
        description:
          "Minimal and flexible Node.js web application framework providing robust features for building APIs and web applications",
        icon: "simple-icons:express",
      },
      {
        name: "MongoDB",
        description:
          "NoSQL document database that stores data in flexible JSON-like documents, ideal for scalable applications with dynamic schemas",
        icon: "simple-icons:mongodb",
      },
      {
        name: "PostgreSQL",
        description:
          "Advanced open-source relational database with ACID compliance, extensibility, and support for complex queries and JSON data",
        icon: "simple-icons:postgresql",
      },
      {
        name: "MySQL",
        description:
          "Popular open-source relational database management system known for reliability, performance, and ease of use in web applications",
        icon: "simple-icons:mysql",
      },
      {
        name: "Drizzle",
        description:
          "Lightweight TypeScript ORM with a focus on performance and type safety, providing a SQL-like query builder and migrations",
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
        description:
          "Platform for containerization that packages applications and dependencies into lightweight containers for consistent deployment across environments",
        icon: "simple-icons:docker",
      },
      {
        name: "Nginx",
        description:
          "High-performance web server and reverse proxy server known for its stability, rich feature set, and low resource consumption",
        icon: "simple-icons:nginx",
      },
      {
        name: "Vercel",
        description:
          "Platform for frontend frameworks providing zero-config deployments, edge functions, and automatic HTTPS with global CDN",
        icon: "simple-icons:vercel",
      },
      {
        name: "Cloudflare",
        description:
          "Global cloud platform offering CDN, DDoS protection, DNS, security services, and edge computing with Workers for serverless functions",
        icon: "simple-icons:cloudflare",
      },
      {
        name: "Linux",
        description:
          "Open-source Unix-like operating system kernel powering servers, embedded systems, and cloud infrastructure worldwide",
        icon: "simple-icons:linux",
      },
      {
        name: "Git",
        description:
          "Distributed version control system for tracking changes in source code, enabling collaboration and maintaining project history",
        icon: "simple-icons:git",
      },
      {
        name: "GitHub",
        description:
          "Web-based platform for version control and collaboration using Git, providing code hosting, issue tracking, and project management",
        icon: "simple-icons:github",
      },
      {
        name: "GitHub Actions",
        description:
          "CI/CD platform integrated with GitHub, enabling automated workflows for building, testing, and deploying code directly from repositories",
        icon: "simple-icons:githubactions",
      },
      {
        name: "GitLab",
        description:
          "Complete DevOps platform providing Git repository management, CI/CD pipelines, issue tracking, and integrated project management tools",
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
        description:
          "Advanced AI language model by OpenAI for natural language understanding, code generation, and intelligent conversation assistance",
        icon: "simple-icons:openai",
      },
      {
        name: "Claude",
        description:
          "AI assistant by Anthropic designed for helpful, harmless, and honest interactions with advanced reasoning and coding capabilities",
        icon: "simple-icons:claude",
      },
      {
        name: "Cursor",
        description:
          "AI-powered code editor that understands context and provides intelligent code completion, refactoring, and documentation generation",
        icon: "lucide:brain",
      },
      {
        name: "v0",
        description:
          "AI-powered UI component generator by Vercel that creates React components from text descriptions using advanced language models",
        icon: "simple-icons:v0",
      },
      {
        name: "GitHub Copilot",
        description:
          "AI pair programmer that suggests code completions, functions, and entire code blocks based on context and comments",
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
        description:
          "Collaborative browser-based design tool for creating user interfaces, prototypes, and design systems with real-time collaboration",
        icon: "simple-icons:figma",
      },
      {
        name: "Adobe XD",
        description:
          "Vector-based design tool for creating user experiences, wireframes, and interactive prototypes with seamless design-to-code workflow",
        icon: "simple-icons:adobexd",
      },
      {
        name: "Canva",
        description:
          "Online graphic design platform with drag-and-drop interface for creating social media graphics, presentations, and marketing materials",
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
        description:
          "Native speaker with full professional proficiency in reading, writing, and speaking",
        icon: "circle-flags:tr",
      },
      {
        name: "English",
        description:
          "Upper intermediate level with strong technical communication skills for professional software development",
        icon: "circle-flags:us",
      },
      {
        name: "German",
        description:
          "Elementary level with basic conversational and reading comprehension skills",
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
