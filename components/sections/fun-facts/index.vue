<script setup lang="ts">
import { onUnmounted } from "vue";
import MusicPlayerCard from "./MusicPlayerCard.vue";
import VideoGameCard from "./VideoGameCard.vue";

interface MediumPost {
  title: string;
  link: string;
  published_at: string;
  description: string;
}

interface SingleGameDetail {
  image: string;
  title: string;
  platform: string;
  progress: string;
  description: string;
  storefront: string;
  status: "playing" | "completed";
}

interface GameDetails {
  playing: SingleGameDetail;
  last_completed: SingleGameDetail;
}

interface MusicPlayer {
  player: {
    album: {
      name: string;
      image: string;
    };
    artist: string;
    name: string;
    is_playing: boolean;
  };
}

const sectionRef = ref<HTMLElement | null>(null);

const { playing, last_completed } = await $fetch<GameDetails>(
  "/api/video-games"
);
const recentPost = await $fetch<MediumPost>("/api/blog");

const { player } = await $fetch<MusicPlayer>("/api/music");

const updateMetaTitle = (title: string) => {
  useHead({
    title,
  });
};

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateMetaTitle("Fun Facts | Erbil Nas");
    }
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });
});
</script>

<template>
  <section
    id="fun-facts"
    ref="sectionRef"
    class="min-h-screen flex flex-col gap-16 justify-evenly items-center p-4 bg-gradient-to-b from-violet-950 to-red-950"
  >
    <Text3d class="text-9xl font-bold" shadow-color="black">Fun Facts</Text3d>

    <div class="max-w-7xl mx-auto w-full">
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4 w-full"
      >
        <VideoGameCard :game="playing" class="w-full" />
        <VideoGameCard :game="last_completed" class="w-full" />
        <MusicPlayerCard
          :player="player"
          class="w-full md:col-span-2 lg:col-span-1"
        />
      </div>
    </div>
  </section>
</template>
