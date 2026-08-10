<script lang="ts" setup>
import { useI18n } from "#imports";
import { DockIcon } from "@/components/ui/dock";
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavbarVibesPreview } from "@/composables/navbar";
import { useSettings } from "@/composables/settings";
import NavbarVibesDockMark from "./NavbarVibesDockMark.vue";
import NavbarVibesPreviewBlock from "./NavbarVibesPreviewBlock.vue";
import type { NavigationItem } from "./navbar.types";

interface Props {
  navigationItems: NavigationItem[];
}

defineProps<Props>();

const { t } = useI18n();
const { preview: vibesPreview } = useNavbarVibesPreview();
const { reducedMotion } = useSettings();

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
          v-for="{ label, action, icon, badge, id } in navigationItems"
          :key="label"
        >
          <TooltipTrigger>
            <DockIcon @click="action">
              <div class="relative">
                <component :is="icon" class="size-6" />

                <span
                  v-if="badge"
                  class="absolute -top-0.5 -right-0.5 flex h-3 w-3 rounded-full bg-primary border-2 border-background animate-pulse shadow-lg"
                />
                <NavbarVibesDockMark
                  v-else-if="id === 'current-vibes' && vibesPreview"
                  :preview="vibesPreview"
                />
              </div>
            </DockIcon>
          </TooltipTrigger>

          <TooltipContent class="max-w-[18rem]">
            <div class="flex flex-col gap-2">
              <p>{{ label }}</p>
              <p v-if="id === 'settings'" class="text-xs text-muted-foreground">
                {{ t("nav.multipleLanguagesSupported") }}
              </p>
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
                  v-if="id === 'current-vibes' && vibesPreview"
                  :key="`${vibesPreview.kind}-${vibesPreview.title}`"
                  class="border-t border-border/60 pt-2"
                >
                  <NavbarVibesPreviewBlock :preview="vibesPreview" />
                </div>
              </Transition>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </LiquidGlass>
  </Transition>
</template>
