<script lang="ts" setup>
import type { Locale } from "~/types/i18n";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, Monitor, Type, RotateCcw } from "lucide-vue-next";
import { toast } from "vue-sonner";

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
  onResetToDefaults: () => void;
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
}[] = [
  { value: "default", labelKey: "settings.fontSizeDefault" },
  { value: "large", labelKey: "settings.fontSizeLarge" },
  { value: "xlarge", labelKey: "settings.fontSizeXLarge" },
];

const fontFamilyOptions: {
  value: "sans" | "serif" | "mono";
  labelKey: string;
}[] = [
  { value: "sans", labelKey: "settings.fontSans" },
  { value: "serif", labelKey: "settings.fontSerif" },
  { value: "mono", labelKey: "settings.fontMono" },
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

const getOptionButtonClass = (isActive: boolean, isDisabled?: boolean) =>
  cn(
    "flex-1 h-8 px-2 text-xs",
    isActive
      ? "border-foreground/25 bg-foreground/[0.06] text-foreground"
      : "border-border hover:bg-accent",
    isDisabled && "opacity-50 cursor-not-allowed",
  );

const appConfig = useAppConfig();
const version = (appConfig as { version?: string }).version ?? "Unknown";

const handleReset = async () => {
  props.onResetToDefaults();
  if (locale.value !== "en") {
    isSwitchingLocale.value = true;
    try {
      await switchLocale("en");
    } catch {
      toast.error(t("settings.languageSwitchError"));
    } finally {
      isSwitchingLocale.value = false;
    }
  }
  toast.success(t("settings.resetSuccess"));
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="text-sm font-medium text-foreground">
      {{ t("settings.title") }}
    </p>

    <div class="flex flex-col gap-3">
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
          :model-value="props.languageSwitchToastEnabled"
          aria-labelledby="language-switch-toast-label"
          aria-describedby="language-switch-toast-description"
          @update:model-value="
            (v) =>
              handleSwitchChange(
                v,
                props.languageSwitchToastEnabled,
                props.onToggleLanguageSwitchToast,
              )
          "
        />
      </NavbarSettingsRow>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex flex-col gap-0.5">
        <label id="theme-label" class="text-xs font-medium text-foreground">
          {{ t("settings.theme") }}
        </label>
        <p id="theme-description" class="text-[11px] leading-snug text-muted-foreground">
          {{ t("settings.themeDescription") }}
        </p>
      </div>
      <div
        class="flex gap-1.5"
        role="group"
        aria-labelledby="theme-label"
        aria-describedby="theme-description"
      >
        <Button
          v-for="opt in themeOptions"
          :key="opt.value"
          variant="outline"
          size="sm"
          :class="getOptionButtonClass(theme === opt.value)"
          :aria-label="t(opt.labelKey)"
          :aria-pressed="theme === opt.value"
          @click="opt.handler"
        >
          <component :is="opt.icon" class="size-3.5 shrink-0" />
        </Button>
      </div>
    </div>

    <div class="flex flex-col gap-1.5" :aria-busy="isSwitchingLocale">
      <div class="flex flex-col gap-0.5">
        <label id="language-label" class="text-xs font-medium text-foreground">
          {{ t("settings.language") }}
        </label>
        <p id="language-description" class="text-[11px] leading-snug text-muted-foreground">
          {{ t("settings.languageDescription") }}
        </p>
      </div>
      <div
        class="flex flex-wrap gap-1.5"
        role="group"
        aria-labelledby="language-label"
        aria-describedby="language-description"
      >
        <Button
          v-for="loc in allLocales"
          :key="loc.code"
          variant="outline"
          size="sm"
          :class="getOptionButtonClass(locale === loc.code, isSwitchingLocale)"
          :aria-pressed="locale === loc.code"
          :disabled="isSwitchingLocale"
          @click="handleLocaleChange(loc.code)"
        >
          {{ loc.name }}
        </Button>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex flex-col gap-0.5">
        <label id="font-size-label" class="text-xs font-medium text-foreground">
          {{ t("settings.fontSize") }}
        </label>
        <p id="font-size-description" class="text-[11px] leading-snug text-muted-foreground">
          {{ t("settings.fontSizeDescription") }}
        </p>
      </div>
      <div
        class="flex gap-1.5"
        role="group"
        aria-labelledby="font-size-label"
        aria-describedby="font-size-description"
      >
        <Button
          v-for="opt in fontSizeOptions"
          :key="opt.value"
          variant="outline"
          size="sm"
          :class="getOptionButtonClass(fontSize === opt.value)"
          :aria-pressed="fontSize === opt.value"
          @click="onSetFontSize(opt.value)"
        >
          <Type class="size-3.5 shrink-0" />
          {{ t(opt.labelKey) }}
        </Button>
      </div>
    </div>

    <div class="flex flex-col gap-1.5">
      <div class="flex flex-col gap-0.5">
        <label
          id="font-family-label"
          class="text-xs font-medium text-foreground"
        >
          {{ t("settings.fontFamily") }}
        </label>
        <p id="font-family-description" class="text-[11px] leading-snug text-muted-foreground">
          {{ t("settings.fontFamilyDescription") }}
        </p>
      </div>
      <div
        class="flex gap-1.5"
        role="group"
        aria-labelledby="font-family-label"
        aria-describedby="font-family-description"
      >
        <Button
          v-for="opt in fontFamilyOptions"
          :key="opt.value"
          variant="outline"
          size="sm"
          :class="getOptionButtonClass(fontFamily === opt.value)"
          :aria-pressed="fontFamily === opt.value"
          @click="onSetFontFamily(opt.value)"
        >
          {{ t(opt.labelKey) }}
        </Button>
      </div>
    </div>

    <div class="border-t border-border/60 pt-3">
      <p class="mb-2 text-xs font-medium text-foreground">
        {{ t("settings.sources") }}
      </p>
      <ul class="flex flex-col gap-2">
        <li
          v-for="{ name, description } in providers"
          :key="name"
          class="flex flex-col gap-0.5"
        >
          <p class="text-xs font-medium text-foreground">{{ name }}</p>
          <p class="text-[11px] leading-snug text-muted-foreground">
            {{ description }}
          </p>
        </li>
      </ul>
      <p class="mt-3 text-[11px] text-muted-foreground">
        {{ t("settings.version") }} {{ version }}
      </p>
    </div>

    <div class="flex flex-col gap-1.5">
      <p class="text-[11px] leading-snug text-muted-foreground">
        {{ t("settings.resetToDefaultsDescription") }}
      </p>
      <Button
        variant="outline"
        size="sm"
        class="h-8 w-full text-xs"
        @click="handleReset"
      >
        <RotateCcw class="mr-1.5 size-3.5 shrink-0" />
        {{ t("settings.resetToDefaults") }}
      </Button>
    </div>
  </div>
</template>
