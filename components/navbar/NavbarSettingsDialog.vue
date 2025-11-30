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

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit("update:open", value),
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 py-4">
        <!-- Custom Cursor Toggle -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Disable Custom Cursor</label>
            <p class="text-xs text-muted-foreground">
              Disable the custom cursor for better accessibility
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
          <label class="text-sm font-medium">Theme</label>
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
              Light
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
              Dark
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
              System
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

