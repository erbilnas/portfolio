const isPreview =
  process.env.VERCEL_ENV === "preview" || process.env.NUXT_PREVIEW === "true";

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
    trakt: process.env.TRAKT_PROFILE_URL,
  },
  maps: {
    placesBeen: process.env.PLACES_BEEN_URL,
    countriesVisited: process.env.COUNTRIES_VISITED_COUNT,
    citiesVisited: process.env.CITIES_VISITED_COUNT,
  },
  flippingWords: process.env.FLIPPING_WORDS,

  version: process.env.npm_package_version || "Unknown",
  resumePdfUrl: process.env.RESUME_PDF_URL,
};

const runtimeConfig = {
  public: {
    showErrorsInPreview: isPreview,
    siteUrl: process.env.NUXT_APP_URL || "https://erbilnas.com",
    siteDescription:
      process.env.NUXT_APP_DESCRIPTION ||
      "The digital showcase about me, a passionate software engineer with a love for video games, technology, and insightful writing.",
  },
  howlongtobeat: {
    api: process.env.HOWLONGTOBEAT_API_URL,
    statsApi:
      process.env.HOWLONGTOBEAT_STATS_API_URL ||
      (process.env.HOWLONGTOBEAT_API_URL
        ? process.env.HOWLONGTOBEAT_API_URL.replace("/games/list", "/stats")
        : "https://howlongtobeat.com/api/user/82755/stats"),
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
  trakt: {
    clientId: process.env.TRAKT_CLIENT_ID,
    clientSecret: process.env.TRAKT_CLIENT_SECRET,
    username: process.env.TRAKT_USERNAME,
  },
  github: {
    username: process.env.GITHUB_USERNAME,
    token: process.env.GITHUB_TOKEN,
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
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
  ],
  site: {
    url: process.env.NUXT_APP_URL || "https://erbilnas.com",
  },
  appConfig,
  runtimeConfig,
  app: {
    head: {
      title: process.env.NUXT_APP_TITLE,
      htmlAttrs: {
        lang: "en", // Will be updated dynamically by i18n plugin
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
        {
          property: "og:image",
          content:
            process.env.NUXT_APP_OG_IMAGE ||
            `${process.env.NUXT_APP_URL || "https://erbilnas.com"}/og-image.png`,
        },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        {
          property: "og:site_name",
          content: process.env.NUXT_APP_TITLE || "Erbil Nas",
        },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: process.env.NUXT_APP_TITLE || "Erbil Nas",
        },
        {
          name: "twitter:description",
          content:
            process.env.NUXT_APP_DESCRIPTION ||
            "The digital showcase about me, a passionate software engineer with a love for video games, technology, and insightful writing.",
        },
        {
          name: "twitter:image",
          content:
            process.env.NUXT_APP_OG_IMAGE ||
            `${process.env.NUXT_APP_URL || "https://erbilnas.com"}/og-image.png`,
        },
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
  // Logging: Verbose in preview/development, silent in production
  logLevel: isPreview || process.env.NODE_ENV !== "production" ? "verbose" : "silent",
  // Enable sourcemaps in preview/development for readable stack traces
  sourcemap: {
    server: isPreview || process.env.NODE_ENV !== "production",
    client: isPreview || process.env.NODE_ENV !== "production",
  },
  nitro: {
    logLevel: isPreview || process.env.NODE_ENV !== "production" ? "verbose" : "silent",
    sourceMap: isPreview || process.env.NODE_ENV !== "production",
    // Log errors with full details
    experimental: {
      wasm: true,
    },
  },
  // Enable Vue error handling
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("nuxt"),
    },
  },
  // Better error pages
  experimental: {
    watcher: "chokidar",
  },
  compatibilityDate: "2025-01-02",
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "system",
  },
  i18n: {
    locales: [
      { code: "en", iso: "en-US", name: "English", file: "en.json" },
      { code: "tr", iso: "tr-TR", name: "Türkçe", file: "tr.json" },
    ],
    langDir: "./locales",
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false,
    },
  },
  vite: {
    build: {
      sourcemap: isPreview || process.env.NODE_ENV !== "production",
      minify: "esbuild",
      rollupOptions: {
        output: {
          sourcemapExcludeSources: false,
          sourcemapPathTransform: (relativeSourcePath) => {
            return relativeSourcePath;
          },
        },
      },
      chunkSizeWarningLimit: 600, // Increase limit slightly to reduce warnings for acceptable chunks
    },
    logLevel: isPreview || process.env.NODE_ENV !== "production" ? "info" : "silent",
  },
  // Apply manualChunks ONLY to client build to prevent "Cannot access before initialization" errors.
  // When manualChunks is in vite.build.rollupOptions, it affects both client and server builds,
  // causing circular dependency/initialization order issues. See: nuxt/nuxt#22127, #21354
  hooks: {
    "vite:extendConfig"(config, { isClient }) {
      if (isClient && config.build?.rollupOptions?.output) {
        const output = config.build.rollupOptions.output;
        const outputConfig = Array.isArray(output) ? output[0] : output;
        if (outputConfig) {
          outputConfig.manualChunks = (id: string) => {
            // Only process node_modules dependencies
            if (!id.includes("node_modules")) {
              return;
            }

            // CRITICAL: Never split Nuxt core components - they must load synchronously
            if (
              id.includes(".nuxt") ||
              id.includes("nuxt/dist") ||
              id.includes("#app") ||
              id.includes("#components")
            ) {
              return;
            }

            // CRITICAL: Never split motion-v and its dependencies - they must load synchronously
            // motion-v has internal circular dependencies that break when split into async chunks
            if (
              id.includes("motion-v") ||
              id.includes("motion-dom") ||
              id.includes("framer-motion")
            ) {
              return;
            }

            // CRITICAL: Never split Vue core (@vue/shared, @vue/reactivity, @vue/runtime-core)
            // defineComponent uses isFunction from @vue/shared - splitting causes
            // "Cannot access 'te' before initialization" (te = isFunction minified)
            if (id.includes("@vue/")) {
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

            // Nuxt modules (framework-specific) - but exclude core Nuxt runtime
            if (
              id.includes("@nuxt/") ||
              (id.includes("@nuxtjs/") && !id.includes(".nuxt"))
            ) {
              return "vendor-nuxt";
            }

            // Vue core and related
            if (id.includes("vue") && !id.includes("node_modules/vue/")) {
              return "vendor-vue";
            }

            // Default vendor chunk for other node_modules
            return "vendor";
          };
        }
      }
    },
  },
});
