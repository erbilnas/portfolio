<script lang="ts" setup>
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  cursorDisabled: boolean;
  theme: "light" | "dark" | "system";
  onToggleCursor: () => void;
  onSetLightTheme: () => void;
  onSetDarkTheme: () => void;
  onSetSystemTheme: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const { t } = useI18n();
const { locale, currentLocale, availableLocales, switchLocale } =
  useI18nLocale();
const isSwitchingLocale = ref(false);

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});

const handleLocaleChange = async (newLocale: string) => {
  if (newLocale === locale.value) return;

  isSwitchingLocale.value = true;
  try {
    await switchLocale(newLocale as any);
  } finally {
    isSwitchingLocale.value = false;
  }
};

const allLocales = computed(() => {
  const current = currentLocale.value;
  const others = availableLocales.value;
  return current ? [current, ...others] : others;
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{{ t("settings.title") }}</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 py-4">
        <!-- Custom Cursor Toggle -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">{{
              t("settings.disableCustomCursor")
            }}</label>
            <p class="text-xs text-muted-foreground">
              {{ t("settings.disableCustomCursorDescription") }}
            </p>
          </div>
          <button
            @click="onToggleCursor"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              cursorDisabled ? 'bg-primary' : 'bg-muted',
            ]"
            role="switch"
            :aria-checked="cursorDisabled"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                cursorDisabled ? 'translate-x-6' : 'translate-x-1',
              ]"
            />
          </button>
        </div>

        <!-- Theme Selection -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">{{ t("settings.theme") }}</label>
          <div class="flex gap-2">
            <button
              @click="onSetLightTheme"
              :class="[
                'flex-1 rounded-md border px-4 py-2 text-sm transition-colors',
                theme === 'light'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-accent',
              ]"
            >
              {{ t("settings.light") }}
            </button>
            <button
              @click="onSetDarkTheme"
              :class="[
                'flex-1 rounded-md border px-4 py-2 text-sm transition-colors',
                theme === 'dark'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-accent',
              ]"
            >
              {{ t("settings.dark") }}
            </button>
            <button
              @click="onSetSystemTheme"
              :class="[
                'flex-1 rounded-md border px-4 py-2 text-sm transition-colors',
                theme === 'system'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-accent',
              ]"
            >
              {{ t("settings.system") }}
            </button>
          </div>
        </div>

        <!-- Language Selection -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium">{{
              t("settings.language")
            }}</label>
            <span
              class="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              Beta
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="loc in allLocales"
              :key="loc.code"
              @click="handleLocaleChange(loc.code)"
              :disabled="isSwitchingLocale"
              :class="[
                'rounded-md border px-4 py-2 text-sm transition-colors',
                locale === loc.code
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:bg-accent',
                isSwitchingLocale ? 'opacity-50 cursor-not-allowed' : '',
              ]"
            >
              {{ loc.name }}
            </button>
          </div>
          <p v-if="isSwitchingLocale" class="text-xs text-muted-foreground">
            {{ t("common.loading") }}
          </p>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
