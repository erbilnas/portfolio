// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-primevue",
    "@pinia/nuxt",
    "@nuxt/content",
    "dayjs-nuxt",
    "@nuxt/image",
    "@nuxtjs/fontaine",
    "nuxt-delay-hydration",
  ],
  delayHydration: {
    mode: "mount",
  },
  css: [
    "primevue/resources/themes/aura-dark-noir/theme.css",
    "primeicons/primeicons.css",
  ],
  primevue: {
    options: {
      ripple: true,
    },
  },
  appConfig: {
    profiles: {
      linkedin: process.env.LINKEDIN_PROFILE,
      trendyol: process.env.LINKEDIN_TRENDYOL,
      spotify: process.env.SPOTIFY_PROFILE,
      github: process.env.GITHUB_PROFILE,
      hltb: process.env.HLTB_PROFILE,
      twitter: process.env.TWITTER_PROFILE,
      instagram: process.env.INSTAGRAM_PROFILE,
      luv: process.env.LUV_PROFILE,
    },
    maps: {
      placesBeen: process.env.PLACES_BEEN_URL,
    },
    profilePicture: process.env.PROFILE_PICTURE_URL,
  },
  runtimeConfig: {
    hltbApi: process.env.HLTB_API,
    spotify: {
      tokenApi: process.env.SPOTIFY_TOKEN_API,
      playerApi: process.env.SPOTIFY_PLAYER_API,
      refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
      clientToken: process.env.SPOTIFY_CLIENT_TOKEN,
    },
    stats: {
      birthday: process.env.MY_BIRTHDAY_DATE,
      firstWorkExperience: process.env.FIRST_WORK_EXPERIENCE_DATE,
    },
  },
  app: {
    head: {
      title: "Welcome | It's me, Erbil",
      charset: "utf-8",
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          name: "author",
          content: "Erbil Nas",
        },
        {
          name: "description",
          content:
            "I'm Erbil, a software engineer who loves to create things and share knowledge.",
        },
        {
          name: "keywords",
          content:
            "erbil, nas, software, engineer, developer, web, mobile, erbil nas, technology, website, personal, blog, portfolio, mentalmynx",
        },
        {
          name: "robots",
          content: "index, follow",
        },
        {
          name: "theme-color",
          content: "#000000",
        },
      ],
    },
  },
});
