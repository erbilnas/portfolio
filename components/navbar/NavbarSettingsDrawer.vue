<script lang="ts" setup>
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { RotateCcw } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { Locale } from "~/types/i18n";
import NavbarSettingsPanel from "./NavbarSettingsPanel.vue";

interface Props {
  open: boolean;
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

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const { t } = useI18n();
const { locale, switchLocale } = useI18nLocale();
const isResetting = ref(false);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const appConfig = useAppConfig();
const version = (appConfig as { version?: string }).version ?? "Unknown";

const handleReset = async () => {
  props.onResetToDefaults();
  if (locale.value !== "en") {
    isResetting.value = true;
    try {
      await switchLocale("en" as Locale);
    } catch {
      toast.error(t("settings.languageSwitchError"));
    } finally {
      isResetting.value = false;
    }
  }
  toast.success(t("settings.resetSuccess"));
};
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent
      side="right"
      class="flex h-full w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
    >
      <SheetHeader
        class="shrink-0 border-b border-neutral-200 px-5 py-4 pr-12 text-left dark:border-white/15"
      >
        <SheetTitle
          class="text-base font-semibold tracking-tight text-neutral-950 dark:text-white"
        >
          {{ t("settings.title") }}
        </SheetTitle>
        <SheetDescription class="sr-only">
          {{ t("nav.multipleLanguagesSupported") }}
        </SheetDescription>
      </SheetHeader>

      <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5 scrollbar-thin">
        <NavbarSettingsPanel
          :cursor-disabled="cursorDisabled"
          :theme="theme"
          :reduced-motion="reducedMotion"
          :font-size="fontSize"
          :font-family="fontFamily"
          :high-contrast="highContrast"
          :language-switch-toast-enabled="languageSwitchToastEnabled"
          :on-toggle-cursor="onToggleCursor"
          :on-set-light-theme="onSetLightTheme"
          :on-set-dark-theme="onSetDarkTheme"
          :on-set-system-theme="onSetSystemTheme"
          :on-toggle-reduced-motion="onToggleReducedMotion"
          :on-set-font-size="onSetFontSize"
          :on-set-font-family="onSetFontFamily"
          :on-toggle-high-contrast="onToggleHighContrast"
          :on-toggle-language-switch-toast="onToggleLanguageSwitchToast"
        />
      </div>

      <footer
        class="shrink-0 flex items-center justify-between gap-3 border-t border-neutral-200 px-5 py-4 dark:border-white/15"
      >
        <p
          class="text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
        >
          {{ t("settings.version") }} {{ version }}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          class="gap-1.5 text-[12px]"
          :disabled="isResetting"
          @click="handleReset"
        >
          <RotateCcw class="size-3 shrink-0" aria-hidden="true" />
          {{ t("settings.resetToDefaults") }}
        </Button>
      </footer>
    </SheetContent>
  </Sheet>
</template>
