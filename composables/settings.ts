import { useColorMode } from "#imports";
import { ref, watch } from "vue";

// Simple localStorage implementation to avoid VueUse import on server
function useLocalStorage<T>(key: string, defaultValue: T) {
  const storedValue = ref<T>(defaultValue);

  // Only access localStorage on client side
  if (process.client && typeof window !== "undefined" && window.localStorage) {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        storedValue.value = JSON.parse(item);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }

    // Watch for changes and sync to localStorage
    watch(
      storedValue,
      (newValue) => {
        try {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
          console.warn(`Error writing localStorage key "${key}":`, error);
        }
      },
      { deep: true }
    );
  }

  return storedValue;
}

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

