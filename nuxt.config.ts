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
  compatibilityDate: "2025-01-02",
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  colorMode: {
    classSuffix: "",
    preference: "dark",
  },
});
