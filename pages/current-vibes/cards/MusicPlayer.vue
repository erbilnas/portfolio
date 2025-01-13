<script lang="ts" setup>
import {
  Disc3Icon,
  MicVocalIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "lucide-vue-next";
import type { MusicPlayerData } from "~/types/current-vibes";

const props = defineProps<{
  player?: MusicPlayerData;
  isActive?: boolean;
}>();
</script>

<template>
  <div class="relative aspect-[16/9] w-full overflow-hidden">
    <!-- Background Image -->
    <NuxtImg
      v-if="player?.album"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      :src="player.album.image"
      quality="100"
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
        <!-- Play Status -->
        <div
          class="flex items-center gap-3 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          <div class="relative w-16 h-16">
            <svg class="w-full h-full animate-[spin_3s_linear_infinite]">
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
                stroke-dasharray="44 176"
              />
            </svg>
            <div
              class="absolute inset-0 flex items-center justify-center text-white"
            >
              <PlayCircleIcon v-if="player?.name" class="h-8 w-8" />
              <PauseCircleIcon v-else class="h-8 w-8" />
            </div>
          </div>
          <div class="px-3 py-1 text-sm text-white/90">
            {{ player?.name ? "Now Playing" : "Paused" }}
          </div>
        </div>

        <!-- Music Service -->
        <div
          class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full"
        >
          <Icon name="simple-icons:spotify" class="h-4 w-4 text-white/80" />
          <span class="text-sm text-white/90">Spotify</span>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-white">
          {{ player?.name || "No song is currently playing" }}
        </h2>

        <div class="flex items-center gap-4 mt-4">
          <div
            v-if="player?.artist"
            class="flex items-center gap-2 text-white/80"
          >
            <MicVocalIcon class="h-4 w-4" />
            <span class="text-sm">{{ player.artist }}</span>
          </div>

          <div
            v-if="player?.album?.name"
            class="flex items-center gap-2 text-white/80"
          >
            <Disc3Icon class="h-4 w-4" />
            <span class="text-sm">{{ player.album.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
