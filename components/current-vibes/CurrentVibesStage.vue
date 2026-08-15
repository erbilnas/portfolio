<script setup lang="ts">
import { useI18n } from "#imports";
import {
  Disc3Icon,
  FlagIcon,
  GlobeIcon,
  MapPinIcon,
  MicVocalIcon,
} from "lucide-vue-next";
import type { CardMetadata } from "~/composables/current-vibes/cards-metadata";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";
import { useSettings } from "~/composables/settings";
import TravelGlobe from "~/components/current-vibes/TravelGlobe.vue";
import MusicTurntable from "~/components/current-vibes/scenes/MusicTurntable.vue";
import GamingCover from "~/components/current-vibes/scenes/GamingCover.vue";
import WatchingScreen from "~/components/current-vibes/scenes/WatchingScreen.vue";
import CodingCommitField from "~/components/current-vibes/scenes/CodingCommitField.vue";
import WritingDesk from "~/components/current-vibes/scenes/WritingDesk.vue";
import ReadingCover from "~/components/current-vibes/scenes/ReadingCover.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  card: CardData;
  metadata: CardMetadata;
}

const props = defineProps<Props>();
const { t } = useI18n();
const { reducedMotion } = useSettings();

const moreBlogPosts = computed(() => {
  const recent = props.metadata.blogRecent ?? [];
  const featuredTitle = props.metadata.title;
  const rest = recent.filter((post) => post.title !== featuredTitle);
  return rest.length ? rest : recent.slice(1);
});

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

/** Theme via Tailwind dark: so SSR/system preference first paint stays readable. */
const pillClass =
  "flex items-center gap-1.5 rounded-lg bg-neutral-100 px-2 py-1 ring-1 ring-neutral-200/80 md:gap-2 md:rounded-xl md:px-3 md:py-2 dark:bg-white/10 dark:ring-white/15";

/** Icons stay design-system ink (black / white), not brand hues. */
const iconInkClass = "text-neutral-900 dark:text-white";

/** Progress fills: ink on track, no brand hues. */
const progressFillClass = "bg-neutral-900 dark:bg-white";

/** Segmented bars (gaming years / coding months): tonal steps only. */
const barSegmentColors = [
  "bg-neutral-900 dark:bg-white",
  "bg-neutral-700 dark:bg-neutral-300",
  "bg-neutral-500 dark:bg-neutral-500",
  "bg-neutral-400 dark:bg-neutral-600",
  "bg-neutral-300 dark:bg-neutral-700",
] as const;

const coverTransitionClass = computed(() =>
  reducedMotion.value ? "" : "transition-opacity duration-300",
);
</script>

