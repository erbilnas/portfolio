import { useColorMode } from "#imports";
import { ref, watch, computed } from "vue";
import type { Locale } from "~/types/i18n";

export type MarqueeSpeed = "slow" | "medium" | "fast";
export type FontSize = "default" | "large" | "xlarge";

const DEFAULT_THEME = "system" as const;
const DEFAULT_CURSOR_DISABLED = false;
const DEFAULT_LANGUAGE: Locale = "en";
const DEFAULT_MARQUEE_SPEED: MarqueeSpeed = "medium";
const DEFAULT_FONT_SIZE: FontSize = "default";
const DEFAULT_REDUCED_MOTION = false;
const DEFAULT_DISABLE_CARD_HOVER = false;
const DEFAULT_ANALYTICS_ENABLED = true;
const DEFAULT_HIGH_CONTRAST = false;

function getPrefersReducedMotion(): boolean {
  if (process.client && typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
}

// Helper to set cookie (works on client side)
function setCookie(key: string, value: string, maxAge: number = 31536000) {
  if (process.client && typeof document !== "undefined") {
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }
}

// Helper to get cookie (works on client side)
function getCookie(key: string): string | null {
  if (process.client && typeof document !== "undefined") {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [k, v] = cookie.trim().split("=");
      acc[k] = decodeURIComponent(v);
      return acc;
    }, {} as Record<string, string>);
    return cookies[key] || null;
  }
  return null;
}

// Simple localStorage implementation to avoid VueUse import on server
function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = ref<T>(defaultValue);

  // Only access localStorage on client side
  if (process.client && typeof window !== "undefined" && window.localStorage) {
    try {
      // Try to read from cookie first (for language preference)
      if (key === "settings-language") {
        const cookieValue = getCookie("i18n_redirected") || getCookie(key);
        if (cookieValue) {
          try {
            storedValue.value = JSON.parse(cookieValue) as T;
          } catch {
            storedValue.value = cookieValue as T;
          }
        } else {
          // Fallback to localStorage
          const item = window.localStorage.getItem(key);
          if (item !== null) {
            storedValue.value = JSON.parse(item);
          }
        }
      } else if (key === "settings-reduced-motion") {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          storedValue.value = JSON.parse(item) as T;
        } else {
          storedValue.value = getPrefersReducedMotion() as T;
        }
      } else {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          storedValue.value = JSON.parse(item);
        }
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }

    // Watch for changes and sync to localStorage and cookies
    watch(
      storedValue,
      (newValue) => {
        try {
          const stringValue = JSON.stringify(newValue);
          window.localStorage.setItem(key, stringValue);
          
          // Also sync language preference to cookie for SSR
          if (key === "settings-language") {
            setCookie("settings-language", stringValue);
            // Also set i18n cookie for @nuxtjs/i18n module
            if (typeof newValue === "string") {
              setCookie("i18n_redirected", newValue);
            }
          }
        } catch (error) {
          console.warn(`Error writing localStorage key "${key}":`, error);
        }
      },
      { deep: true }
    );
  }

  return storedValue;
}

// Singleton instance to ensure all components share the same state
let settingsInstance: ReturnType<typeof createSettings> | null = null;

function createSettings() {
  const colorMode = useColorMode();
  const cursorDisabled = useLocalStorage("settings-cursor-disabled", DEFAULT_CURSOR_DISABLED);
  const language = useLocalStorage<Locale>("settings-language", DEFAULT_LANGUAGE);
  const reducedMotion = useLocalStorage("settings-reduced-motion", DEFAULT_REDUCED_MOTION);
  const marqueeSpeed = useLocalStorage<MarqueeSpeed>("settings-marquee-speed", DEFAULT_MARQUEE_SPEED);
  const fontSize = useLocalStorage<FontSize>("settings-font-size", DEFAULT_FONT_SIZE);
  const disableCardHoverEffects = useLocalStorage("settings-disable-card-hover", DEFAULT_DISABLE_CARD_HOVER);
  const analyticsEnabled = useLocalStorage("settings-analytics-enabled", DEFAULT_ANALYTICS_ENABLED);
  const highContrast = useLocalStorage("settings-high-contrast", DEFAULT_HIGH_CONTRAST);

  const toggleCursor = () => {
    cursorDisabled.value = !cursorDisabled.value;
  };

  const setTheme = (theme: "light" | "dark" | "system") => {
    colorMode.preference = theme;
  };

  const setLanguage = (lang: Locale) => {
    language.value = lang;
  };

  const toggleReducedMotion = () => {
    reducedMotion.value = !reducedMotion.value;
  };

  const setMarqueeSpeed = (speed: MarqueeSpeed) => {
    marqueeSpeed.value = speed;
  };

  const setFontSize = (size: FontSize) => {
    fontSize.value = size;
  };

  const toggleCardHoverEffects = () => {
    disableCardHoverEffects.value = !disableCardHoverEffects.value;
  };

  const toggleAnalytics = () => {
    analyticsEnabled.value = !analyticsEnabled.value;
  };

  const toggleHighContrast = () => {
    highContrast.value = !highContrast.value;
  };

  const resetToDefaults = () => {
    cursorDisabled.value = DEFAULT_CURSOR_DISABLED;
    if (process.client && typeof window !== "undefined" && window.localStorage) {
      try {
        const prefersReduced = getPrefersReducedMotion();
        reducedMotion.value = prefersReduced;
      } catch {
        reducedMotion.value = DEFAULT_REDUCED_MOTION;
      }
    } else {
      reducedMotion.value = DEFAULT_REDUCED_MOTION;
    }
    colorMode.preference = DEFAULT_THEME;
    language.value = DEFAULT_LANGUAGE;
    marqueeSpeed.value = DEFAULT_MARQUEE_SPEED;
    fontSize.value = DEFAULT_FONT_SIZE;
    disableCardHoverEffects.value = DEFAULT_DISABLE_CARD_HOVER;
    analyticsEnabled.value = DEFAULT_ANALYTICS_ENABLED;
    highContrast.value = DEFAULT_HIGH_CONTRAST;
  };

  return {
    cursorDisabled: computed(() => cursorDisabled.value),
    toggleCursor,
    theme: computed(() => colorMode.preference),
    setTheme,
    language: computed(() => language.value),
    setLanguage,
    reducedMotion: computed(() => reducedMotion.value),
    toggleReducedMotion,
    marqueeSpeed: computed(() => marqueeSpeed.value),
    setMarqueeSpeed,
    fontSize: computed(() => fontSize.value),
    setFontSize,
    disableCardHoverEffects: computed(() => disableCardHoverEffects.value),
    toggleCardHoverEffects,
    analyticsEnabled: computed(() => analyticsEnabled.value),
    toggleAnalytics,
    highContrast: computed(() => highContrast.value),
    toggleHighContrast,
    resetToDefaults,
  };
}

export const useSettings = () => {
  if (!settingsInstance) {
    settingsInstance = createSettings();
  }
  return settingsInstance;
};

