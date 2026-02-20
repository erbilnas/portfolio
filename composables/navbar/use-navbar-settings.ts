import { useSettings } from "@/composables/settings";

export const useNavbarSettings = () => {
  const settingsDialogOpen = ref(false);
  const cursorDisabled = ref(false);
  const theme = ref<"light" | "dark" | "system">("system");
  const reducedMotion = ref(false);
  const fontSize = ref<"default" | "large" | "xlarge">("default");
  const fontFamily = ref<"sans" | "serif" | "mono">("sans");
  const disableCardHoverEffects = ref(false);
  const analyticsEnabled = ref(true);
  const highContrast = ref(false);
  const languageSwitchToastEnabled = ref(true);

  // Lazy load settings to avoid initialization order issues
  let settingsComposable: ReturnType<typeof useSettings> | null = null;
  let toggleCursor: (() => void) | null = null;
  let setTheme: ((theme: "light" | "dark" | "system") => void) | null = null;

  const syncSetting = <T>(
    settingsGetter: () => T,
    localRef: { value: T },
    validator?: (v: T) => boolean
  ) => {
    const val = settingsGetter();
    if (validator ? validator(val) : true) {
      localRef.value = val;
    }
  };

  // Initialize settings after mount to avoid initialization order issues
  const initializeSettings = () => {
    if (!settingsComposable && process.client) {
      try {
        settingsComposable = useSettings();
        const settings = settingsComposable;
        // Sync initial values
        cursorDisabled.value = settings.cursorDisabled.value;
        syncSetting(
          () => settings.theme.value,
          theme,
          (v) => v === "light" || v === "dark" || v === "system"
        );
        reducedMotion.value = settings.reducedMotion.value;
        fontSize.value = settings.fontSize.value;
        fontFamily.value = settings.fontFamily.value;
        disableCardHoverEffects.value = settings.disableCardHoverEffects.value;
        analyticsEnabled.value = settings.analyticsEnabled.value;
        highContrast.value = settings.highContrast.value;
        languageSwitchToastEnabled.value = settings.languageSwitchToastEnabled.value;

        toggleCursor = settings.toggleCursor;
        setTheme = settings.setTheme;

        // Watch for changes
        watch(
          settings.cursorDisabled,
          (newValue) => { cursorDisabled.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.theme,
          (newValue) => {
            theme.value =
              newValue === "light" || newValue === "dark" || newValue === "system"
                ? newValue
                : "system";
          },
          { immediate: true }
        );
        watch(
          settings.reducedMotion,
          (newValue) => { reducedMotion.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.fontSize,
          (newValue) => { fontSize.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.fontFamily,
          (newValue) => { fontFamily.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.disableCardHoverEffects,
          (newValue) => { disableCardHoverEffects.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.analyticsEnabled,
          (newValue) => { analyticsEnabled.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.highContrast,
          (newValue) => { highContrast.value = newValue; },
          { immediate: true }
        );
        watch(
          settings.languageSwitchToastEnabled,
          (newValue) => { languageSwitchToastEnabled.value = newValue; },
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

  const setLightTheme = () => setTheme?.("light");
  const setDarkTheme = () => setTheme?.("dark");
  const setSystemTheme = () => setTheme?.("system");

  const handleToggleCursor = () => toggleCursor?.();

  const handleToggleReducedMotion = () => settingsComposable?.toggleReducedMotion();
  const handleSetFontSize = (size: "default" | "large" | "xlarge") => settingsComposable?.setFontSize(size);
  const handleSetFontFamily = (family: "sans" | "serif" | "mono") => settingsComposable?.setFontFamily(family);
  const handleToggleCardHoverEffects = () => settingsComposable?.toggleCardHoverEffects();
  const handleToggleAnalytics = () => settingsComposable?.toggleAnalytics();
  const handleToggleHighContrast = () => settingsComposable?.toggleHighContrast();
  const handleToggleLanguageSwitchToast = () =>
    settingsComposable?.toggleLanguageSwitchToast();
  const handleResetToDefaults = () => settingsComposable?.resetToDefaults();

  return {
    settingsDialogOpen,
    cursorDisabled,
    theme,
    reducedMotion,
    fontSize,
    fontFamily,
    disableCardHoverEffects,
    analyticsEnabled,
    highContrast,
    languageSwitchToastEnabled,
    initializeSettings,
    openSettingsDialog,
    closeSettingsDialog,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    handleToggleCursor,
    handleToggleReducedMotion,
    handleSetFontSize,
    handleSetFontFamily,
    handleToggleCardHoverEffects,
    handleToggleAnalytics,
    handleToggleHighContrast,
    handleToggleLanguageSwitchToast,
    handleResetToDefaults,
  };
};

