<script lang="ts" setup>
import { useConfetti } from "@/composables/confetti";

type sections = "welcome" | "about-me" | "career" | "current-vibes";

interface NavigationItem {
  icon: Component;
  label: string;
  action: () => void;
  badge?: boolean;
}

const { fireConfetti } = useConfetti();

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
      import("lucide-vue-next").then((m) => m.PartyPopperIcon)
    ),
    label: "Confetti",
    action: () => fireConfetti(),
    badge: true,
  },
]);

const scrollToSection = (sectionId: sections) => {
  const element = document.getElementById(sectionId);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<template>
  <div class="fixed bottom-8 left-0 right-0">
    <Dock :magnification="10" :dock-size="0">
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
    </Dock>
  </div>
</template>
