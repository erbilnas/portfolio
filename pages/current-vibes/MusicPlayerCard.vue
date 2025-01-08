<script lang="ts" setup>
import { Disc3Icon, MicVocalIcon } from "lucide-vue-next";

interface MusicPlayer {
  album: {
    name: string;
    image: string;
  };
  artist: string;
  name: string;
  is_playing: boolean;
}

defineProps<{
  player?: MusicPlayer;
}>();
</script>

<template>
  <GlareCard>
    <div v-if="player?.album" class="absolute inset-0">
      <NuxtImg
        class="size-full object-cover"
        :src="player.album.image"
        quality="100"
      />
    </div>

    <div
      class="relative z-10 p-8 text-white bg-black/50 backdrop-blur-sm h-full"
    >
      <div class="space-y-4">
        <div class="space-y-1">
          <h3 class="text-l font-semibold">Listening Now</h3>
          <h2 class="text-2xl font-bold">
            {{ player?.name || "No song is currently playing." }}
          </h2>
        </div>

        <div class="space-y-2">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2" v-if="player?.artist">
              <MicVocalIcon class="h-4 w-4" />
              <span class="text-sm">{{ player?.artist || "-" }}</span>
            </div>

            <div class="flex items-center gap-2" v-if="player?.album?.name">
              <Disc3Icon class="h-4 w-4" />
              <span class="text-sm">{{ player?.album?.name || "-" }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </GlareCard>
</template>

<style scoped></style>
