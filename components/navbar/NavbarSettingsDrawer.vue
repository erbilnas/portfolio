<script lang="ts" setup>
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});
</script>

<template>
  <Sheet v-model:open="isOpen">
    <SheetContent
      side="right"
      class="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-md scrollbar-thin"
    >
      <SheetHeader class="sr-only">
        <SheetTitle>{{ t("settings.title") }}</SheetTitle>
        <SheetDescription>
          {{ t("nav.multipleLanguagesSupported") }}
        </SheetDescription>
      </SheetHeader>

      <div class="px-4 py-4 pr-12 sm:px-5 sm:pr-14">
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
          :on-reset-to-defaults="onResetToDefaults"
        />
      </div>
    </SheetContent>
  </Sheet>
</template>
