// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-primevue", "@pinia/nuxt", "@nuxt/content", "dayjs-nuxt"],
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
    public: {
      twitterProfileUrl: process.env.TWITTER_PROFILE_URL,
      instagramProfileUrl: process.env.INSTAGRAM_PROFILE_URL,
      linkedinProfileUrl: process.env.LINKEDIN_PROFILE_URL,
      placesBeenMapUrl: process.env.PLACES_BEEN_MAP_URL,
      githubProfileUrl: process.env.GITHUB_PROFILE_URL,
      hltbProfileUrl: process.env.HLTB_PROFILE_URL,
      birthday: process.env.BIRTHDAY,
      firstExperienceDate: process.env.FIRST_EXPERIENCE_DATE,
      profilePicture: process.env.PROFILE_PICTURE_URL,
      mediumProfileUrl: process.env.MEDIUM_PROFILE_URL,
      mediumRssFeed: process.env.MEDIUM_RSS_FEED,
    },
  },
  app: {
    head: {
      title: "It's me, Erbil",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },
});
