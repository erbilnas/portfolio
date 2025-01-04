<script lang="ts" setup>
import { CalendarIcon } from "lucide-vue-next"
import { computed } from "vue"

interface MediumPost {
  title: string;
  link: string;
  published_at: string;
  description: string;
}

const props = defineProps<{
  post: MediumPost;
  isActive?: boolean;
}>();

const { title, link, published_at, description } = props.post;

const truncatedDescription = computed(() => {
  const maxLength = 500;
  // Remove HTML tags using regex
  const strippedText = description.replace(/<[^>]*>/g, "");

  if (strippedText.length <= maxLength) return strippedText;
  return strippedText.slice(0, maxLength) + "...";
});

const navigateTo = (link: string) => {
  window.open(link, "_blank");
};
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <GlareCard>
      <div class="absolute inset-0">
        <NuxtImg
          class="size-full object-cover"
          src="/images/blog-post-card-bg.jpg"
          quality="100"
        />
      </div>
      <div
        class="relative z-10 p-8 text-white bg-black/50 backdrop-blur-sm h-full"
      >
        <div class="space-y-4">
          <div class="space-y-1">
            <h3 class="text-l font-semibold">Recent Blog Post</h3>
            <h2 class="text-2xl font-bold">{{ title }}</h2>
          </div>

          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <CalendarIcon class="h-4 w-4" />

              <span class="text-sm">{{
                new Date(published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              }}</span>
            </div>
          </div>

          <p class="text-sm text-white/80 line-clamp-3">
            {{ truncatedDescription }}
          </p>
        </div>
      </div>
    </GlareCard>

    <InteractiveHoverButton
      v-show="isActive"
      class="w-48 text-center"
      text="Read Now"
      @click="navigateTo(link)"
    />
  </div>
</template>

<style scoped></style>
