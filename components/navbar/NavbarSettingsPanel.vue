<script lang="ts" setup>
import type { Locale } from "~/types/i18n";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Sun, Moon, Monitor } from "lucide-vue-next";
import { toast } from "vue-sonner";
import NavbarSettingsRow from "./SettingsRow.vue";

interface Props {
  cursorDisabled: boolean;
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  fontSize: "default" | "large" | "xlarge";
  fontFamily: "sans" | "serif" | "mono";
  highContrast: boolean;
  languageSwitchToastEnabled: boolean;
  onToggleCursor: () => void;
  onSetLightTheme: () => void;
  onSetDarkTheme: () => void;
  onSetSystemTheme: () => void;
  onToggleReducedMotion: () => void;
  onSetFontSize: (size: "default" | "large" | "xlarge") => void;
  onSetFontFamily: (family: "sans" | "serif" | "mono") => void;
  onToggleHighContrast: () => void;
  onToggleLanguageSwitchToast: () => void;
}

const props = defineProps<Props>();

const { t, locales } = useI18n();
const { locale, switchLocale } = useI18nLocale();
const isSwitchingLocale = ref(false);

const handleSwitchChange = (
  checked: boolean,
  current: boolean,
  onToggle: () => void,
) => {
  if (checked !== current) onToggle();
};

const handleLocaleChange = async (newLocale: string) => {
  if (newLocale === locale.value) return;

  isSwitchingLocale.value = true;
  try {
    await switchLocale(newLocale as Locale);
  } catch {
    toast.error(t("settings.languageSwitchError"));
  } finally {
    isSwitchingLocale.value = false;
  }
};

// Keep locale button order stable when the active language changes.
const allLocales = computed(() => locales.value);

const themeOptions = [
  {
    value: "light" as const,
    labelKey: "settings.light",
    icon: Sun,
    handler: () => props.onSetLightTheme(),
  },
  {
    value: "dark" as const,
    labelKey: "settings.dark",
    icon: Moon,
    handler: () => props.onSetDarkTheme(),
  },
  {
    value: "system" as const,
    labelKey: "settings.system",
    icon: Monitor,
    handler: () => props.onSetSystemTheme(),
  },
];

const fontSizeOptions: {
  value: "default" | "large" | "xlarge";
  labelKey: string;
  previewClass: string;
}[] = [
  {
    value: "default",
    labelKey: "settings.fontSizeDefault",
    previewClass: "text-[11px]",
  },
  {
    value: "large",
    labelKey: "settings.fontSizeLarge",
    previewClass: "text-[13px]",
  },
  {
    value: "xlarge",
    labelKey: "settings.fontSizeXLarge",
    previewClass: "text-[15px]",
  },
];

const fontFamilyOptions: {
  value: "sans" | "serif" | "mono";
  labelKey: string;
  faceClass: string;
}[] = [
  {
    value: "sans",
    labelKey: "settings.fontSans",
    faceClass: "font-sans",
  },
  {
    value: "serif",
    labelKey: "settings.fontSerif",
    faceClass: "font-serif",
  },
  {
    value: "mono",
    labelKey: "settings.fontMono",
    faceClass: "font-mono",
  },
];

const providerKeys = [
  "howLongToBeat",
  "spotify",
  "goodreads",
  "rss2json",
  "trakt",
  "github",
] as const;

const providers = computed(() =>
  providerKeys.map((key) => ({
    name: t(`footer.providers.${key}.name`),
    description: t(`footer.providers.${key}.description`),
  })),
);

const segmentTrackClass =
  "grid grid-cols-3 gap-0.5 rounded-lg bg-neutral-100 p-0.5 dark:bg-white/[0.06]";

const getSegmentButtonClass = (isActive: boolean, isDisabled?: boolean) =>
  cn(
    "inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black",
    isActive
      ? "bg-white text-neutral-950 shadow-sm dark:bg-neutral-900 dark:text-white"
      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100",
    isDisabled && "cursor-not-allowed opacity-50",
  );
</script>

