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
import { MusicIcon } from "lucide-vue-next";
import type { MusicPlayer } from "~/types/current-vibes";
import type { NavigationItem } from "./navbar.types";

interface Props {
  navigationItems: NavigationItem[];
}

defineProps<Props>();

const { t } = useI18n();

// Fetch music data for tooltip
const { data: musicData } = useFetch<MusicPlayer>("/api/music");

// Format music info for display
const musicInfo = computed(() => {
  const player = musicData.value?.player;
  // Check if music is playing by checking if player data exists
  if (!player?.name || !player?.artist) return null;
  return `${player.name} - ${player.artist}`;
});

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
              </div>
            </DockIcon>
          </TooltipTrigger>

          <TooltipContent>
            <div class="flex flex-col gap-1">
              <p>{{ label }}</p>
              <p v-if="id === 'settings'" class="text-xs text-muted-foreground">
                {{ t("nav.multipleLanguagesSupported") }}
              </p>
              <div
                v-if="id === 'current-vibes' && musicInfo"
                class="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <MusicIcon class="h-3 w-3" />
                <span>{{ musicInfo }}</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </LiquidGlass>
  </Transition>
</template>
