import type { SkillCategory } from "~/types/skills";

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
      {
        name: "Go",
        description:
          "Statically typed, compiled programming language designed for simplicity, efficiency, and concurrency with excellent performance for backend services",
        icon: "simple-icons:go",
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
      {
        name: "Gemini",
        description:
          "Advanced AI model by Google with multimodal capabilities for understanding text, images, and code, providing intelligent assistance across various tasks",
        icon: "simple-icons:google",
      },
      {
        name: "Grok",
        description:
          "AI assistant by xAI designed for real-time information access, creative problem-solving, and engaging conversations with a unique personality",
        icon: "simple-icons:x",
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
