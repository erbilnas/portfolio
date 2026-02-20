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
      <span class="text-sm font-medium whitespace-nowrap">{{
        t("currentVibes.cards.visit")
      }}</span>
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
        <!-- Game Details (with merged stats) -->
        <template v-if="card.type === 'game'">
          <div v-if="metadata.progress" class="flex items-center gap-2">
            <ClockIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span
              >{{ metadata.progress }} {{ t("currentVibes.cards.hours") }}</span
            >
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
          <!-- Stats block (merged when available) -->
          <template v-if="metadata.totalHours !== undefined">
            <div
              :class="[
                'mt-3 pt-3 border-t flex flex-wrap gap-x-4 gap-y-1',
                isLight ? 'border-gray-300' : 'border-white/20',
              ]"
            >
              <div class="flex items-center gap-2">
                <ClockIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.totalHours.toLocaleString() }}
                  {{ t("currentVibes.cards.hours") }}</span
                >
              </div>
              <div
                v-if="metadata.gamesCompleted !== undefined"
                class="flex items-center gap-2"
              >
                <TrophyIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.gamesCompleted }}
                  {{ t("currentVibes.cards.gameStats.gamesCompleted") }}</span
                >
              </div>
              <div
                v-if="metadata.completionRate !== undefined"
                class="flex items-center gap-2"
              >
                <BarChart3Icon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.completionRate }}%
                  {{ t("currentVibes.cards.gameStats.completionRate") }}</span
                >
              </div>
            </div>
          </template>
          <div
            v-if="metadata.releaseByYear && metadata.releaseByYear.length > 0"
            class="mt-3 space-y-2"
          >
            <div
              :class="[
                'text-xs font-medium',
                isLight ? 'text-gray-700' : 'text-white/90',
              ]"
            >
              {{ t("currentVibes.cards.gameStats.gamesByYear") }}
            </div>
            <div class="space-y-1.5">
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                class="flex items-center gap-2"
              >
                <span
                  :class="[
                    'w-16 shrink-0 text-xs',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                >
                  {{ item.label }}
                </span>
                <div
                  :class="[
                    'h-2 min-w-[2px] rounded-full transition-all',
                    isLight ? 'bg-gray-300' : 'bg-white/40',
                  ]"
                  :style="{
                    width: `${Math.max(
                      (item.count /
                        Math.max(
                          ...metadata.releaseByYear!.map((r) => r.count),
                          1,
                        )) *
                        100,
                      2,
                    )}%`,
                  }"
                />
                <span
                  :class="[
                    'text-xs tabular-nums',
                    isLight ? 'text-gray-600' : 'text-white/70',
                  ]"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Music Details (with HLTB-style stats) -->
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
          <!-- Stats block (merged when available) -->
          <template
            v-if="
              metadata.topArtistsByMonth?.length ||
              metadata.topTracksCount !== undefined
            "
          >
            <div
              v-if="metadata.statsCategory"
              :class="[
                'text-xs font-medium mb-1',
                isLight ? 'text-gray-700' : 'text-white/90',
              ]"
            >
              {{ metadata.statsCategory }}
            </div>
            <div
              :class="[
                'pt-3 border-t flex flex-wrap gap-x-4 gap-y-1',
                isLight ? 'border-gray-300' : 'border-white/20',
              ]"
            >
              <div
                v-if="metadata.topArtistsByMonth?.length"
                class="flex items-center gap-2"
              >
                <MicVocalIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.topArtistsByMonth.length }}
                  {{ t("currentVibes.cards.spotifyStats.topArtists") }}</span
                >
              </div>
              <div
                v-if="metadata.topTracksCount !== undefined"
                class="flex items-center gap-2"
              >
                <Disc3Icon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.topTracksCount.toLocaleString() }}
                  {{ t("currentVibes.cards.spotifyStats.topTracks") }}</span
                >
              </div>
            </div>
          </template>
          <div
            v-if="
              metadata.topArtistsByMonth &&
              metadata.topArtistsByMonth.length > 0
            "
            class="mt-3 space-y-2"
          >
            <div
              :class="[
                'text-xs font-medium',
                isLight ? 'text-gray-700' : 'text-white/90',
              ]"
            >
              {{ t("currentVibes.cards.spotifyStats.topArtistsChart") }}
            </div>
            <div class="space-y-1.5">
              <div
                v-for="(item, i) in metadata.topArtistsByMonth"
                :key="i"
                class="flex items-center gap-2"
              >
                <span
                  :class="[
                    'w-16 shrink-0 text-xs truncate',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                >
                  {{ item.label }}
                </span>
                <div
                  :class="[
                    'h-2 min-w-[2px] rounded-full transition-all flex-1 max-w-24',
                    isLight ? 'bg-gray-300' : 'bg-white/40',
                  ]"
                  :style="{
                    width: `${Math.max(
                      (item.count /
                        Math.max(
                          ...metadata.topArtistsByMonth!.map((r) => r.count),
                          1,
                        )) *
                        100,
                      2,
                    )}%`,
                  }"
                />
                <span
                  :class="[
                    'text-xs tabular-nums',
                    isLight ? 'text-gray-600' : 'text-white/70',
                  ]"
                >
                  #{{ i + 1 }}
                </span>
              </div>
            </div>
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
            <span
              >{{ metadata.readTime }}
              {{ t("currentVibes.cards.minRead") }}</span
            >
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

        <!-- Trakt Details -->
        <template v-if="card.type === 'trakt'">
          <div v-if="metadata.mediaType" class="flex items-center gap-2">
            <FilmIcon
              v-if="metadata.mediaType === 'movie'"
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <TvIcon
              v-else
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{
              metadata.mediaType === "movie"
                ? t("currentVibes.cards.trakt.movie")
                : t("currentVibes.cards.trakt.episode")
            }}</span>
          </div>
          <div v-if="metadata.watchedDate" class="flex items-center gap-2">
            <CalendarIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span>{{ metadata.watchedDate }}</span>
          </div>
          <div
            v-if="metadata.subtitle"
            :class="[
              'line-clamp-2 mt-1 drop-shadow-sm',
              isLight ? 'text-gray-800' : 'text-white/95',
            ]"
          >
            {{ metadata.subtitle }}
          </div>
        </template>

        <!-- GitHub Details (HLTB-style stats block) -->
        <template v-if="card.type === 'github'">
          <template v-if="metadata.contributions !== undefined">
            <div
              v-if="metadata.statsCategory"
              :class="[
                'text-xs font-medium mb-1',
                isLight ? 'text-gray-700' : 'text-white/90',
              ]"
            >
              {{ metadata.statsCategory }}
              <span v-if="metadata.year" class="opacity-80"
                >({{ metadata.year }})</span
              >
            </div>
            <div
              :class="[
                'pt-3 border-t flex flex-wrap gap-x-4 gap-y-1',
                isLight ? 'border-gray-300' : 'border-white/20',
              ]"
            >
              <div class="flex items-center gap-2">
                <GlobeIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.contributions.toLocaleString() }}
                  {{ t("currentVibes.cards.github.contributions") }}</span
                >
              </div>
              <div
                v-if="metadata.commits !== undefined"
                class="flex items-center gap-2"
              >
                <GitCommitIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.commits.toLocaleString() }}
                  {{ t("currentVibes.cards.github.commits") }}</span
                >
              </div>
              <div
                v-if="metadata.repos !== undefined"
                class="flex items-center gap-2"
              >
                <FolderOpenIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.repos }}
                  {{ t("currentVibes.cards.github.repos") }}</span
                >
              </div>
              <div
                v-if="
                  metadata.pullRequests !== undefined &&
                  metadata.pullRequests > 0
                "
                class="flex items-center gap-2"
              >
                <GitPullRequestIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.pullRequests }}
                  {{ t("currentVibes.cards.github.pullRequests") }}</span
                >
              </div>
              <div
                v-if="
                  metadata.pullRequestReviews !== undefined &&
                  metadata.pullRequestReviews > 0
                "
                class="flex items-center gap-2"
              >
                <MessageSquareIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.pullRequestReviews }}
                  {{
                    t("currentVibes.cards.githubStats.pullRequestReviews")
                  }}</span
                >
              </div>
              <div
                v-if="metadata.issues !== undefined && metadata.issues > 0"
                class="flex items-center gap-2"
              >
                <CircleAlertIcon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.issues }}
                  {{ t("currentVibes.cards.github.issues") }}</span
                >
              </div>
              <div
                v-if="
                  metadata.reposContributedTo !== undefined &&
                  metadata.reposContributedTo > 0
                "
                class="flex items-center gap-2"
              >
                <BarChart3Icon
                  :class="[
                    'h-4 w-4',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                />
                <span
                  >{{ metadata.reposContributedTo }}
                  {{
                    t("currentVibes.cards.githubStats.reposContributedTo")
                  }}</span
                >
              </div>
            </div>
          </template>
          <div
            v-if="
              metadata.contributionsByMonth &&
              metadata.contributionsByMonth.length > 0
            "
            class="mt-3 space-y-2"
          >
            <div
              :class="[
                'text-xs font-medium',
                isLight ? 'text-gray-700' : 'text-white/90',
              ]"
            >
              {{ t("currentVibes.cards.githubStats.contributionsByMonth") }}
            </div>
            <div class="space-y-1.5">
              <div
                v-for="(item, i) in metadata.contributionsByMonth"
                :key="i"
                class="flex items-center gap-2"
              >
                <span
                  :class="[
                    'w-16 shrink-0 text-xs',
                    isLight ? 'text-gray-700' : 'text-white/90',
                  ]"
                >
                  {{ item.label }}
                </span>
                <div
                  :class="[
                    'h-2 min-w-[2px] rounded-full transition-all',
                    isLight ? 'bg-gray-300' : 'bg-white/40',
                  ]"
                  :style="{
                    width: `${Math.max(
                      (item.count /
                        Math.max(
                          ...metadata.contributionsByMonth!.map((r) => r.count),
                          1,
                        )) *
                        100,
                      2,
                    )}%`,
                  }"
                />
                <span
                  :class="[
                    'text-xs tabular-nums',
                    isLight ? 'text-gray-600' : 'text-white/70',
                  ]"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Map Details -->
        <template v-if="card.type === 'map'">
          <div class="flex items-center gap-2">
            <MapPinIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span
              >{{ metadata.cities }} {{ t("currentVibes.cards.cities") }}</span
            >
            <span :class="[isLight ? 'text-gray-600' : 'text-white/60']">
              •
            </span>
            <FlagIcon
              :class="['h-4 w-4', isLight ? 'text-gray-700' : 'text-white/90']"
            />
            <span
              >{{ metadata.countries }}
              {{ t("currentVibes.cards.countries") }}</span
            >
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
