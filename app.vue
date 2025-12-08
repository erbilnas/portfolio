<template>
  <Cursor v-if="isClient" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <ClientOnly>
    <Sonner />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Sonner } from "@/components/ui/sonner";
import { toast } from "vue-sonner";
import "vue-sonner/style.css";
import { useI18nLocale } from "~/composables/use-i18n-locale";

// Use a ref to ensure reactivity and avoid initialization order issues
const isClient = ref(false);
const toastShown = ref(false); // Guard to prevent duplicate toasts

// Get i18n composables
const { locale, t, setLocale } = useI18n();
const { switchLocale } = useI18nLocale();

// Helper to parse cookie string
const parseCookies = (cookieString: string): Record<string, string> => {
  return cookieString.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) {
      acc[key] = decodeURIComponent(value);
    }
    return acc;
  }, {} as Record<string, string>);
};

// Initialize locale from cookie on server before rendering
// This ensures server and client render with the same locale
onServerPrefetch(async () => {
  if (process.server) {
    const headers = useRequestHeaders(["cookie"]);
    const cookieHeader = headers.cookie;
    
    if (cookieHeader) {
      const cookies = parseCookies(cookieHeader);
      
      // Check for i18n cookie first (used by @nuxtjs/i18n)
      if (cookies.i18n_redirected && (cookies.i18n_redirected === "en" || cookies.i18n_redirected === "tr")) {
        await setLocale(cookies.i18n_redirected);
        return;
      }
      // Fallback to our custom cookie
      if (cookies["settings-language"]) {
        try {
          const parsed = JSON.parse(cookies["settings-language"]);
          if (parsed === "en" || parsed === "tr") {
            await setLocale(parsed);
            return;
          }
        } catch {
          if (cookies["settings-language"] === "en" || cookies["settings-language"] === "tr") {
            await setLocale(cookies["settings-language"]);
            return;
          }
        }
      }
    }
  }
});

// Initialize locale from cookie on client (for migration and fallback)
onBeforeMount(async () => {
  if (process.client) {
    const cookies = parseCookies(document.cookie);
    
    // Check for i18n cookie first
    if (cookies.i18n_redirected && (cookies.i18n_redirected === "en" || cookies.i18n_redirected === "tr")) {
      if (cookies.i18n_redirected !== locale.value) {
        await setLocale(cookies.i18n_redirected);
      }
      return;
    }
    
    // Migrate from localStorage to cookies
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const storedLanguage = localStorage.getItem("settings-language");
        if (storedLanguage) {
          const parsedLanguage = JSON.parse(storedLanguage);
          if (parsedLanguage === "en" || parsedLanguage === "tr") {
            // Set cookies for future requests
            document.cookie = `i18n_redirected=${parsedLanguage}; path=/; max-age=31536000; SameSite=Lax`;
            document.cookie = `settings-language=${JSON.stringify(parsedLanguage)}; path=/; max-age=31536000; SameSite=Lax`;
            // Set locale if different
            if (parsedLanguage !== locale.value) {
              await setLocale(parsedLanguage);
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }
  }
});

// Initialize on client side only, after all components are mounted
onMounted(async () => {
  isClient.value = true;

  // Prevent duplicate toast on hot module reload
  if (toastShown.value) return;
  toastShown.value = true;

  // Wait for DOM to be ready and Toaster component to be mounted
  await nextTick();

  // Additional delay to ensure toast component is fully mounted and CSS is loaded
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Check if user's browser language is Turkish
  if (typeof navigator !== "undefined") {
    const browserLanguage =
      navigator.language || (navigator as any).userLanguage;
    const isTurkishBrowser = browserLanguage.startsWith("tr");

    // Show toast if:
    // 1. Browser language is Turkish
    // 2. Current locale is English (default)
    if (isTurkishBrowser && locale.value === "en") {
      // Ensure Toaster is ready by waiting a bit more
      setTimeout(() => {
        try {
          toast(t("languageSwitch.title"), {
            id: "language-switch-toast", // Unique ID to prevent duplicates
            description: t("languageSwitch.description"),
            action: {
              label: t("languageSwitch.switch"),
              onClick: () => {
                switchLocale("tr");
              },
            },
            cancel: {
              label: t("languageSwitch.dismiss"),
            },
            duration: 10000, // Show for 10 seconds
          });
        } catch (error) {
          console.error("Error showing toast:", error);
        }
      }, 500);
    }
  }
});

// Update HTML lang attribute when locale changes
useHead({
  htmlAttrs: {
    lang: locale,
  },
});
</script>
