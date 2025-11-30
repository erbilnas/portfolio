<script setup lang="ts">
import {
  BookOpenIcon,
  CalendarIcon,
  ClockIcon,
  Disc3Icon,
  ExternalLinkIcon,
  Gamepad2Icon,
  GlobeIcon,
  MapPinIcon,
  MicVocalIcon,
} from "lucide-vue-next";
import { AppleBlurImage } from "~/components/ui/apple-card-carousel";
import type { CardMetadata } from "~/composables/current-vibes/cards-metadata";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";

interface Props {
  card: CardData;
  index: number;
  metadata: CardMetadata;
  contrastClass?: string;
  isLight?: boolean;
  isDragging: boolean;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :class="[
      'group relative z-10 flex h-[calc(100vh-14rem)] max-h-[calc(100vh-14rem)] min-h-[32rem] flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[48rem] dark:bg-neutral-900 transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent snap-center flex-shrink-0 w-[calc(100vw-5rem)] md:w-[32rem]',
      isDragging ? 'cursor-grabbing' : 'cursor-grab',
    ]"
    tabindex="0"
  >
    <AppleBlurImage
      :src="metadata.src"
      :alt="metadata.title"
      class="absolute inset-0 z-10 object-cover transition-all duration-500 blur-md group-hover:blur-none group-focus-within:blur-none group-hover:scale-110 group-focus-within:scale-110"
      :fill="true"
    />

    <!-- Visit Link Button -->
    <a
      v-if="metadata.visitUrl"
      :href="metadata.visitUrl"
      target="_blank"
      rel="noopener noreferrer"
      :class="[
        'absolute top-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-2 transition-all duration-300 backdrop-blur-sm shadow-lg',
        isLight
          ? 'bg-white/90 text-gray-900 hover:bg-white'
          : 'bg-black/70 text-white hover:bg-black/90',
      ]"
      @click.stop
    >
      <ExternalLinkIcon class="h-5 w-5" />
      <span class="text-sm font-medium whitespace-nowrap">Visit</span>
    </a>

    <!-- Top gradient overlay -->
    <div
      :class="[
        'pointer-events-none absolute inset-x-0 top-0 z-30 h-full transition-opacity duration-300 group-hover:opacity-50 group-focus-within:opacity-50',
        isLight
          ? 'bg-gradient-to-b from-white/60 via-white/20 to-transparent'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
      ]"
    />

    <!-- Bottom gradient overlay for text area -->
    <div
      :class="[
        'pointer-events-none absolute inset-x-0 bottom-0 z-35 h-1/2 transition-opacity duration-300 group-hover:opacity-70 group-focus-within:opacity-70',
        isLight
          ? 'bg-gradient-to-t from-white/90 via-white/60 to-transparent'
          : 'bg-gradient-to-t from-black/90 via-black/60 to-transparent',
      ]"
    />

    <!-- Content -->
    <div class="relative z-40 p-8 flex flex-col h-full justify-end gap-4">
      <div>
        <div
          :class="[
            'text-left font-sans text-sm font-medium drop-shadow-lg md:text-base mb-2',
            contrastClass || 'text-white',
          ]"
        >
          {{ metadata.category }}
        </div>
        <div
          :class="[
            'mt-2 max-w-xs text-left font-sans text-xl font-semibold drop-shadow-lg [text-wrap:balance] md:text-3xl',
            contrastClass || 'text-white',
          ]"
        >
          {{ metadata.title }}
        </div>
      </div>

      <!-- Additional Details -->
      <div
        :class="[
          'flex flex-col gap-2 text-sm drop-shadow-md',
          isLight ? 'text-gray-900' : 'text-white',
        ]"
      >
        <!-- Game Details -->
        <template v-if="card.type === 'game'">
          <div v-if="metadata.progress" class="flex items-center gap-2">
            <ClockIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.progress }} hours</span>
          </div>
          <div v-if="metadata.platform" class="flex items-center gap-2">
            <Gamepad2Icon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.platform }}</span>
          </div>
          <div
            v-if="metadata.description"
            :class="[
              'line-clamp-2 mt-1 drop-shadow-sm',
              isLight ? 'text-gray-800' : 'text-white/95',
            ]"
          >
            {{ metadata.description }}
          </div>
        </template>

        <!-- Music Details -->
        <template v-if="card.type === 'music'">
          <div v-if="metadata.artist" class="flex items-center gap-2">
            <MicVocalIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.artist }}</span>
          </div>
          <div v-if="metadata.album" class="flex items-center gap-2">
            <Disc3Icon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.album }}</span>
          </div>
        </template>

        <!-- Blog Details -->
        <template v-if="card.type === 'blog'">
          <div v-if="metadata.publishedDate" class="flex items-center gap-2">
            <CalendarIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.publishedDate }}</span>
          </div>
          <div v-if="metadata.readTime" class="flex items-center gap-2">
            <BookOpenIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.readTime }} min read</span>
          </div>
          <div
            v-if="metadata.description"
            :class="[
              'line-clamp-2 mt-1 drop-shadow-sm',
              isLight ? 'text-gray-800' : 'text-white/95',
            ]"
          >
            {{ metadata.description }}
          </div>
        </template>

        <!-- Map Details -->
        <template v-if="card.type === 'map'">
          <div class="flex items-center gap-2">
            <MapPinIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.cities }} Cities</span>
            <span :class="[isLight ? 'text-gray-600' : 'text-white/60']">
              •
            </span>
            <span>{{ metadata.countries }} Countries</span>
            <span :class="[isLight ? 'text-gray-600' : 'text-white/60']">
              •
            </span>
            <GlobeIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.completionPercentage }}%</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
