<script lang="ts" setup>
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { DockIcon } from "@/components/ui/dock";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavigationItem } from "./navbar.types";

interface Props {
  navigationItems: NavigationItem[];
}

defineProps<Props>();

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
</template>

