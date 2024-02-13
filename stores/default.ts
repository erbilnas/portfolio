import { defineStore } from "pinia";

export const useDefaultStore = defineStore({
  id: "defaultStore",
  state: () => ({
    sidebarVisible: false,
    changelogVisible: false,
  }),
  actions: {},
});