<template>
  <div class="flex flex-col gap-8">
    <section aria-label="Preferences">
      <div class="border-t border-neutral-200 dark:border-white/15">
        <NavbarSettingsRow
          :label="t('settings.disableCustomCursor')"
          :description="t('settings.disableCustomCursorDescription')"
          label-id="cursor-label"
          description-id="cursor-description"
        >
          <Switch
            :model-value="cursorDisabled"
            aria-labelledby="cursor-label"
            aria-describedby="cursor-description"
            @update:model-value="
              (v) => handleSwitchChange(v, cursorDisabled, onToggleCursor)
            "
          />
        </NavbarSettingsRow>

        <NavbarSettingsRow
          :label="t('settings.reducedMotion')"
          :description="t('settings.reducedMotionDescription')"
          label-id="reduced-motion-label"
          description-id="reduced-motion-description"
        >
          <Switch
            :model-value="reducedMotion"
            aria-labelledby="reduced-motion-label"
            aria-describedby="reduced-motion-description"
            @update:model-value="
              (v) =>
                handleSwitchChange(v, reducedMotion, onToggleReducedMotion)
            "
          />
        </NavbarSettingsRow>

        <NavbarSettingsRow
          :label="t('settings.highContrast')"
          :description="t('settings.highContrastDescription')"
          label-id="high-contrast-label"
          description-id="high-contrast-description"
        >
          <Switch
            :model-value="highContrast"
            aria-labelledby="high-contrast-label"
            aria-describedby="high-contrast-description"
            @update:model-value="
              (v) => handleSwitchChange(v, highContrast, onToggleHighContrast)
            "
          />
        </NavbarSettingsRow>

        <NavbarSettingsRow
          :label="t('settings.languageSwitchToast')"
          :description="t('settings.languageSwitchToastDescription')"
          label-id="language-switch-toast-label"
          description-id="language-switch-toast-description"
        >
          <Switch
            :model-value="languageSwitchToastEnabled"
            aria-labelledby="language-switch-toast-label"
            aria-describedby="language-switch-toast-description"
            @update:model-value="
              (v) =>
                handleSwitchChange(
                  v,
                  languageSwitchToastEnabled,
                  onToggleLanguageSwitchToast,
                )
            "
          />
        </NavbarSettingsRow>
      </div>
    </section>

    <section class="flex flex-col gap-5" aria-label="Appearance">
      <div class="flex flex-col gap-2">
        <p
          id="theme-label"
          class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
        >
          {{ t("settings.theme") }}
        </p>
        <div
          :class="segmentTrackClass"
          role="group"
          aria-labelledby="theme-label"
        >
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            type="button"
            :class="getSegmentButtonClass(theme === opt.value)"
            :aria-label="t(opt.labelKey)"
            :aria-pressed="theme === opt.value"
            @click="opt.handler"
          >
            <component
              :is="opt.icon"
              class="size-3.5 shrink-0"
              aria-hidden="true"
            />
            <span>{{ t(opt.labelKey) }}</span>
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2" :aria-busy="isSwitchingLocale">
        <p
          id="language-label"
          class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
        >
          {{ t("settings.language") }}
        </p>
        <div
          :class="segmentTrackClass"
          role="group"
          aria-labelledby="language-label"
        >
          <button
            v-for="loc in allLocales"
            :key="loc.code"
            type="button"
            :class="
              getSegmentButtonClass(locale === loc.code, isSwitchingLocale)
            "
            :aria-pressed="locale === loc.code"
            :disabled="isSwitchingLocale"
            @click="handleLocaleChange(loc.code)"
          >
            {{ loc.name }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p
          id="font-size-label"
          class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
        >
          {{ t("settings.fontSize") }}
        </p>
        <div
          :class="segmentTrackClass"
          role="group"
          aria-labelledby="font-size-label"
        >
          <button
            v-for="opt in fontSizeOptions"
            :key="opt.value"
            type="button"
            :class="[
              getSegmentButtonClass(fontSize === opt.value),
              opt.previewClass,
            ]"
            :aria-pressed="fontSize === opt.value"
            @click="onSetFontSize(opt.value)"
          >
            {{ t(opt.labelKey) }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <p
          id="font-family-label"
          class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
        >
          {{ t("settings.fontFamily") }}
        </p>
        <div
          :class="segmentTrackClass"
          role="group"
          aria-labelledby="font-family-label"
        >
          <button
            v-for="opt in fontFamilyOptions"
            :key="opt.value"
            type="button"
            :class="[
              getSegmentButtonClass(fontFamily === opt.value),
              opt.faceClass,
            ]"
            :aria-pressed="fontFamily === opt.value"
            @click="onSetFontFamily(opt.value)"
          >
            {{ t(opt.labelKey) }}
          </button>
        </div>
      </div>
    </section>

    <section
      class="border-t border-neutral-200 pt-6 dark:border-white/15"
      aria-labelledby="sources-label"
    >
      <p
        id="sources-label"
        class="mb-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
      >
        {{ t("settings.sources") }}
      </p>
      <ul class="flex flex-col border-t border-neutral-200 dark:border-white/15">
        <li
          v-for="{ name, description } in providers"
          :key="name"
          class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
        >
          <span
            class="shrink-0 text-[12px] font-medium text-neutral-950 dark:text-white"
          >
            {{ name }}
          </span>
          <span
            class="min-w-0 text-right text-[11px] leading-snug text-neutral-500 dark:text-neutral-400"
          >
            {{ description }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
