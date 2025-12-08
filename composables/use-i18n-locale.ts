import type { Locale } from "~/types/i18n";
import { useSettings } from "~/composables/settings";

export const useI18nLocale = () => {
  const { locale, locales, setLocale } = useI18n();
  const settings = useSettings();

  const availableLocales = computed(() => 
    locales.value.filter((l) => l.code !== locale.value)
  );

  const currentLocale = computed(() => 
    locales.value.find((l) => l.code === locale.value)
  );

  const switchLocale = async (newLocale: Locale) => {
    if (newLocale === locale.value) return;

    try {
      // Set locale - i18n module will handle lazy loading the locale file
      // Await to ensure the locale file is loaded before continuing
      await setLocale(newLocale);
      // Persist language preference to settings (this will also sync to cookies)
      settings.setLanguage(newLocale);
      
      // Ensure cookies are set for SSR (settings.setLanguage handles this, but double-check)
      if (process.client && typeof document !== "undefined") {
        document.cookie = `i18n_redirected=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch (error) {
      console.error("Failed to switch locale:", error);
      // Fallback to English on error
      await setLocale("en");
      settings.setLanguage("en");
      if (process.client && typeof document !== "undefined") {
        document.cookie = `i18n_redirected=en; path=/; max-age=31536000; SameSite=Lax`;
      }
    }
  };

  return {
    locale: computed(() => locale.value as Locale),
    currentLocale,
    availableLocales,
    switchLocale,
  };
};

