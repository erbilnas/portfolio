import { useSettings } from "@/composables/settings";

export const useNavbarSettings = () => {
  const settingsDialogOpen = ref(false);
  const cursorDisabled = ref(false);
  const theme = ref<"light" | "dark" | "system">("dark");
  
  // Lazy load settings to avoid initialization order issues
  let settingsComposable: ReturnType<typeof useSettings> | null = null;
  let toggleCursor: (() => void) | null = null;
  let setTheme: ((theme: "light" | "dark" | "system") => void) | null = null;

  // Initialize settings after mount to avoid initialization order issues
  const initializeSettings = () => {
    if (!settingsComposable && process.client) {
      try {
        settingsComposable = useSettings();
        const settings = settingsComposable;
        // Sync initial values
        cursorDisabled.value = settings.cursorDisabled.value;
        const initialTheme = settings.theme.value;
        theme.value =
          initialTheme === "light" ||
          initialTheme === "dark" ||
          initialTheme === "system"
            ? initialTheme
            : "system";
        toggleCursor = settings.toggleCursor;
        setTheme = settings.setTheme;

        // Watch for changes
        watch(
          settings.cursorDisabled,
          (newValue) => {
            cursorDisabled.value = newValue;
          },
          { immediate: true }
        );
        watch(
          settings.theme,
          (newValue) => {
            theme.value =
              newValue === "light" || newValue === "dark" || newValue === "system"
                ? newValue
                : "dark";
          },
          { immediate: true }
        );
      } catch (error) {
        console.warn("Settings not ready yet:", error);
      }
    }
    return settingsComposable;
  };

  const openSettingsDialog = () => {
    settingsDialogOpen.value = true;
  };

  const closeSettingsDialog = () => {
    settingsDialogOpen.value = false;
  };

  const setLightTheme = () => {
    if (setTheme) {
      setTheme("light");
    }
  };

  const setDarkTheme = () => {
    if (setTheme) {
      setTheme("dark");
    }
  };

  const setSystemTheme = () => {
    if (setTheme) {
      setTheme("system");
    }
  };

  const handleToggleCursor = () => {
    if (toggleCursor) {
      toggleCursor();
    }
  };

  return {
    settingsDialogOpen,
    cursorDisabled,
    theme,
    initializeSettings,
    openSettingsDialog,
    closeSettingsDialog,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    handleToggleCursor,
  };
};

