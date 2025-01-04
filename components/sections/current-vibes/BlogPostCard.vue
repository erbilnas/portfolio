<script lang="ts" setup>
import { CalendarIcon } from "lucide-vue-next"

interface MediumPost {
  title: string;
  link: string;
  published_at: string;
  description: string;
}

const props = defineProps<{ post: MediumPost }>();

const { title, link, published_at, description } = props.post;

const navigateTo = (link: string) => {
  window.open(link, "_blank");
};
</script>

<template>
  <div
    class="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-b from-violet-950 to-slate-900 px-4 py-8 shadow-xl"
  >
    <h3 class="relative z-50 mb-4 text-base font-normal text-gray-300">
      Recent Post
    </h3>

    <h1 class="relative z-50 mb-4 text-xl font-bold text-white">
      {{ title }}
    </h1>

    <div class="flex items-center gap-2 content-center justify-center mb-4">
      <CalendarIcon class="size-4 text-gray-300" />

      <p class="relative z-50 text-base font-normal text-gray-300">
        {{
          new Date(published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
        }}
      </p>
    </div>

    <InteractiveHoverButton
      class="w-40"
      text="Read Now"
      @click="navigateTo(link)"
    />

    <Meteors />
  </div>
</template>

<style scoped></style>
