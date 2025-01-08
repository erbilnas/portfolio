<script lang="ts" setup>
import { ClockIcon, Gamepad2Icon, GamepadIcon } from "lucide-vue-next";

interface SingleGameDetail {
  image: string;
  title: string;
  platform: string;
  progress: string;
  description: string;
  storefront: string;
  status: "playing" | "completed";
}

const props = defineProps<{
  game: SingleGameDetail;
}>();

const { image, title, platform, progress, description, storefront, status } =
  props.game;

const getStatusText = () => {
  return status === "playing" ? "Currently Playing" : "Recently Completed";
};
</script>

<template>
  <GlareCard>
    <div class="absolute inset-0">
      <NuxtImg class="size-full object-cover" :src="image" quality="100" />
    </div>

    <div
      class="relative z-10 p-8 text-white bg-black/50 backdrop-blur-sm h-full"
    >
      <div class="space-y-4">
        <div class="space-y-1">
          <h3 class="text-l font-semibold">{{ getStatusText() }}</h3>
          <h2 class="text-2xl font-bold">{{ title }}</h2>
        </div>

        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Gamepad2Icon class="h-4 w-4" />
            <span class="text-sm">{{ platform }}</span>

            <span class="text-sm">|</span>

            <GamepadIcon class="h-4 w-4" />
            <span class="text-sm">{{ storefront || "-" }}</span>
          </div>

          <div class="flex items-center gap-2">
            <ClockIcon class="h-4 w-4" />
            <span class="text-sm">{{ progress }} hours played</span>
          </div>

          <p class="text-sm text-white/80">{{ description }}</p>
        </div>
      </div>
    </div>
  </GlareCard>
</template>
