<script setup lang="ts">
import { useI18n } from "#imports";
import {
  BarChart3Icon,
  BookOpenIcon,
  CalendarIcon,
  CircleAlertIcon,
  ClockIcon,
  Disc3Icon,
  ExternalLinkIcon,
  FilmIcon,
  FlagIcon,
  FolderOpenIcon,
  Gamepad2Icon,
  GitCommitIcon,
  GitPullRequestIcon,
  GlobeIcon,
  MapPinIcon,
  MessageSquareIcon,
  MicVocalIcon,
  TrophyIcon,
  TvIcon,
} from "lucide-vue-next";
import { AppleBlurImage } from "~/components/ui/apple-card-carousel";
import type { CardMetadata } from "~/composables/current-vibes/cards-metadata";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";
import { useSettings } from "~/composables/settings";

interface Props {
  card: CardData;
  index: number;
  metadata: CardMetadata;
  contrastClass?: string;
  isLight?: boolean;
  isDragging: boolean;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { disableCardHoverEffects } = useSettings();

const cardHoverClasses = computed(() => {
  if (disableCardHoverEffects.value) return "";
  return "hover:scale-[1.02] focus-within:scale-[1.02]";
});

const imageHoverClasses = computed(() => {
  if (disableCardHoverEffects.value) return "";
  return "group-hover:blur-none group-focus-within:blur-none group-hover:scale-110 group-focus-within:scale-110";
});

const gradientHoverClasses = computed(() => {
  if (disableCardHoverEffects.value) return "";
  return "group-hover:opacity-50 group-focus-within:opacity-50";
});

const gradientBottomHoverClasses = computed(() => {
  if (disableCardHoverEffects.value) return "";
  return "group-hover:opacity-70 group-focus-within:opacity-70";
});
</script>

<template>
  <div
    :class="[
      'group relative z-10 flex h-[calc(100vh-14rem)] max-h-[calc(100vh-14rem)] min-h-[32rem] flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[48rem] dark:bg-neutral-900 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent snap-center flex-shrink-0 w-[calc(100vw-5rem)] md:w-[32rem]',
      cardHoverClasses,
      isDragging ? 'cursor-grabbing' : 'cursor-grab',
    ]"
    tabindex="0"
  >
    <AppleBlurImage
      :src="metadata.src"
      :alt="metadata.title"
      :class="`absolute inset-0 z-10 object-cover transition-all duration-500 blur-md ${imageHoverClasses}`"
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
      <span class="text-sm font-medium whitespace-nowrap">{{
        t("currentVibes.cards.visit")
      }}</span>
    </a>

    <!-- Top gradient overlay -->
    <div
      :class="[
        'pointer-events-none absolute inset-x-0 top-0 z-30 h-full transition-opacity duration-300',
        gradientHoverClasses,
        isLight
          ? 'bg-gradient-to-b from-white/60 via-white/20 to-transparent'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
      ]"
    />

    <!-- Bottom gradient overlay for text area -->
    <div
      :class="[
        'pointer-events-none absolute inset-x-0 bottom-0 z-35 h-1/2 transition-opacity duration-300',
        gradientBottomHoverClasses,
        isLight
          ? 'bg-gradient-to-t from-white/90 via-white/60 to-transparent'
          : 'bg-gradient-to-t from-black/90 via-black/60 to-transparent',
      ]"
    />

    <!-- Content -->
    <div
      class="relative z-40 p-8 flex flex-col h-full min-h-0 overflow-y-auto overscroll-contain justify-end gap-4"
    >
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
        <!-- Game Details (HLTB card – redesigned) -->
        <template v-if="card.type === 'game'">
          <!-- Current game info row -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <div v-if="metadata.progress" class="flex items-center gap-2">
              <div
                :class="[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  isLight ? 'bg-gray-200/80' : 'bg-white/15',
                ]"
              >
                <ClockIcon
                  :class="[
                    'h-3.5 w-3.5',
                    isLight ? 'text-gray-700' : 'text-white/95',
                  ]"
                />
              </div>
              <span class="font-medium tabular-nums"
                >{{ metadata.progress }}
                {{ t("currentVibes.cards.hours") }}</span
              >
            </div>
            <div v-if="metadata.platform" class="flex items-center gap-2">
              <div
                :class="[
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  isLight ? 'bg-gray-200/80' : 'bg-white/15',
                ]"
              >
                <Gamepad2Icon
                  :class="[
                    'h-3.5 w-3.5',
                    isLight ? 'text-gray-700' : 'text-white/95',
                  ]"
                />
              </div>
              <span>{{ metadata.platform }}</span>
            </div>
          </div>

          <!-- Progress bar (when playing) -->
          <div
            v-if="
              metadata.progressPercentage !== undefined &&
              metadata.progressPercentage > 0
            "
            class="mt-2"
          >
            <div
              :class="[
                'h-1.5 w-full overflow-hidden rounded-full',
                isLight ? 'bg-gray-200' : 'bg-white/20',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full transition-all duration-500',
                  isLight ? 'bg-teal-500' : 'bg-teal-400',
                ]"
                :style="{ width: `${metadata.progressPercentage}%` }"
              />
            </div>
            <span
              :class="[
                'mt-0.5 text-[10px] font-medium tabular-nums',
                isLight ? 'text-gray-600' : 'text-white/70',
              ]"
            >
              {{ metadata.progressPercentage }}%
              {{ t("currentVibes.cards.gameStats.complete") }}
            </span>
          </div>

          <div
            v-if="metadata.description"
            :class="[
              'line-clamp-2 mt-2 text-[13px] leading-relaxed drop-shadow-sm',
              isLight ? 'text-gray-700' : 'text-white/90',
            ]"
          >
            {{ metadata.description }}
          </div>

          <!-- HLTB stats – pill cards (minimalist on mobile) -->
          <template
            v-if="
              metadata.totalHours !== undefined ||
              metadata.platforms?.length ||
              metadata.gamesPlayed !== undefined ||
              metadata.gamesCompleted !== undefined
            "
          >
            <div :class="['mt-4 flex flex-wrap gap-1.5 md:gap-2']">
              <div
                v-if="metadata.platforms?.length"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <Gamepad2Icon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-violet-600' : 'text-violet-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.gameStats.platforms") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.platforms.length }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  metadata.gamesCompleted !== undefined &&
                  metadata.gamesPlayed !== undefined
                "
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <TrophyIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-amber-500' : 'text-amber-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.gameStats.gamesCompleted") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.gamesCompleted }}/{{ metadata.gamesPlayed }}
                    <span
                      v-if="metadata.completionRate !== undefined"
                      :class="[
                        'text-[10px] font-medium md:text-[11px]',
                        isLight ? 'text-gray-600' : 'text-white/80',
                      ]"
                    >
                      ({{ metadata.completionRate }}%)
                    </span>
                  </span>
                </div>
              </div>
              <div
                v-else-if="metadata.gamesCompleted !== undefined"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <TrophyIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-amber-500' : 'text-amber-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.gameStats.gamesCompleted") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.gamesCompleted }}
                    <span
                      v-if="metadata.completionRate !== undefined"
                      :class="[
                        'text-[10px] font-medium md:text-[11px]',
                        isLight ? 'text-gray-600' : 'text-white/80',
                      ]"
                    >
                      ({{ metadata.completionRate }}%)
                    </span>
                  </span>
                </div>
              </div>
              <div
                v-if="metadata.totalHours !== undefined"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <ClockIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-sky-600' : 'text-sky-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.gameStats.totalHours") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.totalHours.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- Games by release year – stacked bar + legend (compact on mobile) -->
          <div
            v-if="metadata.releaseByYear && metadata.releaseByYear.length > 0"
            class="mt-3 md:mt-4"
          >
            <div
              :class="[
                'mb-1.5 text-[9px] font-semibold uppercase tracking-wider md:mb-2 md:text-[10px]',
                isLight ? 'text-gray-600' : 'text-white/70',
              ]"
            >
              {{ t("currentVibes.cards.gameStats.gamesByYear") }}
            </div>
            <div
              :class="[
                'flex h-2 w-full overflow-hidden rounded-full md:h-3',
                isLight ? 'bg-gray-200' : 'bg-white/15',
              ]"
            >
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                :class="[
                  'h-full min-w-[2px] transition-all duration-500',
                  i === 0 && 'rounded-l-full',
                  i === metadata.releaseByYear!.length - 1 && 'rounded-r-full',
                  isLight
                    ? [
                        'bg-violet-400',
                        'bg-indigo-400',
                        'bg-sky-400',
                        'bg-teal-400',
                      ][i % 4]
                    : [
                        'bg-violet-500/80',
                        'bg-indigo-500/80',
                        'bg-sky-500/80',
                        'bg-teal-500/80',
                      ][i % 4],
                ]"
                :style="{
                  width: `${
                    (item.count /
                      Math.max(
                        metadata.releaseByYear!.reduce(
                          (s, r) => s + r.count,
                          0,
                        ),
                        1,
                      )) *
                    100
                  }%`,
                }"
              />
            </div>
            <div
              class="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 md:mt-2 md:gap-x-3 md:gap-y-1"
            >
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                class="flex items-center gap-1 md:gap-1.5"
              >
                <span
                  :class="[
                    'h-1 w-1 shrink-0 rounded-full md:h-1.5 md:w-1.5',
                    isLight
                      ? [
                          'bg-violet-400',
                          'bg-indigo-400',
                          'bg-sky-400',
                          'bg-teal-400',
                        ][i % 4]
                      : [
                          'bg-violet-500/80',
                          'bg-indigo-500/80',
                          'bg-sky-500/80',
                          'bg-teal-500/80',
                        ][i % 4],
                  ]"
                />
                <span
                  :class="[
                    'text-[10px] md:text-[11px]',
                    isLight ? 'text-gray-600' : 'text-white/80',
                  ]"
                >
                  {{ item.label }}
                </span>
                <span
                  :class="[
                    'text-[10px] font-semibold tabular-nums md:text-[11px]',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Music Details (compact on mobile) -->
        <template v-if="card.type === 'music'">
          <!-- Artist & album info row -->
          <div
            class="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-4 md:gap-y-1.5"
          >
            <div
              v-if="metadata.artist"
              class="flex items-center gap-1.5 md:gap-2"
            >
              <div
                :class="[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md md:h-7 md:w-7 md:rounded-lg',
                  isLight ? 'bg-gray-200/80' : 'bg-white/15',
                ]"
              >
                <MicVocalIcon
                  :class="[
                    'h-2.5 w-2.5 md:h-3.5 md:w-3.5',
                    isLight ? 'text-gray-700' : 'text-white/95',
                  ]"
                />
              </div>
              <span class="truncate text-xs font-medium md:text-base">{{
                metadata.artist
              }}</span>
            </div>
            <div
              v-if="metadata.album"
              class="flex items-center gap-1.5 md:gap-2"
            >
              <div
                :class="[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md md:h-7 md:w-7 md:rounded-lg',
                  isLight ? 'bg-gray-200/80' : 'bg-white/15',
                ]"
              >
                <Disc3Icon
                  :class="[
                    'h-2.5 w-2.5 md:h-3.5 md:w-3.5',
                    isLight ? 'text-gray-700' : 'text-white/95',
                  ]"
                />
              </div>
              <span class="truncate text-xs md:text-base">{{
                metadata.album
              }}</span>
            </div>
          </div>

          <!-- Top artists & tracks list (compact on mobile) -->
          <template
            v-if="
              metadata.topArtistsByMonth?.length ||
              metadata.topTracksByMonth?.length
            "
          >
            <div
              class="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-6 md:mt-4 md:gap-3"
            >
              <div
                v-if="metadata.topArtistsByMonth?.length"
                class="min-w-0 flex-1"
              >
                <div
                  :class="[
                    'mb-1 text-[9px] font-semibold uppercase tracking-wider md:mb-1.5 md:text-[10px]',
                    isLight ? 'text-gray-600' : 'text-white/70',
                  ]"
                >
                  {{ t("currentVibes.cards.spotifyStats.topArtistsChart") }}
                </div>
                <div class="space-y-0.5">
                  <div
                    v-for="(item, i) in metadata.topArtistsByMonth"
                    :key="`artist-${i}`"
                    class="flex items-center gap-1.5 md:gap-2"
                  >
                    <span
                      :class="[
                        'w-3 shrink-0 text-[9px] tabular-nums md:w-4 md:text-[10px]',
                        isLight ? 'text-gray-500' : 'text-white/50',
                      ]"
                    >
                      {{ i + 1 }}
                    </span>
                    <span
                      :class="[
                        'min-w-0 truncate text-[11px] md:text-xs',
                        isLight ? 'text-gray-800' : 'text-white/95',
                      ]"
                    >
                      {{ item.label }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="metadata.topTracksByMonth?.length"
                class="min-w-0 flex-1"
              >
                <div
                  :class="[
                    'mb-1 text-[9px] font-semibold uppercase tracking-wider md:mb-1.5 md:text-[10px]',
                    isLight ? 'text-gray-600' : 'text-white/70',
                  ]"
                >
                  {{ t("currentVibes.cards.spotifyStats.topTracksChart") }}
                </div>
                <div class="space-y-0.5">
                  <div
                    v-for="(item, i) in metadata.topTracksByMonth"
                    :key="`track-${i}`"
                    class="flex items-center gap-1.5 md:gap-2"
                  >
                    <span
                      :class="[
                        'w-3 shrink-0 text-[9px] tabular-nums md:w-4 md:text-[10px]',
                        isLight ? 'text-gray-500' : 'text-white/50',
                      ]"
                    >
                      {{ i + 1 }}
                    </span>
                    <span
                      :class="[
                        'min-w-0 truncate text-[11px] md:text-xs',
                        isLight ? 'text-gray-800' : 'text-white/95',
                      ]"
                    >
                      {{ item.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- Blog Details (compact pills on mobile) -->
        <template v-if="card.type === 'blog'">
          <div class="flex flex-wrap gap-1.5 md:gap-2">
            <div
              v-if="metadata.publishedDate"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <CalendarIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-amber-600' : 'text-amber-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.blog.published") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.publishedDate }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.readTime"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <BookOpenIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-teal-600' : 'text-teal-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.blog.readTime") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.readTime }} {{ t("currentVibes.cards.minRead") }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="metadata.description"
            :class="[
              'line-clamp-2 mt-2 text-[12px] leading-relaxed drop-shadow-sm md:mt-3 md:text-[13px]',
              isLight ? 'text-gray-700' : 'text-white/90',
            ]"
          >
            {{ metadata.description }}
          </div>
        </template>

        <!-- Trakt Details (compact pills on mobile) -->
        <template v-if="card.type === 'trakt'">
          <div class="flex flex-wrap gap-1.5 md:gap-2">
            <div
              v-if="metadata.mediaType"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <FilmIcon
                v-if="metadata.mediaType === 'movie'"
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-rose-600' : 'text-rose-400',
                ]"
              />
              <TvIcon
                v-else
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-rose-600' : 'text-rose-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.trakt.type") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{
                    metadata.mediaType === "movie"
                      ? t("currentVibes.cards.trakt.movie")
                      : t("currentVibes.cards.trakt.episode")
                  }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.watchedDate"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <CalendarIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-amber-600' : 'text-amber-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.trakt.watched") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.watchedDate }}
                </span>
              </div>
            </div>
          </div>
          <div
            v-if="metadata.subtitle"
            :class="[
              'line-clamp-2 mt-2 text-[12px] leading-relaxed drop-shadow-sm md:mt-3 md:text-[13px]',
              isLight ? 'text-gray-700' : 'text-white/90',
            ]"
          >
            {{ metadata.subtitle }}
          </div>
        </template>

        <!-- GitHub Details (compact pills on mobile) -->
        <template v-if="card.type === 'github'">
          <template v-if="metadata.contributions !== undefined">
            <div
              v-if="metadata.statsCategory"
              :class="[
                'mb-1.5 text-[9px] font-semibold uppercase tracking-wider md:mb-2 md:text-[10px]',
                isLight ? 'text-gray-600' : 'text-white/70',
              ]"
            >
              {{ metadata.statsCategory }}
              <span v-if="metadata.year" class="opacity-80"
                >({{ metadata.year }})</span
              >
            </div>
            <!-- GitHub stats – pill cards -->
            <div class="flex flex-wrap gap-1.5 md:gap-2">
              <div
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <GlobeIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-emerald-600' : 'text-emerald-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.github.contributions") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.contributions.toLocaleString() }}
                  </span>
                </div>
              </div>
              <div
                v-if="metadata.commits !== undefined"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <GitCommitIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-sky-600' : 'text-sky-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.github.commits") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.commits.toLocaleString() }}
                  </span>
                </div>
              </div>
              <div
                v-if="metadata.repos !== undefined"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <FolderOpenIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-violet-600' : 'text-violet-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.github.repos") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.repos }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  metadata.pullRequests !== undefined &&
                  metadata.pullRequests > 0
                "
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <GitPullRequestIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-teal-600' : 'text-teal-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.github.pullRequests") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.pullRequests }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  metadata.pullRequestReviews !== undefined &&
                  metadata.pullRequestReviews > 0
                "
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <MessageSquareIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-amber-600' : 'text-amber-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.githubStats.pullRequestReviews") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.pullRequestReviews }}
                  </span>
                </div>
              </div>
              <div
                v-if="metadata.issues !== undefined && metadata.issues > 0"
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <CircleAlertIcon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-rose-600' : 'text-rose-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.github.issues") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.issues }}
                  </span>
                </div>
              </div>
              <div
                v-if="
                  metadata.reposContributedTo !== undefined &&
                  metadata.reposContributedTo > 0
                "
                :class="[
                  'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                  isLight
                    ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                    : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
                ]"
              >
                <BarChart3Icon
                  :class="[
                    'h-3 w-3 shrink-0 md:h-4 md:w-4',
                    isLight ? 'text-indigo-600' : 'text-indigo-400',
                  ]"
                />
                <div class="flex flex-col min-w-0">
                  <span
                    :class="[
                      'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                      isLight ? 'text-gray-500' : 'text-white/60',
                    ]"
                  >
                    {{ t("currentVibes.cards.githubStats.reposContributedTo") }}
                  </span>
                  <span
                    :class="[
                      'text-xs font-semibold tabular-nums md:text-sm',
                      isLight ? 'text-gray-900' : 'text-white',
                    ]"
                  >
                    {{ metadata.reposContributedTo }}
                  </span>
                </div>
              </div>
            </div>
          </template>

          <!-- Contributions by month – stacked bar + legend (compact on mobile) -->
          <div
            v-if="
              metadata.contributionsByMonth &&
              metadata.contributionsByMonth.length > 0
            "
            class="mt-3 md:mt-4"
          >
            <div
              :class="[
                'mb-1.5 text-[9px] font-semibold uppercase tracking-wider md:mb-2 md:text-[10px]',
                isLight ? 'text-gray-600' : 'text-white/70',
              ]"
            >
              {{ t("currentVibes.cards.githubStats.contributionsByMonth") }}
            </div>
            <div
              :class="[
                'flex h-2 w-full overflow-hidden rounded-full md:h-3',
                isLight ? 'bg-gray-200' : 'bg-white/15',
              ]"
            >
              <div
                v-for="(item, i) in metadata.contributionsByMonth"
                :key="i"
                :class="[
                  'h-full min-w-[2px] transition-all duration-500',
                  i === 0 && 'rounded-l-full',
                  i === metadata.contributionsByMonth!.length - 1 &&
                    'rounded-r-full',
                  isLight
                    ? [
                        'bg-emerald-400',
                        'bg-teal-400',
                        'bg-sky-400',
                        'bg-violet-400',
                      ][i % 4]
                    : [
                        'bg-emerald-500/80',
                        'bg-teal-500/80',
                        'bg-sky-500/80',
                        'bg-violet-500/80',
                      ][i % 4],
                ]"
                :style="{
                  width: `${
                    (item.count /
                      Math.max(
                        metadata.contributionsByMonth!.reduce(
                          (s, r) => s + r.count,
                          0,
                        ),
                        1,
                      )) *
                    100
                  }%`,
                }"
              />
            </div>
            <div
              class="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5 md:mt-2 md:gap-x-3 md:gap-y-1"
            >
              <div
                v-for="(item, i) in metadata.contributionsByMonth"
                :key="i"
                class="flex items-center gap-1 md:gap-1.5"
              >
                <span
                  :class="[
                    'h-1 w-1 shrink-0 rounded-full md:h-1.5 md:w-1.5',
                    isLight
                      ? [
                          'bg-emerald-400',
                          'bg-teal-400',
                          'bg-sky-400',
                          'bg-violet-400',
                        ][i % 4]
                      : [
                          'bg-emerald-500/80',
                          'bg-teal-500/80',
                          'bg-sky-500/80',
                          'bg-violet-500/80',
                        ][i % 4],
                  ]"
                />
                <span
                  :class="[
                    'text-[10px] md:text-[11px]',
                    isLight ? 'text-gray-600' : 'text-white/80',
                  ]"
                >
                  {{ item.label }}
                </span>
                <span
                  :class="[
                    'text-[10px] font-semibold tabular-nums md:text-[11px]',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Map Details (compact pills on mobile) -->
        <template v-if="card.type === 'map'">
          <div class="flex flex-wrap gap-1.5 md:gap-2">
            <div
              v-if="metadata.cities !== undefined"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <MapPinIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-rose-600' : 'text-rose-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.cities") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.cities.toLocaleString() }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.countries !== undefined"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <FlagIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-indigo-600' : 'text-indigo-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.countries") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.countries.toLocaleString() }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.completionPercentage !== undefined"
              :class="[
                'flex items-center gap-1.5 rounded-lg px-2 py-1 md:gap-2 md:rounded-xl md:px-3 md:py-2 backdrop-blur-sm transition-all',
                isLight
                  ? 'bg-white/60 md:bg-white/70 md:shadow-sm md:ring-1 md:ring-gray-200/50'
                  : 'bg-white/5 md:bg-white/10 md:ring-1 md:ring-white/20',
              ]"
            >
              <GlobeIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  isLight ? 'text-sky-600' : 'text-sky-400',
                ]"
              />
              <div class="flex flex-col min-w-0">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    isLight ? 'text-gray-500' : 'text-white/60',
                  ]"
                >
                  {{ t("currentVibes.cards.map.completion") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    isLight ? 'text-gray-900' : 'text-white',
                  ]"
                >
                  {{ metadata.completionPercentage }}%
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
