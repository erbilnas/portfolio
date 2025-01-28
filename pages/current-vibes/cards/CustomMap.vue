<script lang="ts" setup>
import { ExternalLinkIcon, MapPinIcon } from "lucide-vue-next";

const { maps } = useAppConfig();

const { navigateTo } = useExternalNavigate();

const props = defineProps<{
  isActive?: boolean;
}>();

const visitedCountries = 7;
const visitedCities = 55;

const totalCountries = 195;

const completionPercentage = Math.round(
  (visitedCountries / totalCountries) * 100
);
</script>

<template>
  <div class="relative aspect-[16/9] w-full overflow-hidden">
    <!-- Background Image -->
    <NuxtImg
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      src="/images/map-card-bg.jpg"
      quality="100"
      alt="Map Card Background"
      loading="lazy"
      format="webp"
    />

    <!-- Overlay Gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
    ></div>

    <!-- Content -->
    <div class="absolute inset-0 p-6 flex flex-col justify-between">
      <!-- Top Section -->
      <div
        class="flex justify-between items-start flex-col md:flex-row gap-4 md:gap-0"
      >
        <!-- Completion Circle -->
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
                :stroke-dasharray="`${completionPercentage * 1.76} 176`"
              />
            </svg>
            <span
              class="absolute inset-0 flex items-center justify-center text-white font-medium"
            >
              {{ completionPercentage }}%
            </span>
          </div>
          <div class="px-3 py-1 text-sm text-white/90">World Map</div>
        </div>

        <!-- Map Stats -->
        <div
          class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          <MapPinIcon class="h-4 w-4 text-white/80" />
          <span class="text-sm text-white/90">{{ visitedCities }} Cities</span>

          <Separator orientation="vertical" class="h-3 bg-muted-foreground" />

          <span class="text-sm text-white/90"
            >{{ visitedCountries }} Countries</span
          >
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="space-y-2 mt-4">
        <h2 class="text-3xl font-bold text-white">Places I've Been</h2>
        <div class="flex items-center justify-between">
          <p class="text-sm text-white/80">
            Exploring the world, one country at a time!
          </p>

          <Button
            v-if="isActive"
            @click="navigateTo(maps.placesBeen)"
            class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <ExternalLinkIcon class="h-4 w-4 text-white/80" />
            <span class="text-sm text-white/90">View Map</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
circle {
  transition: stroke-dasharray 0.5s ease;
}
</style>
