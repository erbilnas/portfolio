<script setup lang="ts">
import { useI18n } from "#imports";
import type { CardMetadata } from "~/composables/current-vibes/cards-metadata";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";
import { useSettings } from "~/composables/settings";
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

const TravelGlobe = defineAsyncComponent(
  () => import("~/components/current-vibes/TravelGlobe.vue"),
);
const MusicTurntable = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/MusicTurntable.vue"),
);
const GamingCover = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/GamingCover.vue"),
);
const WatchingScreen = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/WatchingScreen.vue"),
);
const CodingCommitField = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/CodingCommitField.vue"),
);
const WritingDesk = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/WritingDesk.vue"),
);
const ReadingCover = defineAsyncComponent(
  () => import("~/components/current-vibes/scenes/ReadingCover.vue"),
);

const stageRoot = ref<HTMLElement | null>(null);
/** WebGL/scene mount gate: on near viewport, off when far (saves GPU/CPU). */
const sceneReady = ref(false);
let sceneObserver: IntersectionObserver | null = null;
let idleRevealHandle: number | null = null;

onMounted(() => {
  if (!import.meta.client || !stageRoot.value) {
    sceneReady.value = true;
    return;
  }

  const el = stageRoot.value;

  if (typeof IntersectionObserver === "undefined") {
    sceneReady.value = true;
    return;
  }

  sceneObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (!visible) {
        if (idleRevealHandle != null && typeof cancelIdleCallback === "function") {
          cancelIdleCallback(idleRevealHandle);
          idleRevealHandle = null;
        }
        sceneReady.value = false;
        return;
      }
      if (sceneReady.value) return;
      if (typeof requestIdleCallback === "function") {
        idleRevealHandle = requestIdleCallback(
          () => {
            idleRevealHandle = null;
            sceneReady.value = true;
          },
          { timeout: 1200 },
        );
      } else {
        sceneReady.value = true;
      }
    },
    { rootMargin: "200px 0px" },
  );
  sceneObserver.observe(el);
});

onUnmounted(() => {
  sceneObserver?.disconnect();
  sceneObserver = null;
  if (idleRevealHandle != null && typeof cancelIdleCallback === "function") {
    cancelIdleCallback(idleRevealHandle);
    idleRevealHandle = null;
  }
});

const moreBlogPosts = computed(() => {
  const recent = props.metadata.blogRecent ?? [];
  const featuredTitle = props.metadata.title;
  const rest = recent.filter((post) => post.title !== featuredTitle);
  return rest.length ? rest : recent.slice(1);
});

const githubMonthsWithActivity = computed(() =>
  (props.metadata.contributionsByMonth ?? []).filter((m) => m.count > 0),
);

