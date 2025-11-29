import { useColorMode } from "#imports";
import { useLocalStorage } from "@vueuse/core";

export const useSettings = () => {
  const colorMode = useColorMode();
  const cursorDisabled = useLocalStorage("settings-cursor-disabled", false);

  const toggleCursor = () => {
    cursorDisabled.value = !cursorDisabled.value;
  };

  const setTheme = (theme: "light" | "dark" | "system") => {
    colorMode.preference = theme;
  };

  return {
    cursorDisabled: computed(() => cursorDisabled.value),
    toggleCursor,
    theme: computed(() => colorMode.preference),
    setTheme,
  };
};

