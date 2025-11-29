import { ref, watch } from "vue";

let _vueuseCache: typeof import("@vueuse/core") | null = null;

/**
 * Client-only wrapper for useMediaQuery to avoid SSR build issues
 * Uses dynamic import to prevent VueUse from being bundled into server code
 */
export function useMediaQuery(query: string) {
  const matches = ref(false);

  if (process.server) {
    // Return a ref that defaults to false on server
    return matches;
  }

  // Initialize VueUse on client side using dynamic import
  // This prevents VueUse from being statically bundled into server code
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    const loadVueUse = async () => {
      if (!_vueuseCache) {
        _vueuseCache = await import("@vueuse/core");
      }
      const result = _vueuseCache.useMediaQuery(query);
      matches.value = result.value;
      watch(result, (val) => {
        matches.value = val;
      });
    };

    loadVueUse().catch(() => {
      // Silently fail if VueUse can't be loaded
      // matches will remain false
    });
  }

  return matches;
}
