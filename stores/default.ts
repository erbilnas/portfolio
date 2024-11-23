import { defineStore } from "pinia";

const darkTheme = process.env.NUXT_APP_DARK_THEME || "";

interface HLTBState {
  title?: string;
  image?: string;
  platform?: string;
  storefront?: string;
  progress?: string;
  description?: string;
  status?: string;
  error?: boolean;
}

export const useDefaultStore = defineStore({
  id: "defaultStore",
  state: () => ({
    sidebarVisible: false,
    changelogVisible: false,
    age: 0,
    theme: darkTheme,
    currentlyPlaying: "",
    hltb: {
      error: false,
    } as HLTBState,
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
