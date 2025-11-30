import { ref, onMounted, onUnmounted } from "vue";

/**
 * Client-only wrapper for useMediaQuery to avoid SSR build issues
 * Implements media query matching without VueUse to prevent bundling issues
 */
export function useMediaQuery(query: string) {
  const matches = ref(false);

  // On server, return a ref that defaults to false
  if (process.server) {
    return matches;
  }

  // On client, implement media query matching manually
  onMounted(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;

    // Update matches when media query changes
    const handleChange = (event: MediaQueryListEvent) => {
      matches.value = event.matches;
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      onUnmounted(() => {
        mediaQuery.removeEventListener("change", handleChange);
      });
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      onUnmounted(() => {
        mediaQuery.removeListener(handleChange);
      });
    }
  });

  return matches;
}
