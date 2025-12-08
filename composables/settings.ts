import { useColorMode } from "#imports";
import { ref, watch, computed } from "vue";
import type { Locale } from "~/types/i18n";

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
  const cursorDisabled = useLocalStorage("settings-cursor-disabled", false);
  const language = useLocalStorage<Locale>("settings-language", "en");

  const toggleCursor = () => {
    cursorDisabled.value = !cursorDisabled.value;
  };

  const setTheme = (theme: "light" | "dark" | "system") => {
    colorMode.preference = theme;
  };

  const setLanguage = (lang: Locale) => {
    language.value = lang;
  };

  return {
    cursorDisabled: computed(() => cursorDisabled.value),
    toggleCursor,
    theme: computed(() => colorMode.preference),
    setTheme,
    language: computed(() => language.value),
    setLanguage,
  };
}

export const useSettings = () => {
  if (!settingsInstance) {
    settingsInstance = createSettings();
  }
  return settingsInstance;
};

