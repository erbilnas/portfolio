const appConfig = {
  socialLinks: {
    linkedin: process.env.LINKEDIN_PROFILE_URL,
    spotify: process.env.SPOTIFY_PROFILE_URL,
    github: process.env.GITHUB_PROFILE_URL,
    howlongtobeat: process.env.HLTB_PROFILE_URL,
    twitter: process.env.TWITTER_PROFILE_URL,
    instagram: process.env.INSTAGRAM_PROFILE_URL,
    goodreads: process.env.GOODREADS_PROFILE_URL,
    steam: process.env.STEAM_PROFILE_URL,
    twitch: process.env.TWITCH_PROFILE_URL,
    youtube: process.env.YOUTUBE_PROFILE_URL,
    medium: process.env.MEDIUM_PROFILE_URL,
  },
  maps: {
    placesBeen: process.env.PLACES_BEEN_URL,
    countriesVisited: process.env.COUNTRIES_VISITED_COUNT,
    citiesVisited: process.env.CITIES_VISITED_COUNT,
  },
  flippingWords: process.env.FLIPPING_WORDS,

  version: process.env.npm_package_version || "Unknown",
};

const runtimeConfig = {
  howlongtobeat: {
    api: process.env.HOWLONGTOBEAT_API_URL,
  },
  rss2json: {
    api: process.env.RSS2JSON_API_URL,
  },
  spotify: {
    token_api: process.env.SPOTIFY_TOKEN_API_URL,
    player_api: process.env.SPOTIFY_PLAYER_API_URL,
    refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    client_token: process.env.SPOTIFY_CLIENT_TOKEN,
  },
  lifetime_stats: {
    birthday: process.env.MY_BIRTHDAY_DATE,
    first_work_experience: process.env.FIRST_WORK_EXPERIENCE_DATE,
  },
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/image",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@vueuse/motion/nuxt",
    "@nuxt/icon",
  ],
  appConfig,
  runtimeConfig,
  app: {
    head: {
      title: process.env.NUXT_APP_TITLE,
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
        {
          name: "description",
          content:
            process.env.NUXT_APP_DESCRIPTION ||
            "The digital showcase about me, a passionate software engineer with a love for video games, technology, and insightful writing.",
        },
        {
          name: "keywords",
          content:
            "Erbil Nas, Software Engineer, Web Development, Full Stack Developer, Portfolio, Video Games, Technology, Writing, Frontend Developer, Digital Showcase, Personal Website",
        },
        { name: "author", content: "Erbil Nas" },
        {
          property: "og:title",
          content: process.env.NUXT_APP_TITLE || "Erbil Nas",
        },
        {
          property: "og:description",
          content:
            process.env.NUXT_APP_DESCRIPTION ||
            "The digital showcase about me, a passionate software engineer with a love for video games, technology, and insightful writing.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: process.env.NUXT_APP_URL },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "canonical", href: process.env.NUXT_APP_URL },
      ],
    },
  },
  devtools: {
    enabled: true,
  },
  logLevel: "verbose",
  sourcemap: {
    server: true,
    client: true,
  },
  nitro: {
    logLevel: "verbose",
    sourceMap: true,
  },
  compatibilityDate: "2025-01-02",
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
  },
  vite: {
    build: {
      sourcemap: true,
      minify: "esbuild",
      rollupOptions: {
        output: {
          sourcemapExcludeSources: false,
          sourcemapPathTransform: (relativeSourcePath) => {
            return relativeSourcePath;
          },
          manualChunks: (id) => {
            // Only process node_modules dependencies
            if (!id.includes("node_modules")) {
              return;
            }

            // Animation libraries (GSAP, VueUse Motion) - check first as they're heavy
            if (id.includes("gsap") || id.includes("@vueuse/motion")) {
              return "vendor-animations";
            }

            // Heavy 3D/visual libraries
            if (id.includes("cobe") || id.includes("canvas-confetti")) {
              return "vendor-visual";
            }

            // UI component libraries (Radix Vue, Shadcn)
            if (id.includes("radix-vue") || id.includes("shadcn-nuxt")) {
              return "vendor-ui";
            }

            // VueUse core utilities
            if (id.includes("@vueuse/core")) {
              return "vendor-vueuse";
            }

            // Icon libraries (can be large)
            if (id.includes("lucide-vue-next") || id.includes("@nuxt/icon")) {
              return "vendor-icons";
            }

            // Vercel analytics (lightweight, but separate for clarity)
            if (id.includes("@vercel")) {
              return "vendor-analytics";
            }

            // Nuxt modules (framework-specific)
            if (id.includes("@nuxt/") || id.includes("@nuxtjs/")) {
              return "vendor-nuxt";
            }

            // Vue core and related
            if (id.includes("vue") && !id.includes("node_modules/vue/")) {
              return "vendor-vue";
            }

            // Default vendor chunk for other node_modules
            return "vendor";
          },
        },
      },
      chunkSizeWarningLimit: 600, // Increase limit slightly to reduce warnings for acceptable chunks
    },
    logLevel: "info",
  },
});
