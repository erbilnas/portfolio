const appConfig = {
  social_links: {
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
  flipping_words: process.env.FLIPPING_WORDS,
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
  public: {
    version: process.env.npm_package_version || "Unknown",
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
