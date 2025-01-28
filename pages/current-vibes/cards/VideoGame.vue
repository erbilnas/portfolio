<script lang="ts" setup>
import {
  ClockIcon,
  ExternalLinkIcon,
  Gamepad2Icon,
  ShoppingBagIcon,
} from "lucide-vue-next";
import { computed } from "vue";
import type { SingleGameDetail } from "~/types/current-vibes";

const props = defineProps<{
  game: SingleGameDetail;
  isActive?: boolean;
}>();

const { socialLinks } = useAppConfig();

const { navigateTo } = useExternalNavigate();

const progressPercentage = computed(() => {
  if (!props.game?.progress || !props.game?.completion_time) return 0;
  const hours = parseFloat(props.game.progress);
  return Math.min(Math.round((hours / props.game.completion_time) * 100), 100);
});

const getStatusText = () => {
  if (!props.game?.status) return "Status Unknown";
  return props.game.status === "playing"
    ? "Currently Playing"
    : "Recently Completed";
};
</script>

<template>
  <div v-if="game" class="relative aspect-[16/9] w-full overflow-hidden">
    <!-- Background Image -->
    <NuxtImg
      v-if="game.image"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      :src="game.image"
      quality="100"
      alt="Video Game Card Background"
      loading="lazy"
      format="webp"
    />
    <div v-else class="absolute inset-0 bg-gray-800"></div>

    <!-- Overlay Gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
    ></div>

    <!-- Content -->
    <div class="absolute inset-0 p-6 flex flex-col justify-between">
      <!-- Top Section -->
      <div
        class="flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0"
      >
        <!-- Progress Circle -->
        <div
          class="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          <div class="relative w-16 h-16">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="4"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.9)"
                stroke-width="4"
                fill="none"
                :stroke-dasharray="`${progressPercentage * 1.76} 176`"
              />
            </svg>
            <span
              class="absolute inset-0 flex items-center justify-center text-white font-medium"
            >
              {{ progressPercentage }}%
            </span>
          </div>
          <div class="px-3 py-1 text-sm text-white/90">
            {{ getStatusText() }}
          </div>
        </div>

        <!-- Platform Info -->
        <div
          class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          <Gamepad2Icon class="h-4 w-4 text-white/80" />
          <span class="text-sm text-white/90">{{ game.platform }}</span>

          <!-- External Link Button -->
          <Button
            v-if="isActive"
            @click="navigateTo(socialLinks.howlongtobeat)"
            class="flex items-center gap-2 bg-foreground backdrop-blur-sm px-3 py-1 rounded-full hover:bg-transparent text-black hover:text-foreground transition-colors"
          >
            <ExternalLinkIcon class="h-4 w-4" />
            <span class="text-sm">My Backlog</span>
          </Button>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-white">{{ game.title }}</h2>
        <p class="text-sm text-white/80 line-clamp-2">{{ game.description }}</p>

        <div class="flex items-center gap-4 mt-4">
          <div class="flex items-center gap-2 text-white/80">
            <ClockIcon class="h-4 w-4" />
            <span class="text-sm">{{ game.progress }} hours</span>
          </div>

          <div
            v-if="game.storefront"
            class="flex items-center gap-2 text-white/80"
          >
            <ShoppingBagIcon class="h-4 w-4" />
            <span class="text-sm">{{ game.storefront }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="relative aspect-[16/9] w-full overflow-hidden bg-gray-800 flex items-center justify-center"
  >
    <p class="text-white/80">Game data unavailable</p>
  </div>
</template>
