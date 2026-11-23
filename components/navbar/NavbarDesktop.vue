<script lang="ts" setup>
import { useActiveNavSection } from "#imports";
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavbarVibesPreview } from "@/composables/navbar";
import { useSettings } from "@/composables/settings";
import { cn } from "@/lib/utils";
import NavbarVibesDockMark from "./NavbarVibesDockMark.vue";
import NavbarVibesPreviewBlock from "./NavbarVibesPreviewBlock.vue";
import type { NavigationItem } from "./navbar.types";

interface Props {
  navigationItems: NavigationItem[];
}

const props = defineProps<Props>();

const { preview: vibesPreview } = useNavbarVibesPreview();
const { reducedMotion } = useSettings();
const activeNavSection = useActiveNavSection();

const UTILITY_IDS = new Set(["resume", "settings"]);

const primaryItems = computed(() =>
  props.navigationItems.filter((item) => !item.id || !UTILITY_IDS.has(item.id)),
);

const utilityItems = computed(() =>
  props.navigationItems.filter((item) => item.id && UTILITY_IDS.has(item.id)),
);

const getAriaLabel = (item: NavigationItem) => {
  if (item.id === "current-vibes" && vibesPreview.value) {
    const live = vibesPreview.value.isLive ? "Live · " : "";
    return `${item.label}: ${live}${vibesPreview.value.category} ${vibesPreview.value.title}`;
  }
  return item.label;
};

const isActive = (item: NavigationItem) =>
  Boolean(item.id && item.id === activeNavSection.value);

const itemButtonClass = (item: NavigationItem) =>
  cn(
    "relative flex size-10 items-center justify-center rounded-[12px] text-neutral-500 transition-colors duration-150 ease-out",
    "hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
    "dark:text-neutral-400 dark:hover:text-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black",
    isActive(item) &&
      "bg-neutral-950/[0.07] text-neutral-950 dark:bg-white/[0.12] dark:text-white",
  );
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    leave-active-class="transition duration-300 ease-in"
    enter-from-class="translate-y-[calc(100%+2rem)] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-[calc(100%+2rem)] opacity-0"
  >
    <LiquidGlass
      :radius="22"
      :frost="0.1"
      :border="0.05"
      container-class="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
      class="flex h-max w-max items-center rounded-[22px] p-1.5"
    >
      <TooltipProvider :delay-duration="200">
        <nav
          class="flex items-center gap-0.5"
          aria-label="Primary"
        >
          <Tooltip
            v-for="item in primaryItems"
            :key="item.id ?? item.label"
          >
            <TooltipTrigger
              :class="itemButtonClass(item)"
              :aria-label="getAriaLabel(item)"
              :aria-current="isActive(item) ? 'true' : undefined"
              @click="item.action"
            >
              <span class="relative inline-flex">
                <component
                  :is="item.icon"
                  class="size-[18px]"
                  :stroke-width="1.75"
                  aria-hidden="true"
                />
                <span
                  v-if="item.badge"
                  class="absolute -right-1 -top-1 size-1.5 rounded-full bg-neutral-950 dark:bg-white"
                  aria-hidden="true"
                />
                <NavbarVibesDockMark
                  v-else-if="item.id === 'current-vibes' && vibesPreview"
                  :preview="vibesPreview"
                />
              </span>
            </TooltipTrigger>

            <TooltipContent class="max-w-[18rem]">
              <div class="flex flex-col gap-2">
                <p class="text-sm font-medium">{{ item.label }}</p>
                <Transition
                  mode="out-in"
                  :enter-active-class="
                    reducedMotion ? '' : 'transition duration-200 ease-out'
                  "
                  :enter-from-class="
                    reducedMotion ? '' : 'opacity-0 translate-y-1'
                  "
                  :enter-to-class="
                    reducedMotion ? '' : 'opacity-100 translate-y-0'
                  "
                  :leave-active-class="
                    reducedMotion ? '' : 'transition duration-150 ease-in'
                  "
                  :leave-from-class="
                    reducedMotion ? '' : 'opacity-100 translate-y-0'
                  "
                  :leave-to-class="
                    reducedMotion ? '' : 'opacity-0 -translate-y-0.5'
                  "
                >
                  <div
                    v-if="item.id === 'current-vibes' && vibesPreview"
                    :key="`${vibesPreview.kind}-${vibesPreview.title}`"
                    class="border-t border-border/60 pt-2"
                  >
                    <NavbarVibesPreviewBlock :preview="vibesPreview" />
                  </div>
                </Transition>
              </div>
            </TooltipContent>
          </Tooltip>

          <span
            class="mx-1 h-5 w-px shrink-0 bg-neutral-950/10 dark:bg-white/15"
            aria-hidden="true"
          />

          <Tooltip
            v-for="item in utilityItems"
            :key="item.id ?? item.label"
          >
            <TooltipTrigger
              :class="itemButtonClass(item)"
              :aria-label="getAriaLabel(item)"
              @click="item.action"
            >
              <component
                :is="item.icon"
                class="size-[18px]"
                :stroke-width="1.75"
                aria-hidden="true"
              />
            </TooltipTrigger>

            <TooltipContent>
              <p class="text-sm font-medium">{{ item.label }}</p>
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </LiquidGlass>
  </Transition>
</template>
