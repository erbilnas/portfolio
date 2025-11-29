<script lang="ts" setup>
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { useConfetti } from "@/composables/confetti";

type sections = "welcome" | "about-me" | "career" | "current-vibes";

interface NavigationItem {
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

const { fireConfetti } = useConfetti();
const hasTriggeredConfetti = ref(false);

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
</template>
