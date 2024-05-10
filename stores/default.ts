import { defineStore } from "pinia";

const darkTheme = process.env.NUXT_APP_DARK_THEME || "";

export const useDefaultStore = defineStore({
  id: "defaultStore",
  state: () => ({
    sidebarVisible: false,
    changelogVisible: false,
    age: 0,
    theme: darkTheme,
    currentlyPlaying: "",
    hltb: {
      title: "",
      platform: "",
      image: "",
      progress: 0,
      status: "",
      storefront: "",
      description: "",
    },
    recentPosts: {
      title: "",
      link: "",
      feed: "",
      status: "",
      publishedDate: "",
      description: "",
    },
  }),
  actions: {},
});
