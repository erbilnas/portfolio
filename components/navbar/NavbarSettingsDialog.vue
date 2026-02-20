<script lang="ts" setup>
import type { Locale } from "~/types/i18n";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sun,
  Moon,
  Monitor,
  Type,
  RotateCcw,
  Keyboard,
  ChevronDown,
  ChevronRight,
  Info,
} from "lucide-vue-next";
import { toast } from "vue-sonner";

interface Props {
  open: boolean;
  cursorDisabled: boolean;
  theme: "light" | "dark" | "system";
  reducedMotion: boolean;
  fontSize: "default" | "large" | "xlarge";
  fontFamily: "sans" | "serif" | "mono";
  disableCardHoverEffects: boolean;
  analyticsEnabled: boolean;
  highContrast: boolean;
  languageSwitchToastEnabled: boolean;
  onToggleCursor: () => void;
  onSetLightTheme: () => void;
  onSetDarkTheme: () => void;
  onSetSystemTheme: () => void;
  onToggleReducedMotion: () => void;
  onSetFontSize: (size: "default" | "large" | "xlarge") => void;
  onSetFontFamily: (family: "sans" | "serif" | "mono") => void;
  onToggleCardHoverEffects: () => void;
  onToggleAnalytics: () => void;
  onToggleHighContrast: () => void;
  onToggleLanguageSwitchToast: () => void;
  onResetToDefaults: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const { t, locales } = useI18n();
const { locale, switchLocale } = useI18nLocale();
const isSwitchingLocale = ref(false);
const shortcutsOpen = ref(false);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const handleSwitchChange = (
  checked: boolean,
  current: boolean,
  onToggle: () => void
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
  { value: "light" as const, labelKey: "settings.light", icon: Sun, handler: () => props.onSetLightTheme() },
  { value: "dark" as const, labelKey: "settings.dark", icon: Moon, handler: () => props.onSetDarkTheme() },
  { value: "system" as const, labelKey: "settings.system", icon: Monitor, handler: () => props.onSetSystemTheme() },
];

const fontSizeOptions: { value: "default" | "large" | "xlarge"; labelKey: string }[] = [
  { value: "default", labelKey: "settings.fontSizeDefault" },
  { value: "large", labelKey: "settings.fontSizeLarge" },
  { value: "xlarge", labelKey: "settings.fontSizeXLarge" },
];

const fontFamilyOptions: { value: "sans" | "serif" | "mono"; labelKey: string }[] = [
  { value: "sans", labelKey: "settings.fontSans" },
  { value: "serif", labelKey: "settings.fontSerif" },
  { value: "mono", labelKey: "settings.fontMono" },
];

const getOptionButtonClass = (isActive: boolean, isDisabled?: boolean) =>
  cn(
    "flex-1",
    isActive
      ? "border-primary bg-primary/10 text-primary"
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
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin">
      <DialogHeader>
        <DialogTitle>{{ t("settings.title") }}</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 py-4">
        <!-- Custom Cursor Toggle -->
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
            @update:model-value="(v) => handleSwitchChange(v, cursorDisabled, onToggleCursor)"
          />
        </NavbarSettingsRow>

        <!-- Reduced Motion Toggle -->
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
            @update:model-value="(v) => handleSwitchChange(v, reducedMotion, onToggleReducedMotion)"
          />
        </NavbarSettingsRow>

        <!-- Theme Selection -->
        <div class="flex flex-col gap-2">
          <label
            id="theme-label"
            class="text-sm font-medium"
          >
            {{ t("settings.theme") }}
          </label>
          <div
            class="flex gap-2"
            role="group"
            aria-labelledby="theme-label"
          >
            <Button
              v-for="opt in themeOptions"
              :key="opt.value"
              variant="outline"
              :class="getOptionButtonClass(theme === opt.value)"
              :aria-pressed="theme === opt.value"
              @click="opt.handler"
            >
              <component
                :is="opt.icon"
                class="size-4 shrink-0"
              />
              {{ t(opt.labelKey) }}
            </Button>
          </div>
        </div>

        <!-- Language Selection -->
        <div
          class="flex flex-col gap-2"
          :aria-busy="isSwitchingLocale"
        >
          <div class="flex items-center gap-2">
            <label
              id="language-label"
              class="text-sm font-medium"
            >
              {{ t("settings.language") }}
            </label>
            <span
              class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              Beta
            </span>
          </div>
          <div
            class="flex flex-wrap gap-2"
            role="group"
            aria-labelledby="language-label"
          >
            <Button
              v-for="loc in allLocales"
              :key="loc.code"
              variant="outline"
              :class="getOptionButtonClass(locale === loc.code, isSwitchingLocale)"
              :aria-pressed="locale === loc.code"
              :disabled="isSwitchingLocale"
              @click="handleLocaleChange(loc.code)"
            >
              {{ loc.name }}
            </Button>
          </div>
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
              @update:model-value="(v) => handleSwitchChange(v, props.languageSwitchToastEnabled, props.onToggleLanguageSwitchToast)"
            />
          </NavbarSettingsRow>
          <p
            v-if="isSwitchingLocale"
            class="text-xs text-muted-foreground"
          >
            {{ t("common.loading") }}
          </p>
        </div>

        <!-- Font Size -->
        <div class="flex flex-col gap-2">
          <label id="font-size-label" class="text-sm font-medium">
            {{ t("settings.fontSize") }}
          </label>
          <div class="flex gap-2" role="group" aria-labelledby="font-size-label">
            <Button
              v-for="opt in fontSizeOptions"
              :key="opt.value"
              variant="outline"
              :class="getOptionButtonClass(fontSize === opt.value)"
              :aria-pressed="fontSize === opt.value"
              @click="onSetFontSize(opt.value)"
            >
              <Type class="size-4 shrink-0" />
              {{ t(opt.labelKey) }}
            </Button>
          </div>
        </div>

        <!-- Font Family -->
        <div class="flex flex-col gap-2">
          <label id="font-family-label" class="text-sm font-medium">
            {{ t("settings.fontFamily") }}
          </label>
          <div class="flex gap-2" role="group" aria-labelledby="font-family-label">
            <Button
              v-for="opt in fontFamilyOptions"
              :key="opt.value"
              variant="outline"
              :class="getOptionButtonClass(fontFamily === opt.value)"
              :aria-pressed="fontFamily === opt.value"
              @click="onSetFontFamily(opt.value)"
            >
              {{ t(opt.labelKey) }}
            </Button>
          </div>
        </div>

        <!-- Card Hover Effects Toggle -->
        <NavbarSettingsRow
          :label="t('settings.disableCardHoverEffects')"
          :description="t('settings.disableCardHoverEffectsDescription')"
          label-id="card-hover-label"
          description-id="card-hover-description"
        >
          <Switch
            :model-value="disableCardHoverEffects"
            aria-labelledby="card-hover-label"
            aria-describedby="card-hover-description"
            @update:model-value="(v) => handleSwitchChange(v, disableCardHoverEffects, onToggleCardHoverEffects)"
          />
        </NavbarSettingsRow>

        <!-- Analytics Toggle -->
        <NavbarSettingsRow
          :label="t('settings.analyticsEnabled')"
          :description="t('settings.analyticsEnabledDescription')"
          label-id="analytics-label"
          description-id="analytics-description"
        >
          <Switch
            :model-value="analyticsEnabled"
            aria-labelledby="analytics-label"
            aria-describedby="analytics-description"
            @update:model-value="(v) => handleSwitchChange(v, analyticsEnabled, onToggleAnalytics)"
          />
        </NavbarSettingsRow>

        <!-- High Contrast Toggle -->
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
            @update:model-value="(v) => handleSwitchChange(v, highContrast, onToggleHighContrast)"
          />
        </NavbarSettingsRow>

        <!-- Keyboard Shortcuts -->
        <div class="flex flex-col gap-2">
          <button
            type="button"
            class="flex items-center gap-2 text-sm font-medium text-left hover:text-primary transition-colors"
            @click="shortcutsOpen = !shortcutsOpen"
          >
            <ChevronRight
              :class="['size-4 shrink-0 transition-transform', shortcutsOpen && 'rotate-90']"
            />
            <Keyboard class="size-4 shrink-0" />
            {{ t("settings.keyboardShortcuts") }}
          </button>
          <div
            v-show="shortcutsOpen"
            class="pl-6 space-y-1.5 text-xs text-muted-foreground"
          >
            <p>{{ t("settings.shortcutTheme") }}: <kbd class="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">T</kbd></p>
            <p>{{ t("settings.shortcutSettings") }}: <kbd class="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">S</kbd></p>
            <p>{{ t("settings.shortcutScrollToTop") }}: <kbd class="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">Home</kbd></p>
          </div>
        </div>

        <!-- About -->
        <div class="flex flex-col gap-1 pt-2 border-t text-xs text-muted-foreground">
          <div class="flex items-center gap-2">
            <Info class="size-4 shrink-0" />
            <span>{{ t("settings.builtWith") }}</span>
          </div>
          <div class="pl-6">
            {{ t("settings.version") }} {{ version }}
          </div>
        </div>

        <!-- Reset to Defaults -->
        <Button
          variant="outline"
          class="w-full"
          @click="handleReset"
        >
          <RotateCcw class="size-4 shrink-0 mr-2" />
          {{ t("settings.resetToDefaults") }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
