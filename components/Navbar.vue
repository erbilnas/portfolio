<script lang="ts" setup>
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { useConfetti } from "@/composables/confetti";
import { useSettings } from "@/composables/settings";
import { useMediaQuery } from "@/composables/use-media-query-client";
import { nextTick } from "vue";

type sections =
  | "welcome"
  | "about-me"
  | "skills"
  | "experience"
  | "projects"
  | "current-vibes";

interface NavigationItem {
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

const { fireConfetti } = useConfetti();
const hasTriggeredConfetti = ref(false);
const settingsDialogOpen = ref(false);

// Lazy load settings to avoid initialization order issues
let settingsComposable: ReturnType<typeof useSettings> | null = null;
const cursorDisabled = ref(false);
const theme = ref<"light" | "dark" | "system">("dark");
let toggleCursor: (() => void) | null = null;
let setTheme: ((theme: "light" | "dark" | "system") => void) | null = null;

// Initialize settings after mount to avoid initialization order issues
const initializeSettings = () => {
  if (!settingsComposable && process.client) {
    try {
      settingsComposable = useSettings();
      // Sync initial values
      cursorDisabled.value = settingsComposable.cursorDisabled.value;
      theme.value = settingsComposable.theme.value;
      toggleCursor = settingsComposable.toggleCursor;
      setTheme = settingsComposable.setTheme;

      // Watch for changes
      watch(settingsComposable.cursorDisabled, (newValue) => {
        cursorDisabled.value = newValue;
      });
      watch(settingsComposable.theme, (newValue) => {
        theme.value = newValue;
      });
    } catch (error) {
      console.warn("Settings not ready yet:", error);
    }
  }
  return settingsComposable;
};

// Mobile detection - show navbar only on scroll up
const isMobile = useMediaQuery("(max-width: 768px)");
const navbarVisible = ref(true);
const lastScrollY = ref(0);

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
      import("lucide-vue-next").then((m) => m.CodeIcon)
    ),
    label: "Skills",
    action: () => scrollToSection("skills"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.BriefcaseIcon)
    ),
    label: "Experience",
    action: () => scrollToSection("experience"),
  },
  {
    icon: defineAsyncComponent(() =>
      import("lucide-vue-next").then((m) => m.FolderKanbanIcon)
    ),
    label: "Projects",
    action: () => scrollToSection("projects"),
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
  // Function to perform the scroll
  const performScroll = () => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get the element's position
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 20; // 20px offset for spacing

      // Smooth scroll to the element
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      return true;
    }
    return false;
  };

  // Try immediately
  if (performScroll()) {
    return;
  }

  // If not found, wait for next tick (for Vue reactivity)
  nextTick(() => {
    if (performScroll()) {
      return;
    }

    // If still not found, retry with increasing delays (for async components)
    let retryCount = 0;
    const maxRetries = 10;
    const retryInterval = 100;

    const retryScroll = setInterval(() => {
      if (performScroll() || retryCount >= maxRetries) {
        clearInterval(retryScroll);
      }
      retryCount++;
    }, retryInterval);
  });
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

const handleScrollDirection = () => {
  // Only apply scroll-based visibility on mobile
  if (!isMobile.value) {
    navbarVisible.value = true;
    return;
  }

  const currentScrollY =
    window.pageYOffset || document.documentElement.scrollTop;

  // Show navbar when scrolling up, hide when scrolling down
  // Also show at the top of the page
  if (currentScrollY < lastScrollY.value || currentScrollY < 10) {
    navbarVisible.value = true;
  } else if (currentScrollY > lastScrollY.value) {
    navbarVisible.value = false;
  }

  lastScrollY.value = currentScrollY;
};

let handleScroll: (() => void) | null = null;

onMounted(() => {
  // Initialize settings after mount to avoid initialization order issues
  initializeSettings();

  lastScrollY.value = window.pageYOffset || document.documentElement.scrollTop;

  // Use requestAnimationFrame for smoother performance
  let ticking = false;
  handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScrollPosition();
        handleScrollDirection();
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
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="translate-y-[calc(100%+2rem)] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-[calc(100%+2rem)] opacity-0"
  >
    <LiquidGlass
      v-if="!isMobile || navbarVisible"
      :radius="20"
      container-class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      class="flex h-max w-max items-center rounded-3xl p-3 transition-all gap-3 backdrop-blur-xl bg-white/80 dark:bg-black/80 border border-gray-200/50 dark:border-gray-800/50"
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
  </Transition>

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
            @click="toggleCursor || (() => {})"
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
              @click="setTheme ? setTheme('light') : undefined"
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
              @click="setTheme ? setTheme('dark') : undefined"
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
              @click="setTheme ? setTheme('system') : undefined"
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
