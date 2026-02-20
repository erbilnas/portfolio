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
import { useSettings } from "~/composables/settings";

// Use a ref to ensure reactivity and avoid initialization order issues
const isClient = ref(false);
const toastShown = ref(false); // Guard to prevent duplicate toasts

// Get i18n composables
const { locale, t, setLocale } = useI18n();
const { switchLocale } = useI18nLocale();
const settings = useSettings();

const VALID_LOCALES = ["en", "tr", "ja"] as const;

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
      if (cookies.i18n_redirected && VALID_LOCALES.includes(cookies.i18n_redirected as any)) {
        await setLocale(cookies.i18n_redirected);
        return;
      }
      // Fallback to our custom cookie
      if (cookies["settings-language"]) {
        try {
          const parsed = JSON.parse(cookies["settings-language"]);
          if (VALID_LOCALES.includes(parsed)) {
            await setLocale(parsed);
            return;
          }
        } catch {
          if (VALID_LOCALES.includes(cookies["settings-language"] as any)) {
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
    if (cookies.i18n_redirected && VALID_LOCALES.includes(cookies.i18n_redirected as any)) {
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
          if (VALID_LOCALES.includes(parsedLanguage)) {
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

  // Check if user's browser language matches an available locale (Turkish or Japanese)
  if (typeof navigator !== "undefined") {
    const browserLanguage =
      navigator.language || (navigator as any).userLanguage;
    const browserLang = browserLanguage.startsWith("ja")
      ? "ja"
      : browserLanguage.startsWith("tr")
        ? "tr"
        : null;

    // Show toast if:
    // 1. Browser language is Turkish or Japanese
    // 2. Current locale is English (default)
    // 3. User has not disabled the language switch toast in settings
    if (
      browserLang &&
      locale.value === "en" &&
      settings.languageSwitchToastEnabled.value
    ) {
      const targetLocale = browserLang;
      setTimeout(() => {
        try {
          toast(t(`languageSwitch.${targetLocale}.title`), {
            id: "language-switch-toast",
            description: t(`languageSwitch.${targetLocale}.description`),
            action: {
              label: t(`languageSwitch.${targetLocale}.switch`),
              onClick: () => {
                switchLocale(targetLocale);
              },
            },
            cancel: {
              label: t(`languageSwitch.${targetLocale}.dismiss`),
            },
            duration: 10000,
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

// JSON-LD Person schema for search engines
const personJsonLd = usePersonJsonLd();
useHead({
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(personJsonLd),
    },
  ],
});
</script>
