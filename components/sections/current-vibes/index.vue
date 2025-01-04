<script setup lang="ts">
import { onUnmounted } from "vue";
import BlogPostCard from "./BlogPostCard.vue";
import CustomMapCard from "./CustomMapCard.vue";
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
const currentIndex = ref(0);

// Combine all cards into a single array for easier navigation
const allCards = computed(() => [
  { type: "game", data: playing, component: VideoGameCard },
  { type: "music", data: player, component: MusicPlayerCard },
  { type: "blog", data: recentPost, component: BlogPostCard },
  { type: "map", component: CustomMapCard },
  { type: "game", data: last_completed, component: VideoGameCard },
]);

// Handle keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") {
    currentIndex.value =
      (currentIndex.value - 1 + allCards.value.length) % allCards.value.length;
  } else if (e.key === "ArrowRight") {
    currentIndex.value = (currentIndex.value + 1) % allCards.value.length;
  }
};

// Calculate transform styles for each card
const getCardStyle = (index: number) => {
  const diff = index - currentIndex.value;
  const distance = 300; // Distance between cards
  const scale = index === currentIndex.value ? 1.1 : 0.8;
  const zIndex = index === currentIndex.value ? 10 : 0;

  return {
    transform: `translateX(${diff * distance}px) scale(${scale})`,
    zIndex,
    transition: "all 0.5s ease-in-out",
  };
};

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
      updateMetaTitle("Current Vibes | Erbil Nas");
    }
  });
};

// Add these new refs and functions after your existing refs
const touchStartX = ref(0);

const isDragging = ref(false);
const currentTouchX = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  currentTouchX.value = e.touches[0].clientX;
  isDragging.value = true;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  currentTouchX.value = e.touches[0].clientX;
  const diff = currentTouchX.value - touchStartX.value;

  // Update card positions in real-time
  const cards = document.querySelectorAll(".card-container");
  cards.forEach((card, index) => {
    const baseTransform = getCardStyle(index);
    const additionalTransform = `translateX(${diff}px)`;
    (
      card as HTMLElement
    ).style.transform = `${baseTransform.transform} ${additionalTransform}`;
  });
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;

  const swipeThreshold = 50;
  const diff = currentTouchX.value - touchStartX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      currentIndex.value =
        (currentIndex.value - 1 + allCards.value.length) %
        allCards.value.length;
    } else {
      currentIndex.value = (currentIndex.value + 1) % allCards.value.length;
    }
  }

  isDragging.value = false;
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

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

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <section
    id="current-vibes"
    ref="sectionRef"
    class="min-h-screen flex flex-col gap-16 justify-evenly items-center p-4 bg-gradient-to-b from-violet-950 to-red-950"
  >
    <Text3d class="text-6xl md:text-8xl font-bold" shadow-color="black"
      >Current Vibes</Text3d
    >

    <div class="relative w-full max-w-7xl mx-auto overflow-hidden">
      <!-- Navigation arrows - hidden on mobile -->
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all text-white hover:text-primary hidden md:block"
        @click="
          currentIndex = (currentIndex - 1 + allCards.length) % allCards.length
        "
      >
        <Icon name="ph:arrow-left" class="w-12 h-12" />
      </button>

      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-all text-white hover:text-primary hidden md:block"
        @click="currentIndex = (currentIndex + 1) % allCards.length"
      >
        <Icon name="ph:arrow-right" class="w-12 h-12" />
      </button>

      <!-- Cards container with touch handling -->
      <div
        class="relative h-[600px] flex items-center justify-center"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchEnd"
      >
        <!-- Swipe indicator - only visible on mobile -->
        <div
          class="absolute top-4 left-1/2 -translate-x-1/2 z-30 text-white/80 flex items-center gap-2 md:hidden"
        >
          <Icon name="ph:hand-swipe-left" class="w-5 h-5 animate-pulse" />
          <span class="text-sm">Swipe to navigate</span>
        </div>

        <TransitionGroup name="card">
          <div
            v-for="(card, index) in allCards"
            :key="index"
            class="card-container absolute w-[330px] md:w-[400px] transition-all duration-500"
            :style="getCardStyle(index)"
          >
            <component
              :is="card.component"
              v-bind="card.type === 'game'
                ? { game: card.data as SingleGameDetail }
                : card.type === 'music'
                ? { player: card.data as MusicPlayer['player'] }
                : card.type === 'map'
                ? { map: card.data, isActive: index === currentIndex }
                : { post: card.data, isActive: index === currentIndex }"
              class="w-full transform-gpu"
            />
          </div>
        </TransitionGroup>
      </div>

      <!-- Navigation dots -->
      <div class="flex justify-center gap-2 mt-8">
        <button
          v-for="(_, index) in allCards"
          :key="index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="index === currentIndex ? 'bg-primary' : 'bg-white'"
          @click="currentIndex = index"
        />
      </div>
    </div>
  </section>
</template>
