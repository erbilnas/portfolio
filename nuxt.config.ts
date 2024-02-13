// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-primevue",
    "@pinia/nuxt",
    "@nuxt/content",
    "dayjs-nuxt",
    "@nuxt/image"
  ],
  css: [
    "primevue/resources/themes/aura-dark-noir/theme.css",
    "primeicons/primeicons.css",
  ],
  primevue: {
    options: {
      ripple: true,
    },
  },
  appConfig: {},
  runtimeConfig: {
    hltbApi: process.env.HLTB_API,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    public: {
      twitterProfileUrl: process.env.TWITTER_PROFILE_URL,
      instagramProfileUrl: process.env.INSTAGRAM_PROFILE_URL,
      luvProfileUrl: process.env.LUV_PROFILE_URL,
      linkedinProfileUrl: process.env.LINKEDIN_PROFILE_URL,
      placesBeenMapUrl: process.env.PLACES_BEEN_MAP_URL,
      githubProfileUrl: process.env.GITHUB_PROFILE_URL,
      hltbProfileUrl: process.env.HLTB_PROFILE_URL,
      birthday: process.env.BIRTHDAY,
      firstExperienceDate: process.env.FIRST_EXPERIENCE_DATE,
      profilePicture: process.env.PROFILE_PICTURE_URL,
      mediumProfileUrl: process.env.MEDIUM_PROFILE_URL,
      mediumRssFeed: process.env.MEDIUM_RSS_FEED,
      spotifyProfileUrl: process.env.SPOTIFY_PROFILE_URL,
      trendyolProfileUrl: process.env.LINKEDIN_TRENDYOL_COMPANY_URL,
    },
  },
  app: {
    head: {
      title: "Welcome | It's me, Erbil!",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
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
            "I'm Erbil Nas, a software engineer who loves to create things and share knowledge.",
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