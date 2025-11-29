<script lang="ts" setup>
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { useConfetti } from "@/composables/confetti";
import { useSettings } from "@/composables/settings";

type sections = "welcome" | "about-me" | "career" | "current-vibes";

interface NavigationItem {
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

const { fireConfetti } = useConfetti();
const hasTriggeredConfetti = ref(false);
const { cursorDisabled, toggleCursor, theme, setTheme } = useSettings();
const settingsDialogOpen = ref(false);

// Mouse tracking for DockIcon components
const mouseX = ref(Infinity);
const magnification = 10;
const distance = 140;

function onMouseMove(e: MouseEvent) {
  requestAnimationFrame(() => {
    mouseX.value = e.pageX;
  });
}

function onMouseLeave() {
  mouseX.value = Infinity;
}

provide("mouseX", mouseX);
provide("magnification", magnification);
provide("distance", distance);

const navigationItems = computed<NavigationItem[]>(() => [
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.HandIcon)
    ),
    label: "Welcome",
    action: () => scrollToSection("welcome"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.UserIcon)
    ),
    label: "About Me",
    action: () => scrollToSection("about-me"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.BriefcaseBusinessIcon)
    ),
    label: "Career",
    action: () => scrollToSection("career"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.FerrisWheelIcon)
    ),
    label: "Current Vibes",
    action: () => scrollToSection("current-vibes"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.SettingsIcon)
    ),
    label: "Settings",
    action: () => {
      settingsDialogOpen.value = true;
    },
  },
]);

const scrollToSection = (sectionId: sections) => {
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const checkScrollPosition = () => {
  // Only check if confetti hasn't been triggered yet
  if (hasTriggeredConfetti.value) return;

  const footerElement = document.getElementById("footer");
  if (!footerElement) return;

  // Check if user has scrolled to the very bottom of the page
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  // Only trigger when user is at the absolute bottom (within 5px tolerance)
  const isAtBottom = scrollTop + windowHeight >= documentHeight - 5;

  // Also verify footer is visible in viewport
  const footerRect = footerElement.getBoundingClientRect();
  const isFooterVisible =
    footerRect.top < windowHeight && footerRect.bottom > 0;

  // Only trigger when footer is visible AND user has reached the absolute bottom
  if (isAtBottom && isFooterVisible) {
    hasTriggeredConfetti.value = true;
    fireConfetti();
  }
};

let handleScroll: (() => void) | null = null;

onMounted(() => {
  // Use requestAnimationFrame for smoother performance
  let ticking = false;
  handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScrollPosition();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  if (handleScroll) {
    window.removeEventListener("scroll", handleScroll);
  }
});
</script>

<template>
  <LiquidGlass
    :radius="16"
    container-class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    class="flex h-max w-max items-center rounded-2xl p-2 transition-all gap-4"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <TooltipProvider>
      <Tooltip
        v-for="{ label, action, icon, badge } in navigationItems"
        :key="label"
      >
        <TooltipTrigger>
          <DockIcon @click="action">
            <div class="relative">
              <component :is="icon" class="size-6" />

              <span
                v-if="badge"
                class="absolute -top-1 -right-1 flex h-2 min-w-2 rounded-full bg-primary animate-pulse"
              />
            </div>
          </DockIcon>
        </TooltipTrigger>

        <TooltipContent>
          <div class="flex items-center gap-2">
            <p>{{ label }}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </LiquidGlass>

  <Dialog v-model:open="settingsDialogOpen">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>

      <div class="flex flex-col gap-6 py-4">
        <!-- Custom Cursor Toggle -->
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <label class="text-sm font-medium">Custom Cursor</label>
            <p class="text-xs text-muted-foreground">
              Disable the custom cursor for better accessibility
            </p>
          </div>
          <button
            @click="toggleCursor"
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
              @click="setTheme('light')"
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
              @click="setTheme('dark')"
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
              @click="setTheme('system')"
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