<template>
  <article
    class="grid overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-white/15 dark:bg-black md:grid-cols-2 md:items-stretch md:rounded-3xl"
    :aria-labelledby="`vibes-featured-title-${card.type}`"
  >
    <div
      :class="[
        'relative aspect-[3/4] w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900 sm:aspect-[2/3] md:aspect-auto md:min-h-[44rem] lg:min-h-[48rem]',
        coverTransitionClass,
      ]"
    >
      <ClientOnly>
        <div class="absolute inset-0">
          <TravelGlobe v-if="card.type === 'map'" />
          <MusicTurntable
            v-else-if="card.type === 'music'"
            :src="metadata.src"
            :is-playing="metadata.isPlaying"
          />
          <GamingCover
            v-else-if="card.type === 'game'"
            :src="metadata.src"
            :title="metadata.title"
            :progress-percentage="metadata.progressPercentage"
          />
          <WatchingScreen
            v-else-if="card.type === 'trakt'"
            :src="metadata.src"
          />
          <CodingCommitField
            v-else-if="card.type === 'github'"
            :contributions-by-month="metadata.contributionsByMonth"
            :contributions="metadata.contributions"
          />
          <WritingDesk
            v-else-if="card.type === 'blog'"
            :title="metadata.title"
          />
          <ReadingCover
            v-else-if="card.type === 'reading'"
            :src="metadata.src"
            :title="metadata.title"
          />
        </div>
        <template #fallback>
          <div
            class="absolute inset-0 bg-neutral-200 dark:bg-neutral-900"
            aria-hidden="true"
          />
        </template>
      </ClientOnly>
    </div>

    <div
      class="flex flex-col justify-center gap-6 px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12"
    >
      <div class="flex flex-col gap-4" aria-live="polite">
        <p
          class="text-sm font-medium tracking-tight text-neutral-600 dark:text-neutral-300 md:text-base"
        >
          {{ metadata.category }}
        </p>
        <h3
          :id="`vibes-featured-title-${card.type}`"
          class="text-3xl font-semibold tracking-tight text-neutral-950 [text-wrap:balance] dark:text-white md:text-5xl"
        >
          {{ metadata.title }}
        </h3>
        <a
          v-if="metadata.visitUrl"
          :href="metadata.visitUrl"
          :target="isExternalUrl(metadata.visitUrl) ? '_blank' : undefined"
          :rel="
            isExternalUrl(metadata.visitUrl) ? 'noopener noreferrer' : undefined
          "
          class="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-neutral-950 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
        >
          {{ t("currentVibes.cards.visit") }}
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div
        :class="[
          'flex flex-col gap-2 text-sm',
          'text-neutral-900 dark:text-white',
        ]"
      >
        <!-- Game -->
        <template v-if="card.type === 'game'">
          <div
            class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <span v-if="metadata.platform" class="font-medium text-neutral-900 dark:text-white">{{
              metadata.platform
            }}</span>
            <span
              v-if="metadata.platform && metadata.progress"
              class="text-neutral-400 dark:text-neutral-600"
              aria-hidden="true"
              >·</span
            >
            <span v-if="metadata.progress" class="tabular-nums">
              {{ metadata.progress }} {{ t("currentVibes.cards.hours") }}
            </span>
          </div>

          <div
            v-if="metadata.genres?.length"
            class="mt-4"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.gameStats.genres") }}
            </p>
            <p
              class="mt-1 text-sm leading-relaxed text-neutral-900 dark:text-white"
            >
              {{ metadata.genres.join(" · ") }}
            </p>
          </div>

          <div
            v-if="
              metadata.progressPercentage !== undefined &&
              metadata.progressPercentage > 0
            "
            class="mt-5"
          >
            <div class="flex items-end justify-between gap-4">
              <span
                class="text-4xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-5xl"
              >
                {{ metadata.progressPercentage }}%
              </span>
              <span
                class="pb-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.complete") }}
              </span>
            </div>
            <div
              class="mt-3 h-px w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
            >
              <div
                :class="[
                  'h-full bg-neutral-900 dark:bg-white',
                  reducedMotion ? '' : 'transition-all duration-500',
                ]"
                :style="{ width: `${metadata.progressPercentage}%` }"
              />
            </div>
          </div>

          <p
            v-if="metadata.description"
            class="mt-4 line-clamp-3 text-[13px] leading-relaxed text-pretty text-neutral-700 dark:text-neutral-200"
          >
            {{ metadata.description }}
          </p>

          <div
            v-if="
              metadata.totalHours !== undefined ||
              metadata.platforms?.length ||
              metadata.gamesPlayed !== undefined ||
              metadata.gamesCompleted !== undefined
            "
            class="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3"
          >
            <div v-if="metadata.platforms?.length" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.platforms") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.platforms.length }}
              </p>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    class="mt-0.5 text-[11px] font-medium tabular-nums text-neutral-500 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-400 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
                  >
                    {{ t("currentVibes.cards.gameStats.platformsView") }}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  class="max-h-72 w-64 overflow-y-auto border-neutral-200 bg-white p-4 text-neutral-950 shadow-md dark:border-white/15 dark:bg-neutral-950 dark:text-white"
                >
                  <p
                    class="mb-3 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.gameStats.platforms") }}
                  </p>
                  <ul class="flex flex-col gap-1.5">
                    <li
                      v-for="platformName in metadata.platforms"
                      :key="platformName"
                      class="text-sm leading-snug text-neutral-900 dark:text-white"
                    >
                      {{ platformName }}
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
            <div
              v-if="metadata.gamesCompleted !== undefined"
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.gamesCompleted") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                <template v-if="metadata.gamesPlayed !== undefined">
                  {{ metadata.gamesCompleted }}/{{ metadata.gamesPlayed }}
                </template>
                <template v-else>
                  {{ metadata.gamesCompleted }}
                </template>
              </p>
              <p
                v-if="metadata.completionRate !== undefined"
                class="mt-0.5 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
              >
                {{ metadata.completionRate }}%
                {{ t("currentVibes.cards.gameStats.completionRate") }}
              </p>
            </div>
            <div v-if="metadata.totalHours !== undefined" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.totalHours") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.totalHours.toLocaleString() }}
              </p>
            </div>
          </div>

          <div
            v-if="metadata.releaseByYear && metadata.releaseByYear.length > 0"
            class="mt-6"
          >
            <p
              class="mb-3 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.gameStats.gamesByYear") }}
            </p>
            <div class="flex h-1.5 w-full overflow-hidden bg-neutral-200 dark:bg-white/15">
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                :class="[
                  'h-full min-w-[2px]',
                  reducedMotion ? '' : 'transition-all duration-500',
                  barSegmentColors[i % barSegmentColors.length],
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
            <div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                class="flex items-center gap-1.5"
              >
                <span
                  :class="[
                    'size-1.5 shrink-0 rounded-full',
                    barSegmentColors[i % barSegmentColors.length],
                  ]"
                />
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {{ item.label }}
                </span>
                <span
                  class="text-[11px] font-semibold tabular-nums text-neutral-800 dark:text-neutral-200"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>
        </template>

        <!-- Music -->
        <template v-if="card.type === 'music'">
          <div
            v-if="metadata.artist || metadata.album"
            class="flex flex-wrap items-center gap-x-3 gap-y-1 md:gap-x-4 md:gap-y-1.5"
          >
            <div
              v-if="metadata.artist"
              class="flex items-center gap-1.5 md:gap-2"
            >
              <div
                :class="[
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md md:h-7 md:w-7 md:rounded-lg',
                  'bg-neutral-200/80 dark:bg-white/15',
                ]"
              >
                <MicVocalIcon
                  :class="[
                    'h-2.5 w-2.5 md:h-3.5 md:w-3.5',
                    iconInkClass,
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
                  'bg-neutral-200/80 dark:bg-white/15',
                ]"
              >
                <Disc3Icon
                  :class="[
                    'h-2.5 w-2.5 md:h-3.5 md:w-3.5',
                    iconInkClass,
                  ]"
                />
              </div>
              <span class="truncate text-xs md:text-base">{{
                metadata.album
              }}</span>
            </div>
          </div>
          <p
            v-else
            :class="[
              'text-[13px] leading-relaxed',
              'text-neutral-600 dark:text-neutral-300',
            ]"
          >
            {{ t("currentVibes.cards.music.emptyHint") }}
          </p>

          <template
            v-if="
              metadata.topArtistsByMonth?.length ||
              metadata.topTracksByMonth?.length ||
              metadata.topGenres?.length
            "
          >
            <div class="mt-6">
              <div class="flex items-baseline justify-between gap-3">
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.statsCategory") }}
                </p>
                <p
                  v-if="metadata.listeningPeriod"
                  class="text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                >
                  {{ metadata.listeningPeriod }}
                </p>
              </div>

              <div
                class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3"
              >
                <div
                  v-if="metadata.topArtistsCount !== undefined"
                  class="min-w-0"
                >
                  <p
                    class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.spotifyStats.topArtists") }}
                  </p>
                  <p
                    class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                  >
                    {{ metadata.topArtistsCount.toLocaleString() }}
                  </p>
                </div>
                <div
                  v-if="metadata.topTracksCount !== undefined"
                  class="min-w-0"
                >
                  <p
                    class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.spotifyStats.topTracks") }}
                  </p>
                  <p
                    class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                  >
                    {{ metadata.topTracksCount.toLocaleString() }}
                  </p>
                </div>
                <div
                  v-if="metadata.topGenres?.length"
                  class="min-w-0"
                >
                  <p
                    class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.spotifyStats.topGenres") }}
                  </p>
                  <p
                    class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                  >
                    {{ metadata.topGenres.length.toLocaleString() }}
                  </p>
                </div>
              </div>

              <div
                v-if="metadata.topGenres?.length"
                class="mt-5"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.genres") }}
                </p>
                <p
                  class="mt-1 text-sm leading-relaxed text-neutral-900 dark:text-white"
                >
                  {{ metadata.topGenres.join(" · ") }}
                </p>
              </div>

              <div
                class="mt-5 flex flex-col gap-5 sm:flex-row sm:gap-8"
              >
                <div
                  v-if="metadata.topArtistsByMonth?.length"
                  class="min-w-0 flex-1"
                >
                  <p
                    class="mb-2.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.spotifyStats.topArtistsChart") }}
                  </p>
                  <div class="space-y-2.5">
                    <div
                      v-for="(item, i) in metadata.topArtistsByMonth"
                      :key="`artist-${i}`"
                      class="min-w-0"
                    >
                      <div class="flex items-baseline gap-2">
                        <span
                          class="w-3 shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                        >
                          {{ i + 1 }}
                        </span>
                        <div class="min-w-0 flex-1">
                          <p
                            class="truncate text-[12px] font-medium text-neutral-900 dark:text-white md:text-[13px]"
                          >
                            {{ item.label }}
                          </p>
                          <p
                            v-if="item.subtitle"
                            class="truncate text-[10px] text-neutral-500 dark:text-neutral-400"
                          >
                            {{ item.subtitle }}
                          </p>
                        </div>
                        <span
                          v-if="item.popularity !== undefined"
                          class="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                        >
                          {{ item.popularity }}
                        </span>
                      </div>
                      <div
                        class="mt-1 ml-5 h-px overflow-hidden bg-neutral-200 dark:bg-white/15"
                      >
                        <div
                          class="h-full bg-neutral-900 dark:bg-white"
                          :style="{
                            width: `${Math.max(
                              6,
                              (item.count /
                                Math.max(
                                  ...metadata.topArtistsByMonth!.map(
                                    (a) => a.count,
                                  ),
                                  1,
                                )) *
                                100,
                            )}%`,
                          }"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  v-if="metadata.topTracksByMonth?.length"
                  class="min-w-0 flex-1"
                >
                  <p
                    class="mb-2.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.spotifyStats.topTracksChart") }}
                  </p>
                  <div class="space-y-2.5">
                    <div
                      v-for="(item, i) in metadata.topTracksByMonth"
                      :key="`track-${i}`"
                      class="min-w-0"
                    >
                      <div class="flex items-baseline gap-2">
                        <span
                          class="w-3 shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                        >
                          {{ i + 1 }}
                        </span>
                        <div class="min-w-0 flex-1">
                          <p
                            class="truncate text-[12px] font-medium text-neutral-900 dark:text-white md:text-[13px]"
                          >
                            {{ item.label }}
                          </p>
                          <p
                            v-if="item.subtitle"
                            class="truncate text-[10px] text-neutral-500 dark:text-neutral-400"
                          >
                            {{ item.subtitle }}
                          </p>
                        </div>
                        <span
                          v-if="item.popularity !== undefined"
                          class="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                        >
                          {{ item.popularity }}
                        </span>
                      </div>
                      <div
                        class="mt-1 ml-5 h-px overflow-hidden bg-neutral-200 dark:bg-white/15"
                      >
                        <div
                          class="h-full bg-neutral-900 dark:bg-white"
                          :style="{
                            width: `${Math.max(
                              6,
                              (item.count /
                                Math.max(
                                  ...metadata.topTracksByMonth!.map(
                                    (a) => a.count,
                                  ),
                                  1,
                                )) *
                                100,
                            )}%`,
                          }"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>

        <!-- Blog -->
        <template v-if="card.type === 'blog'">
          <div
            v-if="metadata.publishedDate || metadata.readTime"
            class="grid grid-cols-2 gap-x-6 gap-y-5"
          >
            <div v-if="metadata.publishedDate" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.blog.published") }}
              </p>
              <p
                class="mt-1 text-xl font-semibold tracking-tight text-neutral-950 dark:text-white sm:text-2xl"
              >
                {{ metadata.publishedDate }}
              </p>
            </div>
            <div v-if="metadata.readTime" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.blog.readTime") }}
              </p>
              <p
                class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
              >
                {{ metadata.readTime }}
                <span
                  class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.minRead") }}
                </span>
              </p>
            </div>
          </div>
          <div
            v-if="metadata.description"
            :class="[
              'mt-4 line-clamp-3 text-[13px] leading-relaxed text-pretty',
              'text-neutral-700 dark:text-neutral-200',
            ]"
          >
            {{ metadata.description }}
          </div>
          <div
            v-if="
              metadata.blogPostsInFeed !== undefined ||
              metadata.blogPostsThisYear !== undefined ||
              metadata.blogAverageReadTime !== undefined ||
              metadata.blogTopics?.length
            "
            class="mt-6 rounded-xl bg-neutral-50 px-4 py-4 ring-1 ring-neutral-200/80 dark:bg-white/[0.04] dark:ring-white/10 sm:px-5 sm:py-5"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.blog.statsTitle") }}
            </p>
            <div
              class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3"
            >
              <div
                v-if="metadata.blogPostsInFeed !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.posts") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.blogPostsInFeed.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.blogPostsThisYear !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.thisYear") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.blogPostsThisYear.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.blogAverageReadTime !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.avgReadTime") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.blogAverageReadTime }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.minRead") }}
                  </span>
                </p>
              </div>
            </div>
            <div
              v-if="metadata.blogTopics?.length"
              class="mt-4"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.blog.topics") }}
              </p>
              <p
                class="mt-1.5 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-200 md:text-[13px]"
              >
                {{ metadata.blogTopics.join(" · ") }}
              </p>
            </div>
          </div>
          <div
            v-if="moreBlogPosts.length"
            class="mt-6"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.blog.recentTitle") }}
            </p>
            <ul class="mt-3 flex flex-col gap-2.5">
              <li
                v-for="post in moreBlogPosts"
                :key="post.link"
                class="min-w-0"
              >
                <a
                  :href="post.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[13px] font-medium leading-snug text-neutral-900 dark:text-neutral-100"
                >
                  {{ post.title }}
                </a>
                <p
                  class="mt-0.5 text-[12px] text-neutral-500 dark:text-neutral-400"
                >
                  {{ post.publishedDate }}
                </p>
              </li>
            </ul>
          </div>
        </template>

        <!-- Trakt -->
        <template v-if="card.type === 'trakt'">
          <div
            class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <span
              v-if="metadata.mediaType"
              class="font-medium text-neutral-900 dark:text-white"
            >
              {{
                metadata.mediaType === "movie"
                  ? t("currentVibes.cards.trakt.movie")
                  : t("currentVibes.cards.trakt.episode")
              }}
            </span>
            <span
              v-if="metadata.mediaType && metadata.watchedDate"
              class="text-neutral-400 dark:text-neutral-600"
              aria-hidden="true"
              >·</span
            >
            <span v-if="metadata.watchedDate">{{ metadata.watchedDate }}</span>
            <template v-if="metadata.runtime">
              <span
                class="text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
                >·</span
              >
              <span class="tabular-nums"
                >{{ metadata.runtime }}
                {{ t("currentVibes.cards.trakt.minutes") }}</span
              >
            </template>
          </div>

          <p
            v-if="metadata.subtitle"
            class="mt-2 text-sm font-medium text-neutral-800 dark:text-neutral-200"
          >
            {{ metadata.subtitle }}
          </p>

          <p
            v-if="metadata.tagline"
            class="mt-3 text-[13px] italic leading-relaxed text-neutral-600 dark:text-neutral-400"
          >
            {{ metadata.tagline }}
          </p>

          <p
            v-if="metadata.overview"
            class="mt-3 line-clamp-5 text-[13px] leading-relaxed text-pretty text-neutral-700 dark:text-neutral-200"
          >
            {{ metadata.overview }}
          </p>

          <div
            v-if="metadata.genres?.length"
            class="mt-4"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.trakt.genres") }}
            </p>
            <p
              class="mt-1 text-sm leading-relaxed text-neutral-900 dark:text-white"
            >
              {{ metadata.genres.join(" · ") }}
            </p>
          </div>

          <div
            v-if="metadata.rating !== undefined"
            class="mt-5"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.trakt.rating") }}
            </p>
            <p
              class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
            >
              {{ metadata.rating }}
              <span
                class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                >/10</span
              >
            </p>
            <p
              v-if="metadata.votes !== undefined"
              class="mt-0.5 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.votes.toLocaleString() }}
              {{ t("currentVibes.cards.trakt.votes") }}
            </p>
          </div>

          <div
            v-if="
              metadata.traktTotalHours !== undefined ||
              metadata.traktMoviesWatched !== undefined ||
              metadata.traktShowsWatched !== undefined ||
              metadata.traktEpisodesWatched !== undefined
            "
            class="mt-6 rounded-xl bg-neutral-50 px-4 py-4 ring-1 ring-neutral-200/80 dark:bg-white/[0.04] dark:ring-white/10 sm:px-5 sm:py-5"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.trakt.statsTitle") }}
            </p>
            <div
              class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4"
            >
              <div
                v-if="metadata.traktTotalHours !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.totalWatched") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.traktTotalHours.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.traktMoviesWatched !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.moviesWatched") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.traktMoviesWatched.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.traktShowsWatched !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.showsWatched") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.traktShowsWatched.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.traktEpisodesWatched !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.episodesWatched") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.traktEpisodesWatched.toLocaleString() }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- Reading -->
        <template v-if="card.type === 'reading'">
          <div
            class="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <span
              v-if="metadata.author"
              class="font-medium text-neutral-900 dark:text-white"
            >
              {{ metadata.author }}
            </span>
            <template v-if="metadata.readingDate">
              <span
                v-if="metadata.author"
                class="text-neutral-400 dark:text-neutral-600"
                aria-hidden="true"
                >·</span
              >
              <span class="tabular-nums">{{ metadata.readingDate }}</span>
            </template>
          </div>

          <div
            v-if="
              metadata.readingPages ||
              metadata.readingUserRating !== undefined ||
              metadata.readingAverageRating !== undefined
            "
            class="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3"
          >
            <div v-if="metadata.readingPages" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.pages") }}
              </p>
              <p
                class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
              >
                {{ metadata.readingPages.toLocaleString() }}
              </p>
            </div>
            <div
              v-if="metadata.readingUserRating !== undefined"
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.myRating") }}
              </p>
              <p
                class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
              >
                {{ metadata.readingUserRating }}
                <span
                  class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                  >/5</span
                >
              </p>
            </div>
            <div
              v-if="metadata.readingAverageRating !== undefined"
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.avgRating") }}
              </p>
              <p
                class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
              >
                {{ metadata.readingAverageRating }}
                <span
                  class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                  >/5</span
                >
              </p>
            </div>
          </div>

          <div
            v-if="
              metadata.readingBooksRead !== undefined ||
              metadata.readingBooksThisYear !== undefined ||
              metadata.readingCurrentlyReading !== undefined ||
              metadata.readingToRead !== undefined
            "
            class="mt-6 rounded-xl bg-neutral-50 px-4 py-4 ring-1 ring-neutral-200/80 dark:bg-white/[0.04] dark:ring-white/10 sm:px-5 sm:py-5"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{
                metadata.statsCategory ||
                t("currentVibes.cards.reading.statsTitle")
              }}
            </p>
            <div
              class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4"
            >
              <div
                v-if="metadata.readingBooksRead !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.booksRead") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingBooksRead.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.readingBooksThisYear !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.thisYear") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingBooksThisYear.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.readingCurrentlyReading !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.inProgress") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingCurrentlyReading.toLocaleString() }}
                </p>
              </div>
              <div
                v-if="metadata.readingToRead !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.toRead") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingToRead.toLocaleString() }}
                </p>
              </div>
            </div>

            <div
              v-if="
                metadata.readingAvgUserRating !== undefined ||
                metadata.readingPagesRead !== undefined
              "
              class="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-neutral-200/80 pt-4 dark:border-white/10"
            >
              <div
                v-if="metadata.readingAvgUserRating !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.avgMyRating") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingAvgUserRating }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                    >/5</span
                  >
                </p>
              </div>
              <div
                v-if="metadata.readingPagesRead !== undefined"
                class="min-w-0"
              >
                <p
                  class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.pagesRead") }}
                </p>
                <p
                  class="mt-1 text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white sm:text-2xl"
                >
                  {{ metadata.readingPagesRead.toLocaleString() }}
                </p>
              </div>
            </div>

            <div
              v-if="metadata.readingTopAuthors?.length"
              class="mt-4 border-t border-neutral-200/80 pt-4 dark:border-white/10"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.topAuthors") }}
              </p>
              <p
                class="mt-1 text-sm leading-relaxed text-neutral-900 dark:text-white"
              >
                {{ metadata.readingTopAuthors.join(" · ") }}
              </p>
            </div>
          </div>
        </template>

        <!-- GitHub -->
        <template v-if="card.type === 'github'">
          <div
            v-if="
              metadata.contributions !== undefined ||
              metadata.commits !== undefined ||
              metadata.repos !== undefined
            "
            class="flex items-baseline justify-between gap-3"
          >
            <p
              class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{
                metadata.statsCategory ||
                t("currentVibes.cards.githubStats.statsCategory")
              }}
            </p>
            <p
              v-if="metadata.year"
              class="text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.year }}
            </p>
          </div>

          <div
            v-if="
              metadata.contributions !== undefined ||
              metadata.commits !== undefined ||
              metadata.repos !== undefined ||
              metadata.pullRequests ||
              metadata.pullRequestReviews ||
              metadata.issues ||
              metadata.reposContributedTo
            "
            class="mt-4 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3"
          >
            <div
              v-if="metadata.contributions !== undefined"
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.github.contributions") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.contributions.toLocaleString() }}
              </p>
            </div>
            <div v-if="metadata.commits !== undefined" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.github.commits") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.commits.toLocaleString() }}
              </p>
            </div>
            <div v-if="metadata.repos !== undefined" class="min-w-0">
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.github.repos") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.repos.toLocaleString() }}
              </p>
            </div>
            <div
              v-if="
                metadata.pullRequests !== undefined &&
                metadata.pullRequests > 0
              "
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.github.pullRequests") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.pullRequests.toLocaleString() }}
              </p>
            </div>
            <div
              v-if="
                metadata.pullRequestReviews !== undefined &&
                metadata.pullRequestReviews > 0
              "
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.githubStats.pullRequestReviews") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.pullRequestReviews.toLocaleString() }}
              </p>
            </div>
            <div
              v-if="metadata.issues !== undefined && metadata.issues > 0"
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.github.issues") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.issues.toLocaleString() }}
              </p>
            </div>
            <div
              v-if="
                metadata.reposContributedTo !== undefined &&
                metadata.reposContributedTo > 0
              "
              class="min-w-0"
            >
              <p
                class="text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.githubStats.reposContributedTo") }}
              </p>
              <p
                class="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.reposContributedTo.toLocaleString() }}
              </p>
            </div>
          </div>

          <div
            v-if="
              metadata.contributionsByMonth &&
              metadata.contributionsByMonth.length > 0
            "
            class="mt-6"
          >
            <p
              class="mb-3 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.githubStats.contributionsByMonth") }}
            </p>
            <div
              class="flex h-1.5 w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
            >
              <div
                v-for="(item, i) in metadata.contributionsByMonth"
                :key="i"
                :class="[
                  'h-full min-w-[2px]',
                  reducedMotion ? '' : 'transition-all duration-500',
                  barSegmentColors[i % barSegmentColors.length],
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
            <div class="mt-2.5 flex flex-wrap gap-x-4 gap-y-1">
              <div
                v-for="(item, i) in metadata.contributionsByMonth"
                :key="i"
                class="flex items-center gap-1.5"
              >
                <span
                  :class="[
                    'size-1.5 shrink-0 rounded-full',
                    barSegmentColors[i % barSegmentColors.length],
                  ]"
                />
                <span
                  class="text-[11px] text-neutral-500 dark:text-neutral-400"
                >
                  {{ item.label }}
                </span>
                <span
                  class="text-[11px] font-semibold tabular-nums text-neutral-800 dark:text-neutral-200"
                >
                  {{ item.count }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="
              metadata.topLanguages?.length || metadata.topRepos?.length
            "
            class="mt-6 flex flex-col gap-5 sm:flex-row sm:gap-8"
          >
            <div
              v-if="metadata.topLanguages?.length"
              class="min-w-0 flex-1"
            >
              <p
                class="mb-2.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.githubStats.topLanguages") }}
              </p>
              <div class="space-y-2.5">
                <div
                  v-for="(item, i) in metadata.topLanguages"
                  :key="`lang-${i}`"
                  class="min-w-0"
                >
                  <div class="flex items-baseline gap-2">
                    <span
                      class="w-3 shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                    >
                      {{ i + 1 }}
                    </span>
                    <p
                      class="min-w-0 flex-1 truncate text-[12px] font-medium text-neutral-900 dark:text-white md:text-[13px]"
                    >
                      {{ item.label }}
                    </p>
                    <span
                      class="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.percentage }}%
                    </span>
                  </div>
                  <div
                    class="mt-1 ml-5 h-px overflow-hidden bg-neutral-200 dark:bg-white/15"
                  >
                    <div
                      class="h-full bg-neutral-900 dark:bg-white"
                      :style="{
                        width: `${Math.max(6, item.percentage)}%`,
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="metadata.topRepos?.length"
              class="min-w-0 flex-1"
            >
              <p
                class="mb-2.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.githubStats.topRepos") }}
              </p>
              <div class="space-y-2.5">
                <div
                  v-for="(item, i) in metadata.topRepos"
                  :key="`repo-${i}`"
                  class="min-w-0"
                >
                  <div class="flex items-baseline gap-2">
                    <span
                      class="w-3 shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                    >
                      {{ i + 1 }}
                    </span>
                    <div class="min-w-0 flex-1">
                      <a
                        v-if="item.url"
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="block truncate text-[12px] font-medium text-neutral-900 underline-offset-2 hover:underline dark:text-white md:text-[13px]"
                      >
                        {{ item.label }}
                      </a>
                      <p
                        v-else
                        class="truncate text-[12px] font-medium text-neutral-900 dark:text-white md:text-[13px]"
                      >
                        {{ item.label }}
                      </p>
                    </div>
                    <span
                      class="shrink-0 text-[10px] tabular-nums text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.count.toLocaleString() }}
                    </span>
                  </div>
                  <div
                    class="mt-1 ml-5 h-px overflow-hidden bg-neutral-200 dark:bg-white/15"
                  >
                    <div
                      class="h-full bg-neutral-900 dark:bg-white"
                      :style="{
                        width: `${Math.max(
                          6,
                          (item.count /
                            Math.max(
                              ...metadata.topRepos!.map((r) => r.count),
                              1,
                            )) *
                            100,
                        )}%`,
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Map -->
        <template v-if="card.type === 'map'">
          <p
            v-if="metadata.description"
            :class="[
              'text-[13px] leading-relaxed',
              'text-neutral-700 dark:text-neutral-100',
            ]"
          >
            {{ metadata.description }}
          </p>

          <div class="mt-2 flex flex-wrap gap-1.5 md:gap-2">
            <div v-if="metadata.cities !== undefined" :class="pillClass">
              <MapPinIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  iconInkClass,
                ]"
              />
              <div class="flex min-w-0 flex-col">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    'text-neutral-600 dark:text-neutral-300',
                  ]"
                >
                  {{ t("currentVibes.cards.cities") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    'text-neutral-900 dark:text-white',
                  ]"
                >
                  {{ metadata.cities.toLocaleString() }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.countries !== undefined"
              :class="pillClass"
            >
              <FlagIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  iconInkClass,
                ]"
              />
              <div class="flex min-w-0 flex-col">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    'text-neutral-600 dark:text-neutral-300',
                  ]"
                >
                  {{ t("currentVibes.cards.countries") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    'text-neutral-900 dark:text-white',
                  ]"
                >
                  {{ metadata.countries.toLocaleString() }}
                </span>
              </div>
            </div>
            <div
              v-if="metadata.placesPinned !== undefined"
              :class="pillClass"
            >
              <GlobeIcon
                :class="[
                  'h-3 w-3 shrink-0 md:h-4 md:w-4',
                  iconInkClass,
                ]"
              />
              <div class="flex min-w-0 flex-col">
                <span
                  :class="[
                    'hidden text-[10px] font-medium uppercase tracking-wider md:block',
                    'text-neutral-600 dark:text-neutral-300',
                  ]"
                >
                  {{ t("currentVibes.cards.map.pinned") }}
                </span>
                <span
                  :class="[
                    'text-xs font-semibold tabular-nums md:text-sm',
                    'text-neutral-900 dark:text-white',
                  ]"
                >
                  {{ metadata.placesPinned.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="metadata.completionPercentage !== undefined"
            class="mt-3"
          >
            <div
              :class="[
                'h-1.5 w-full overflow-hidden rounded-full',
                'bg-neutral-200 dark:bg-white/20',
              ]"
            >
              <div
                :class="[
                  'h-full rounded-full',
                  reducedMotion ? '' : 'transition-all duration-500',
                  progressFillClass,
                ]"
                :style="{ width: `${metadata.completionPercentage}%` }"
              />
            </div>
            <span
              :class="[
                'mt-0.5 text-[10px] font-medium tabular-nums',
                'text-neutral-600 dark:text-neutral-300',
              ]"
            >
              {{ metadata.completionPercentage }}%
              {{ t("currentVibes.cards.map.completion") }}
            </span>
          </div>

          <div
            v-if="
              metadata.placesByCountry?.length ||
              metadata.morePlacesByCountry?.length
            "
            class="mt-4 flex flex-col gap-3"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p
                v-if="metadata.placesByCountry?.length"
                :class="[
                  'text-[9px] font-semibold uppercase tracking-wider md:text-[10px]',
                  'text-neutral-600 dark:text-neutral-300',
                ]"
              >
                {{ t("currentVibes.cards.map.itinerary") }}
              </p>
              <Popover v-if="metadata.morePlacesByCountry?.length">
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    class="text-[11px] font-medium text-neutral-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-200 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
                  >
                    {{
                      t("currentVibes.cards.map.moreStops", {
                        count: metadata.morePlacesCount,
                      })
                    }}
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  class="max-h-72 w-80 overflow-y-auto border-neutral-200 bg-white p-4 text-neutral-950 shadow-md dark:border-white/15 dark:bg-neutral-950 dark:text-white"
                >
                  <p
                    class="mb-3 text-[9px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 md:text-[10px]"
                  >
                    {{ t("currentVibes.cards.map.moreStopsTitle") }}
                  </p>
                  <div class="flex flex-col gap-2.5">
                    <div
                      v-for="group in metadata.morePlacesByCountry"
                      :key="`more-${group.country}`"
                      class="min-w-0"
                    >
                      <p
                        class="text-xs font-semibold tracking-tight text-neutral-950 dark:text-white md:text-sm"
                      >
                        {{ group.country }}
                        <span
                          class="ml-1.5 text-[10px] font-medium tabular-nums text-neutral-500 dark:text-neutral-400"
                        >
                          {{ group.cities.length }}
                        </span>
                      </p>
                      <p
                        class="mt-0.5 text-[12px] leading-relaxed text-neutral-700 dark:text-neutral-200 md:text-[13px]"
                      >
                        {{ group.cities.join(" · ") }}
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div
              v-if="metadata.placesByCountry?.length"
              class="min-w-0"
            >
              <p
                :class="[
                  'text-[12px] leading-relaxed md:text-[13px]',
                  'text-neutral-700 dark:text-neutral-200',
                ]"
              >
                {{
                  metadata.placesByCountry
                    .flatMap((group) => group.cities)
                    .join(" · ")
                }}
              </p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </article>
</template>
