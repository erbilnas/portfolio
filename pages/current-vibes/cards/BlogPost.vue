<script lang="ts" setup>
import { BookOpenIcon, CalendarIcon, ExternalLinkIcon } from "lucide-vue-next";
import { computed } from "vue";
import type { MediumPost } from "~/types/current-vibes";

const props = defineProps<{
  post?: MediumPost;
  isActive?: boolean;
}>();

const { navigateTo } = useExternalNavigate();

const truncatedDescription = computed(() => {
  if (!props.post?.description) return "";

  const maxLength = 200;
  const strippedText = props.post.description.replace(/<[^>]*>/g, "");

  return strippedText.length <= maxLength
    ? strippedText
    : strippedText.slice(0, maxLength) + "...";
});

const formattedDate = computed(() => {
  if (!props.post?.published_at) return "";

  return new Date(props.post.published_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

const readTimeMinutes = computed(() => {
  if (!props.post?.description) return 0;

  const wordsPerMinute = 200;
  const strippedHtml = props.post.description.replace(/<[^>]*>/g, "");
  const cleanText = strippedHtml
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = cleanText
    .split(" ")
    .filter((word) => word.length > 0).length;

  return Math.ceil(wordCount / wordsPerMinute);
});
</script>

<template>
  <div v-if="props.post" class="relative aspect-[16/9] w-full overflow-hidden">
    <!-- Background Image -->
    <NuxtImg
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      src="/images/blog-post-card-bg.jpg"
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
        <!-- Read Time Circle -->
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
                stroke-dasharray="176 176"
              />
            </svg>
            <span
              class="absolute inset-0 flex items-center justify-center text-white font-medium text-sm"
            >
              {{ readTimeMinutes }}m
            </span>
          </div>
          <div class="px-3 py-1 text-sm text-white/90">Latest Blog Post</div>
        </div>

        <!-- External Link Button -->
        <Button
          v-if="isActive"
          @click="navigateTo(props.post.link)"
          class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <ExternalLinkIcon class="h-4 w-4 text-white/80" />
          <span class="text-sm text-white/90">Read Now</span>
        </Button>
      </div>

      <!-- Bottom Section -->
      <div class="space-y-2">
        <h2 class="text-3xl font-bold text-white">{{ props.post.title }}</h2>
        <p class="text-sm text-white/80 line-clamp-2">
          {{ truncatedDescription }}
        </p>

        <div class="flex items-center gap-4 mt-4">
          <div class="flex items-center gap-2 text-white/80">
            <CalendarIcon class="h-4 w-4" />
            <span class="text-sm">{{ formattedDate }}</span>
          </div>

          <div class="flex items-center gap-2 text-white/80">
            <BookOpenIcon class="h-4 w-4" />
            <span class="text-sm">{{ readTimeMinutes }} min read</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
