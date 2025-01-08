interface TechStack {
  name: string;
  url: string;
  icon: string;
}

interface Provider {
  name: string;
  description: string;
}

export const observerOptions: IntersectionObserverInit = {
  root: null,
  threshold: 0.1,
};

export const techStack: TechStack[] = [
  { name: "Nuxt", url: "https://nuxt.com", icon: "simple-icons:nuxtdotjs" },
  { name: "Vue", url: "https://vuejs.org", icon: "simple-icons:vuedotjs" },
  {
    name: "TypeScript",
    url: "https://typescript.com",
    icon: "simple-icons:typescript",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com",
    icon: "simple-icons:tailwindcss",
  },
  {
    name: "shadcn-vue",
    url: "https://www.shadcn-vue.com/",
    icon: "simple-icons:shadcnui",
  },
  {
    name: "Vercel",
    url: "https://vercel.com",
    icon: "simple-icons:vercel",
  },
];

export const providers: Provider[] = [
  {
    name: "HowLongToBeat",
    description:
      'Provides information to my "Currently Playing" and "Recently Completed" cards.',
  },
  {
    name: "Spotify",
    description: 'Provides information to my "Listening Now" card.',
  },
  {
    name: "RSS2JSON",
    description: 'Provides information to my "Recent Blog Post" card.',
  },
];