const githubTopLanguages = computed(() =>
  (props.metadata.topLanguages ?? [])
    .filter((lang) => lang.percentage > 0)
    .slice(0, 5),
);

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

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
      ref="stageRoot"
      :class="[
        'relative min-w-0 w-full overflow-hidden bg-neutral-200 dark:bg-neutral-900 md:aspect-auto md:min-h-[44rem] lg:min-h-[48rem]',
        // Music is a wide product shot — keep mobile stage closer to square.
        // Portrait media (cart / book / poster) can stay taller.
        card.type === 'music'
          ? 'aspect-[5/6] sm:aspect-[4/5]'
          : 'aspect-[3/4] sm:aspect-[2/3]',
        coverTransitionClass,
      ]"
    >
      <ClientOnly>
        <div v-if="sceneReady" class="absolute inset-0">
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
        <div
          v-else
          class="absolute inset-0 bg-neutral-200 dark:bg-neutral-900"
          aria-hidden="true"
        />
        <template #fallback>
          <div
            class="absolute inset-0 bg-neutral-200 dark:bg-neutral-900"
            aria-hidden="true"
          />
        </template>
      </ClientOnly>
    </div>

    <div
      class="flex min-w-0 flex-col px-6 py-8 sm:px-8 sm:py-10 md:min-h-[44rem] md:px-10 md:py-12 lg:min-h-[48rem]"
    >
      <div class="flex min-h-0 flex-1 flex-col gap-8" aria-live="polite">
        <header class="flex flex-col gap-3">
          <p
            class="text-xs font-medium text-neutral-500 dark:text-neutral-400 md:text-sm"
          >
            {{ metadata.category }}
          </p>
          <h3
            :id="`vibes-featured-title-${card.type}`"
            :class="[
              'font-semibold tracking-tight text-neutral-950 [text-wrap:balance] dark:text-white',
              card.type === 'music'
                ? 'line-clamp-3 text-2xl md:text-4xl'
                : 'text-3xl md:text-5xl',
            ]"
          >
            {{ metadata.title }}
          </h3>
          <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-300"
          >
            <template v-if="card.type === 'game'">
              <span
                v-if="metadata.platform"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.platform }}
              </span>
              <span
                v-if="metadata.platform && metadata.progress"
                class="text-neutral-300 dark:text-neutral-600"
                aria-hidden="true"
                >·</span
              >
              <span v-if="metadata.progress" class="tabular-nums">
                {{ metadata.progress }} {{ t("currentVibes.cards.hours") }}
              </span>
            </template>
            <template v-else-if="card.type === 'trakt'">
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
                class="text-neutral-300 dark:text-neutral-600"
                aria-hidden="true"
                >·</span
              >
              <span v-if="metadata.watchedDate">{{ metadata.watchedDate }}</span>
              <template v-if="metadata.runtime">
                <span
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="tabular-nums"
                  >{{ metadata.runtime }}
                  {{ t("currentVibes.cards.trakt.minutes") }}</span
                >
              </template>
            </template>
            <template v-else-if="card.type === 'reading'">
              <span
                v-if="metadata.author"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.author }}
              </span>
              <template
                v-if="
                  metadata.readingProgressPage && metadata.readingPages
                "
              >
                <span
                  v-if="metadata.author"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="tabular-nums">
                  {{
                    t("currentVibes.cards.reading.pageOf", {
                      current: metadata.readingProgressPage,
                      total: metadata.readingPages,
                    })
                  }}
                </span>
              </template>
              <template
                v-else-if="metadata.readingPages || metadata.readingDate"
              >
                <span
                  v-if="metadata.author && metadata.readingPages"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span
                  v-if="metadata.readingPages"
                  class="tabular-nums"
                >
                  {{ metadata.readingPages.toLocaleString() }}
                  {{ t("currentVibes.cards.reading.pages") }}
                </span>
                <template v-if="metadata.readingDate">
                  <span
                    class="text-neutral-300 dark:text-neutral-600"
                    aria-hidden="true"
                    >·</span
                  >
                  <span class="tabular-nums">{{ metadata.readingDate }}</span>
                </template>
              </template>
            </template>
            <template v-else-if="card.type === 'music'">
              <span
                v-if="metadata.artist"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.artist }}
              </span>
              <template v-if="metadata.album">
                <span
                  v-if="metadata.artist"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="min-w-0 truncate">{{ metadata.album }}</span>
              </template>
            </template>
            <template v-else-if="card.type === 'blog'">
              <span
                v-if="metadata.publishedDate"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.publishedDate }}
              </span>
              <template v-if="metadata.readTime">
                <span
                  v-if="metadata.publishedDate"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="tabular-nums"
                  >{{ metadata.readTime }}
                  {{ t("currentVibes.cards.minRead") }}</span
                >
              </template>
            </template>
            <template v-else-if="card.type === 'github'">
              <span
                v-if="metadata.year"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.year }}
              </span>
              <template v-if="metadata.commits !== undefined">
                <span
                  v-if="metadata.year"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="tabular-nums"
                  >{{ metadata.commits.toLocaleString() }}
                  {{ t("currentVibes.cards.github.commits") }}</span
                >
              </template>
            </template>
            <template v-else-if="card.type === 'map'">
              <span
                v-if="metadata.cities !== undefined"
                class="font-medium tabular-nums text-neutral-900 dark:text-white"
              >
                {{ metadata.cities.toLocaleString() }}
                {{ t("currentVibes.cards.cities") }}
              </span>
              <template v-if="metadata.countries !== undefined">
                <span
                  v-if="metadata.cities !== undefined"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                  >·</span
                >
                <span class="tabular-nums"
                  >{{ metadata.countries.toLocaleString() }}
                  {{ t("currentVibes.cards.countries") }}</span
                >
              </template>
            </template>
            <a
              v-if="metadata.visitUrl"
              :href="metadata.visitUrl"
              :target="isExternalUrl(metadata.visitUrl) ? '_blank' : undefined"
              :rel="
                isExternalUrl(metadata.visitUrl)
                  ? 'noopener noreferrer'
                  : undefined
              "
              class="inline-flex items-center gap-1 font-medium text-neutral-950 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
              :class="
                card.type === 'game' ||
                card.type === 'trakt' ||
                card.type === 'reading' ||
                card.type === 'music' ||
                card.type === 'blog' ||
                card.type === 'github' ||
                card.type === 'map'
                  ? 'ml-auto'
                  : ''
              "
            >
              {{ t("currentVibes.cards.visit") }}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </header>

      <div
        :class="[
          'flex min-h-0 flex-1 flex-col text-sm',
          'text-neutral-900 dark:text-white',
        ]"
      >
        <!-- Game -->
        <template v-if="card.type === 'game'">
          <div class="flex flex-col gap-6">
            <p
              v-if="metadata.genres?.length"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span class="sr-only">
                {{ t("currentVibes.cards.gameStats.genres") }}
              </span>
              {{ metadata.genres.join(" · ") }}
            </p>

            <p
              v-if="metadata.description"
              class="line-clamp-3 text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.description }}
            </p>

            <div
              v-if="
                metadata.progressPercentage !== undefined &&
                metadata.progressPercentage > 0
              "
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <span
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.progressPercentage }}%
                </span>
                <span
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.gameStats.complete") }}
                </span>
              </div>
              <div
                class="mt-2.5 h-px w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
              >
                <div
                  :class="[
                    'h-full bg-neutral-900 dark:bg-white',
                    reducedMotion ? '' : 'transition-[width] duration-500',
                  ]"
                  :style="{ width: `${metadata.progressPercentage}%` }"
                />
              </div>
            </div>
          </div>

          <div
            class="mt-auto flex flex-col gap-8 pt-12"
          >
          <dl
            v-if="
              metadata.totalHours !== undefined ||
              metadata.platforms?.length ||
              metadata.gamesPlayed !== undefined ||
              metadata.gamesCompleted !== undefined
            "
            class="border-t border-neutral-200 dark:border-white/15"
          >
            <div
              v-if="metadata.platforms?.length"
              class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
            >
              <dt
                class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.platforms") }}
              </dt>
              <dd class="flex items-baseline gap-2 text-right">
                <span
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.platforms.length }}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      class="text-[11px] font-medium text-neutral-500 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-400 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
                    >
                      {{ t("currentVibes.cards.gameStats.platformsView") }}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
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
              </dd>
            </div>
            <div
              v-if="metadata.gamesCompleted !== undefined"
              class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
            >
              <dt
                class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.gamesCompleted") }}
              </dt>
              <dd class="text-right">
                <p
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
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
              </dd>
            </div>
            <div
              v-if="metadata.totalHours !== undefined"
              class="flex items-baseline justify-between gap-4 py-3.5"
            >
              <dt
                class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.gameStats.totalHours") }}
              </dt>
              <dd
                class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
              >
                {{ metadata.totalHours.toLocaleString() }}
              </dd>
            </div>
          </dl>

          <div
            v-if="metadata.releaseByYear && metadata.releaseByYear.length > 0"
            class="mt-6"
          >
            <p
              class="mb-2.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.gameStats.gamesByYear") }}
            </p>
            <div
              class="flex h-1 w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
            >
              <div
                v-for="(item, i) in metadata.releaseByYear"
                :key="i"
                :class="[
                  'h-full min-w-[2px]',
                  reducedMotion ? '' : 'transition-[width] duration-500',
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
                    'size-1.5 shrink-0',
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
          </div>
        </template>

        <!-- Music -->
        <template v-if="card.type === 'music'">
          <div class="flex flex-col gap-6">
            <p
              v-if="!metadata.artist && !metadata.album"
              class="text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.music.emptyHint") }}
            </p>

            <p
              v-if="metadata.topGenres?.length"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span class="sr-only">
                {{ t("currentVibes.cards.spotifyStats.genres") }}
              </span>
              {{ metadata.topGenres.join(" · ") }}
            </p>

            <p
              v-if="metadata.listeningPeriod"
              class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ t("currentVibes.cards.spotifyStats.statsCategory") }}
              ·
              {{ metadata.listeningPeriod }}
            </p>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.topArtistsCount !== undefined ||
                metadata.topTracksCount !== undefined ||
                metadata.topGenres?.length
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                v-if="metadata.topArtistsCount !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.topArtists") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.topArtistsCount.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.topTracksCount !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.topTracks") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.topTracksCount.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.topGenres?.length"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.topGenres") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.topGenres.length.toLocaleString() }}
                </dd>
              </div>
            </dl>

            <div
              v-if="
                metadata.topArtistsByMonth?.length ||
                metadata.topTracksByMonth?.length
              "
              class="grid gap-6 sm:grid-cols-2 sm:gap-8"
            >
              <div
                v-if="metadata.topArtistsByMonth?.length"
                class="min-w-0"
              >
                <p
                  class="mb-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.topArtistsChart") }}
                </p>
                <ol class="flex flex-col">
                  <li
                    v-for="(item, i) in metadata.topArtistsByMonth.slice(0, 5)"
                    :key="`artist-${i}`"
                    class="flex items-baseline justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
                  >
                    <span
                      class="flex min-w-0 items-baseline gap-2 text-[13px] text-neutral-900 dark:text-white"
                    >
                      <span
                        class="w-3 shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                        >{{ i + 1 }}</span
                      >
                      <span class="min-w-0 truncate font-medium">{{
                        item.label
                      }}</span>
                    </span>
                    <span
                      v-if="item.popularity !== undefined"
                      class="shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.popularity }}
                    </span>
                  </li>
                </ol>
              </div>

              <div
                v-if="metadata.topTracksByMonth?.length"
                class="min-w-0"
              >
                <p
                  class="mb-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.spotifyStats.topTracksChart") }}
                </p>
                <ol class="flex flex-col">
                  <li
                    v-for="(item, i) in metadata.topTracksByMonth.slice(0, 5)"
                    :key="`track-${i}`"
                    class="flex items-baseline justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
                  >
                    <span class="min-w-0">
                      <span
                        class="flex items-baseline gap-2 text-[13px] text-neutral-900 dark:text-white"
                      >
                        <span
                          class="w-3 shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                          >{{ i + 1 }}</span
                        >
                        <span class="min-w-0 truncate font-medium">{{
                          item.label
                        }}</span>
                      </span>
                      <span
                        v-if="item.subtitle"
                        class="mt-0.5 block truncate pl-5 text-[11px] text-neutral-500 dark:text-neutral-400"
                      >
                        {{ item.subtitle }}
                      </span>
                    </span>
                    <span
                      v-if="item.popularity !== undefined"
                      class="shrink-0 self-center tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.popularity }}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </template>

        <!-- Blog -->
        <template v-if="card.type === 'blog'">
          <div class="flex flex-col gap-6">
            <p
              v-if="metadata.description"
              class="line-clamp-4 text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.description }}
            </p>

            <p
              v-if="metadata.blogTopics?.length"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span class="sr-only">
                {{ t("currentVibes.cards.blog.topics") }}
              </span>
              {{ metadata.blogTopics.join(" · ") }}
            </p>

            <div
              v-if="metadata.blogAverageReadTime !== undefined"
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <p
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.blogAverageReadTime }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                  >
                    {{ t("currentVibes.cards.minRead") }}
                  </span>
                </p>
                <p
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.avgReadTime") }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.blogPostsInFeed !== undefined ||
                (metadata.blogPostsThisYear !== undefined &&
                  metadata.blogPostsThisYear > 0)
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                v-if="metadata.blogPostsInFeed !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.posts") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.blogPostsInFeed.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="
                  metadata.blogPostsThisYear !== undefined &&
                  metadata.blogPostsThisYear > 0
                "
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.blog.thisYear") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.blogPostsThisYear.toLocaleString() }}
                </dd>
              </div>
            </dl>

            <div
              v-if="moreBlogPosts.length"
              class="min-w-0"
            >
              <p
                class="mb-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.blog.recentTitle") }}
              </p>
              <ul
                class="flex flex-col border-t border-neutral-200 dark:border-white/15"
              >
                <li
                  v-for="post in moreBlogPosts"
                  :key="post.link"
                  class="min-w-0 border-b border-neutral-200 py-3 last:border-b-0 dark:border-white/15"
                >
                  <a
                    :href="post.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="block text-[13px] font-medium leading-snug text-neutral-950 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
                  >
                    {{ post.title }}
                  </a>
                  <p
                    class="mt-1 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
                  >
                    {{ post.publishedDate }}
                    <template v-if="post.readTime">
                      · {{ post.readTime }}
                      {{ t("currentVibes.cards.minRead") }}
                    </template>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </template>

        <!-- Trakt -->
        <template v-if="card.type === 'trakt'">
          <div class="flex flex-col gap-6">
            <p
              v-if="metadata.subtitle"
              class="text-sm font-medium text-neutral-900 dark:text-white"
            >
              {{ metadata.subtitle }}
            </p>

            <p
              v-if="metadata.tagline"
              class="text-[13px] italic leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.tagline }}
            </p>

            <p
              v-if="metadata.overview"
              class="line-clamp-3 text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.overview }}
            </p>

            <p
              v-if="metadata.genres?.length"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span class="sr-only">
                {{ t("currentVibes.cards.trakt.genres") }}
              </span>
              {{ metadata.genres.join(" · ") }}
            </p>

            <div
              v-if="metadata.rating !== undefined"
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <p
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.rating }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                    >/10</span
                  >
                </p>
                <p
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  <span class="block">
                    {{ t("currentVibes.cards.trakt.rating") }}
                  </span>
                  <span
                    v-if="metadata.votes !== undefined"
                    class="mt-0.5 block tabular-nums font-normal"
                  >
                    {{ metadata.votes.toLocaleString() }}
                    {{ t("currentVibes.cards.trakt.votes") }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.traktTotalHours !== undefined ||
                metadata.traktMoviesWatched !== undefined ||
                metadata.traktShowsWatched !== undefined ||
                metadata.traktEpisodesWatched !== undefined
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                v-if="metadata.traktTotalHours !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.totalWatched") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.traktTotalHours.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.traktMoviesWatched !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.moviesWatched") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.traktMoviesWatched.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.traktShowsWatched !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.showsWatched") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.traktShowsWatched.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.traktEpisodesWatched !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.trakt.episodesWatched") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.traktEpisodesWatched.toLocaleString() }}
                </dd>
              </div>
            </dl>
          </div>
        </template>

        <!-- Reading -->
        <template v-if="card.type === 'reading'">
          <div class="flex flex-col gap-6">
            <p
              v-if="
                metadata.readingBookFormat || metadata.readingLanguage
              "
              class="text-sm text-neutral-600 dark:text-neutral-300"
            >
              <span
                v-if="metadata.readingBookFormat"
                class="font-medium text-neutral-900 dark:text-white"
              >
                {{ metadata.readingBookFormat }}
              </span>
              <template v-if="metadata.readingLanguage">
                <span
                  v-if="metadata.readingBookFormat"
                  class="text-neutral-300 dark:text-neutral-600"
                  aria-hidden="true"
                >
                  ·
                </span>
                {{ metadata.readingLanguage }}
              </template>
            </p>

            <p
              v-if="metadata.readingGenres?.length"
              class="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <span class="sr-only">
                {{ t("currentVibes.cards.reading.genres") }}
              </span>
              {{ metadata.readingGenres.join(" · ") }}
            </p>

            <div
              v-if="
                metadata.readingProgressPercentage !== undefined &&
                metadata.readingProgressPercentage > 0
              "
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <span
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.readingProgressPercentage }}%
                </span>
                <span
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.progress") }}
                </span>
              </div>
              <div
                class="mt-2.5 h-px w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
              >
                <div
                  :class="[
                    'h-full bg-neutral-900 dark:bg-white',
                    reducedMotion ? '' : 'transition-[width] duration-500',
                  ]"
                  :style="{
                    width: `${metadata.readingProgressPercentage}%`,
                  }"
                />
              </div>
              <p
                v-if="metadata.readingAverageRating !== undefined"
                class="mt-2 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.avgRating") }}
                {{ metadata.readingAverageRating }}/5
                <template v-if="metadata.readingRatingCount !== undefined">
                  ·
                  {{ metadata.readingRatingCount.toLocaleString() }}
                  {{ t("currentVibes.cards.reading.votes") }}
                </template>
              </p>
            </div>

            <div
              v-else-if="
                metadata.readingAverageRating !== undefined ||
                metadata.readingUserRating !== undefined
              "
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <p
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{
                    metadata.readingUserRating ??
                    metadata.readingAverageRating
                  }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                    >/5</span
                  >
                </p>
                <p
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  <span class="block">
                    {{
                      metadata.readingUserRating !== undefined
                        ? t("currentVibes.cards.reading.myRating")
                        : t("currentVibes.cards.reading.avgRating")
                    }}
                  </span>
                  <span
                    v-if="
                      metadata.readingUserRating === undefined &&
                      metadata.readingRatingCount !== undefined
                    "
                    class="mt-0.5 block tabular-nums font-normal"
                  >
                    {{ metadata.readingRatingCount.toLocaleString() }}
                    {{ t("currentVibes.cards.reading.votes") }}
                  </span>
                </p>
              </div>
              <p
                v-if="
                  metadata.readingUserRating !== undefined &&
                  metadata.readingAverageRating !== undefined
                "
                class="mt-2 text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.reading.avgRating") }}
                {{ metadata.readingAverageRating }}/5
                <template v-if="metadata.readingRatingCount !== undefined">
                  ·
                  {{ metadata.readingRatingCount.toLocaleString() }}
                  {{ t("currentVibes.cards.reading.votes") }}
                </template>
              </p>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.readingBooksRead !== undefined ||
                metadata.readingBooksThisYear !== undefined ||
                metadata.readingCurrentlyReading !== undefined ||
                metadata.readingToRead !== undefined ||
                metadata.readingAvgUserRating !== undefined ||
                metadata.readingPagesRead !== undefined ||
                metadata.readingTopAuthors?.length
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                v-if="metadata.readingBooksRead !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.booksRead") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingBooksRead.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.readingBooksThisYear !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.thisYear") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingBooksThisYear.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.readingCurrentlyReading !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.inProgress") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingCurrentlyReading.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.readingToRead !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.toRead") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingToRead.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.readingAvgUserRating !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.avgMyRating") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingAvgUserRating }}
                  <span
                    class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
                    >/5</span
                  >
                </dd>
              </div>
              <div
                v-if="metadata.readingPagesRead !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.pagesRead") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.readingPagesRead.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.readingTopAuthors?.length"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.reading.topAuthors") }}
                </dt>
                <dd
                  class="max-w-[60%] text-right text-sm leading-snug text-neutral-900 dark:text-white"
                >
                  {{ metadata.readingTopAuthors.join(" · ") }}
                </dd>
              </div>
            </dl>
          </div>
        </template>

        <!-- GitHub -->
        <template v-if="card.type === 'github'">
          <div class="flex flex-col gap-6">
            <div
              v-if="metadata.contributions !== undefined"
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <p
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.contributions.toLocaleString() }}
                </p>
                <p
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  <span class="block">
                    {{ t("currentVibes.cards.github.contributions") }}
                  </span>
                  <span class="mt-0.5 block font-normal">
                    {{
                      metadata.statsCategory ||
                      t("currentVibes.cards.githubStats.statsCategory")
                    }}
                  </span>
                </p>
              </div>
            </div>

            <div
              v-if="githubMonthsWithActivity.length > 0"
              class="pt-1"
            >
              <p
                class="mb-2.5 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {{ t("currentVibes.cards.githubStats.contributionsByMonth") }}
              </p>
              <div
                class="flex h-1 w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
              >
                <div
                  v-for="(item, i) in metadata.contributionsByMonth"
                  :key="i"
                  :class="[
                    'h-full',
                    item.count > 0 ? 'min-w-[2px]' : '',
                    reducedMotion ? '' : 'transition-[width] duration-500',
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
              <div
                class="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3"
              >
                <div
                  v-for="item in githubMonthsWithActivity"
                  :key="item.label"
                  class="flex items-baseline justify-between gap-2"
                >
                  <span
                    class="min-w-0 truncate text-[11px] text-neutral-500 dark:text-neutral-400"
                  >
                    {{ item.label }}
                  </span>
                  <span
                    class="shrink-0 text-[11px] font-semibold tabular-nums text-neutral-800 dark:text-neutral-200"
                  >
                    {{ item.count.toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.repos !== undefined ||
                (metadata.pullRequests !== undefined &&
                  metadata.pullRequests > 0) ||
                (metadata.pullRequestReviews !== undefined &&
                  metadata.pullRequestReviews > 0) ||
                (metadata.issues !== undefined && metadata.issues > 0) ||
                (metadata.reposContributedTo !== undefined &&
                  metadata.reposContributedTo > 0)
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                v-if="metadata.repos !== undefined"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.github.repos") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.repos.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="
                  metadata.pullRequests !== undefined &&
                  metadata.pullRequests > 0
                "
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.github.pullRequests") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.pullRequests.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="
                  metadata.pullRequestReviews !== undefined &&
                  metadata.pullRequestReviews > 0
                "
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.githubStats.pullRequestReviews") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.pullRequestReviews.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="metadata.issues !== undefined && metadata.issues > 0"
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.github.issues") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.issues.toLocaleString() }}
                </dd>
              </div>
              <div
                v-if="
                  metadata.reposContributedTo !== undefined &&
                  metadata.reposContributedTo > 0
                "
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.githubStats.reposContributedTo") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.reposContributedTo.toLocaleString() }}
                </dd>
              </div>
            </dl>

            <div
              v-if="githubTopLanguages.length || metadata.topRepos?.length"
              class="grid gap-6 sm:grid-cols-2 sm:gap-8"
            >
              <div
                v-if="githubTopLanguages.length"
                class="min-w-0"
              >
                <p
                  class="mb-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.githubStats.topLanguages") }}
                </p>
                <ol class="flex flex-col">
                  <li
                    v-for="(item, i) in githubTopLanguages"
                    :key="`lang-${i}`"
                    class="flex items-baseline justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
                  >
                    <span
                      class="flex min-w-0 items-baseline gap-2 text-[13px] text-neutral-900 dark:text-white"
                    >
                      <span
                        class="w-3 shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                        >{{ i + 1 }}</span
                      >
                      <span class="min-w-0 truncate font-medium">{{
                        item.label
                      }}</span>
                    </span>
                    <span
                      class="shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.percentage }}%
                    </span>
                  </li>
                </ol>
              </div>

              <div
                v-if="metadata.topRepos?.length"
                class="min-w-0"
              >
                <p
                  class="mb-2 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.githubStats.topRepos") }}
                </p>
                <ol class="flex flex-col">
                  <li
                    v-for="(item, i) in metadata.topRepos.slice(0, 5)"
                    :key="`repo-${i}`"
                    class="flex items-baseline justify-between gap-3 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
                  >
                    <span
                      class="flex min-w-0 items-baseline gap-2 text-[13px] text-neutral-900 dark:text-white"
                    >
                      <span
                        class="w-3 shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                        >{{ i + 1 }}</span
                      >
                      <a
                        v-if="item.url"
                        :href="item.url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="min-w-0 truncate font-medium underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
                      >
                        {{ item.label }}
                      </a>
                      <span
                        v-else
                        class="min-w-0 truncate font-medium"
                      >
                        {{ item.label }}
                      </span>
                    </span>
                    <span
                      class="shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                    >
                      {{ item.count.toLocaleString() }}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </template>

        <!-- Map -->
        <template v-if="card.type === 'map'">
          <div class="flex flex-col gap-6">
            <p
              v-if="metadata.description"
              class="text-[13px] leading-relaxed text-pretty text-neutral-500 dark:text-neutral-400"
            >
              {{ metadata.description }}
            </p>

            <div
              v-if="metadata.completionPercentage !== undefined"
              class="pt-1"
            >
              <div class="flex items-baseline justify-between gap-4">
                <p
                  class="text-3xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ metadata.completionPercentage }}%
                </p>
                <p
                  class="text-right text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.map.completion") }}
                </p>
              </div>
              <div
                class="mt-2.5 h-px w-full overflow-hidden bg-neutral-200 dark:bg-white/15"
              >
                <div
                  :class="[
                    'h-full bg-neutral-900 dark:bg-white',
                    reducedMotion ? '' : 'transition-[width] duration-500',
                  ]"
                  :style="{
                    width: `${metadata.completionPercentage}%`,
                  }"
                />
              </div>
            </div>
          </div>

          <div class="mt-auto flex flex-col gap-8 pt-12">
            <dl
              v-if="
                metadata.placesPinned !== undefined &&
                metadata.placesPinned !== metadata.cities
              "
              class="border-t border-neutral-200 dark:border-white/15"
            >
              <div
                class="flex items-baseline justify-between gap-4 border-b border-neutral-200 py-3.5 last:border-b-0 dark:border-white/15"
              >
                <dt
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.map.pinned") }}
                </dt>
                <dd
                  class="text-xl font-semibold tracking-tight tabular-nums text-neutral-950 dark:text-white"
                >
                  {{ metadata.placesPinned.toLocaleString() }}
                </dd>
              </div>
            </dl>

            <div
              v-if="
                metadata.placesByCountry?.length ||
                metadata.morePlacesByCountry?.length
              "
              class="min-w-0"
            >
              <div class="mb-2 flex items-baseline justify-between gap-3">
                <p
                  class="text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                >
                  {{ t("currentVibes.cards.map.itinerary") }}
                </p>
                <Popover v-if="metadata.morePlacesByCountry?.length">
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      class="shrink-0 text-[11px] font-medium text-neutral-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-neutral-200 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black"
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
                      class="mb-3 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
                    >
                      {{ t("currentVibes.cards.map.moreStopsTitle") }}
                    </p>
                    <div class="flex flex-col">
                      <div
                        v-for="group in metadata.morePlacesByCountry"
                        :key="`more-${group.country}`"
                        class="min-w-0 border-b border-neutral-200 py-2.5 last:border-b-0 dark:border-white/15"
                      >
                        <p
                          class="flex items-baseline justify-between gap-3 text-[13px] font-medium text-neutral-950 dark:text-white"
                        >
                          <span class="min-w-0 truncate">{{
                            group.country
                          }}</span>
                          <span
                            class="shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                          >
                            {{ group.cities.length }}
                          </span>
                        </p>
                        <p
                          class="mt-0.5 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400"
                        >
                          {{ group.cities.join(" · ") }}
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <ul
                v-if="metadata.placesByCountry?.length"
                class="flex flex-col border-t border-neutral-200 dark:border-white/15"
              >
                <li
                  v-for="group in metadata.placesByCountry"
                  :key="group.country"
                  class="min-w-0 border-b border-neutral-200 py-3 last:border-b-0 dark:border-white/15"
                >
                  <p
                    class="flex items-baseline justify-between gap-3 text-[13px] font-medium text-neutral-950 dark:text-white"
                  >
                    <span class="min-w-0 truncate">{{ group.country }}</span>
                    <span
                      class="shrink-0 tabular-nums text-[11px] text-neutral-500 dark:text-neutral-400"
                    >
                      {{ group.cities.length }}
                    </span>
                  </p>
                  <p
                    class="mt-1 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400"
                  >
                    {{ group.cities.join(" · ") }}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
      </div>
    </div>
  </article>
</template>
