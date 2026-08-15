import { useI18n } from "#imports";
import type {
  GitHubStats,
  GoodreadsBook,
  HLTBStats,
  MediumPost,
  MusicPlayerData,
  SingleGameDetail,
  TraktWatchedDetail,
} from "~/types/current-vibes";
import {
  groupTravelPlacesByCountry,
  type TravelPlace,
} from "~/utils/parse-travel-places";
import type { CardData } from "./current-vibes-data";

export interface TravelPlaceGroupMeta {
  country: string;
  cities: string[];
}

export interface CardMetadata {
  title: string;
  category: string;
  src: string;
  visitUrl?: string;
  // Game specific
  progress?: string;
  progressPercentage?: number;
  platform?: string;
  description?: string;
  genres?: string[];
  // Music specific
  artist?: string;
  album?: string;
  isPlaying?: boolean;
  topArtistsByMonth?: {
    label: string;
    count: number;
    subtitle?: string;
    popularity?: number;
  }[];
  topTracksByMonth?: {
    label: string;
    count: number;
    subtitle?: string;
    popularity?: number;
  }[];
  topTracksCount?: number;
  topArtistsCount?: number;
  topGenres?: string[];
  listeningPeriod?: string;
  // Blog specific
  readTime?: number;
  publishedDate?: string;
  blogPostsInFeed?: number;
  blogPostsThisYear?: number;
  blogAverageReadTime?: number;
  blogTopics?: string[];
  blogRecent?: {
    title: string;
    link: string;
    publishedDate: string;
    readTime?: number;
  }[];
  // Map specific
  cities?: number;
  countries?: number;
  completionPercentage?: number;
  placesPinned?: number;
  placesByCountry?: TravelPlaceGroupMeta[];
  morePlacesByCountry?: TravelPlaceGroupMeta[];
  morePlacesCount?: number;
  // Trakt specific
  watchedDate?: string;
  mediaType?: "movie" | "episode";
  subtitle?: string;
  overview?: string;
  tagline?: string;
  rating?: number;
  votes?: number;
  runtime?: number;
  genres?: string[];
  traktMoviesWatched?: number;
  traktShowsWatched?: number;
  traktEpisodesWatched?: number;
  traktTotalHours?: number;
  // GitHub specific
  commits?: number;
  repos?: number;
  contributions?: number;
  pullRequests?: number;
  issues?: number;
  pullRequestReviews?: number;
  reposContributedTo?: number;
  year?: number;
  contributionsByMonth?: { label: string; count: number }[];
  topLanguages?: { label: string; count: number; percentage: number }[];
  topRepos?: { label: string; count: number; url?: string }[];
  statsCategory?: string;
  // Reading / Goodreads
  author?: string;
  readingDate?: string;
  readingStatus?: "reading" | "finished";
  readingPages?: number;
  readingUserRating?: number;
  readingAverageRating?: number;
  readingBooksRead?: number;
  readingBooksThisYear?: number;
  readingCurrentlyReading?: number;
  readingToRead?: number;
  readingAvgUserRating?: number;
  readingPagesRead?: number;
  readingTopAuthors?: string[];
  // Game stats specific
  totalHours?: number;
  gamesPlayed?: number;
  gamesCompleted?: number;
  completionRate?: number;
  platforms?: string[];
  releaseByYear?: { label: string; count: number }[];
}

/**
 * Calculate progress percentage for a game
 */
const calculateProgressPercentage = (game: SingleGameDetail | undefined) => {
  if (!game?.progress || !game?.completion_time) return 0;
  const hours = parseFloat(game.progress);
  return Math.min(Math.round((hours / game.completion_time) * 100), 100);
};

/**
 * Calculate read time in minutes for blog post
 */
const calculateReadTime = (description: string | undefined) => {
  if (!description) return 0;
  const wordsPerMinute = 200;
  const strippedHtml = description.replace(/<[^>]*>/g, "");
  const cleanText = strippedHtml
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = cleanText
    .split(" ")
    .filter((word) => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

/**
 * Format date string to readable format
 */
const formatDate = (dateString: string | undefined, locale: string) => {
  if (!dateString) return "";
  const localeMap: Record<string, string> = {
    tr: "tr-TR",
    ja: "ja-JP",
    en: "en-US",
  };
  return new Date(dateString).toLocaleDateString(
    localeMap[locale] || "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );
};

/**
 * Truncate description to max length
 */
const truncateDescription = (
  description: string | undefined,
  maxLength = 150,
) => {
  if (!description) return "";
  const strippedText = description.replace(/<[^>]*>/g, "");
  return strippedText.length <= maxLength
    ? strippedText
    : strippedText.slice(0, maxLength) + "...";
};

export const useCardsMetadata = () => {
  // Lazy get appConfig to avoid $r initialization errors
  // useAppConfig is safe, but deferring access ensures Vue is ready
  const getAppConfig = () => useAppConfig();
  const { t, locale } = useI18n();

  /**
   * Get metadata for a card based on its type
   */
  const getCardMetadata = (card: CardData, _index: number): CardMetadata => {
    try {
      const appConfig = getAppConfig();
      switch (card.type) {
        case "game": {
          const gameData = card.data as SingleGameDetail & {
            stats?: HLTBStats | null;
          };
          const game = gameData as SingleGameDetail;
          const stats = gameData?.stats;

          const visitUrl = appConfig.socialLinks.howlongtobeat || undefined;
          const platformParts = [game?.platform, game?.storefront].filter(
            Boolean,
          );
          const platform =
            platformParts.length > 0 ? platformParts.join(" / ") : undefined;

          const metadata = {
            title: game?.title || t("currentVibes.cards.game.defaultTitle"),
            category:
              game?.status === "playing"
                ? t("currentVibes.cards.game.currentlyPlaying")
                : t("currentVibes.cards.game.recentlyCompleted"),
            src: game?.image || "/images/blog-post-card-bg.jpg",
            progress: game?.progress,
            progressPercentage: calculateProgressPercentage(game),
            platform,
            description: game?.description,
            genres: game?.genres ?? [],
            visitUrl,
            totalHours: stats?.totalHours,
            gamesPlayed: stats?.gamesPlayed,
            gamesCompleted: stats?.gamesCompleted,
            completionRate: stats?.completionRate,
            platforms: stats?.platforms ?? [],
            releaseByYear: (stats?.releaseByYear ?? []).map((item) => ({
              label: t(`currentVibes.cards.gameStats.${item.label}`),
              count: item.count,
            })),
          };

          return metadata;
        }
        case "music": {
          const player = card.data as MusicPlayerData;
          const visitUrl = appConfig.socialLinks.spotify || undefined;
          const stats = player?.stats;
          const hasStats =
            (stats?.topArtistsByMonth?.length ?? 0) > 0 ||
            (stats?.topTracksByMonth?.length ?? 0) > 0 ||
            (stats?.topGenres?.length ?? 0) > 0 ||
            stats?.topTracksCount !== undefined;
          const periodKey = stats?.timeRange ?? "short_term";
          return {
            title: player?.name || t("currentVibes.cards.music.noSongPlaying"),
            category: player?.is_playing
              ? t("currentVibes.cards.music.listeningTo")
              : t("currentVibes.cards.music.lastPlayed"),
            src: player?.album?.image || "",
            artist: player?.artist,
            album: player?.album?.name,
            isPlaying: !!player?.is_playing,
            visitUrl,
            topArtistsByMonth: stats?.topArtistsByMonth ?? [],
            topTracksByMonth: stats?.topTracksByMonth ?? [],
            topTracksCount: stats?.topTracksCount,
            topArtistsCount: stats?.topArtistsCount,
            topGenres: stats?.topGenres,
            listeningPeriod: t(
              `currentVibes.cards.spotifyStats.period.${periodKey}`,
            ),
            statsCategory: hasStats
              ? t("currentVibes.cards.spotifyStats.statsCategory")
              : undefined,
          };
        }
        case "blog": {
          const post = card.data as MediumPost;
          const stats = post?.stats;
          const hasStats =
            (stats?.postsInFeed ?? 0) > 0 ||
            (stats?.topics?.length ?? 0) > 0;
          return {
            title: post?.title || t("currentVibes.cards.blog.defaultTitle"),
            category: t("currentVibes.cards.blog.latestPost"),
            src: "/images/blog-post-card-bg.jpg",
            readTime:
              post?.readTime ?? calculateReadTime(post?.description),
            publishedDate: formatDate(post?.published_at, locale.value),
            description: truncateDescription(post?.description),
            blogPostsInFeed: stats?.postsInFeed,
            blogPostsThisYear: stats?.postsThisYear,
            blogAverageReadTime: stats?.averageReadTime,
            blogTopics: stats?.topics ?? [],
            blogRecent: (post?.recent ?? []).map((item) => ({
              title: item.title,
              link: item.link,
              publishedDate: formatDate(item.published_at, locale.value),
              readTime: item.readTime,
            })),
            statsCategory: hasStats
              ? t("currentVibes.cards.blog.statsTitle")
              : undefined,
            visitUrl: post?.link || appConfig.socialLinks.medium || undefined,
          };
        }
        case "trakt": {
          const trakt = card.data as TraktWatchedDetail;
          const visitUrl = appConfig.socialLinks.trakt || undefined;
          const totalMinutes = trakt?.stats?.totalMinutes;
          return {
            title: trakt?.title || t("currentVibes.cards.trakt.defaultTitle"),
            category: t("currentVibes.cards.trakt.lastWatched"),
            src: trakt?.image || "/images/trakt-card-bg.png",
            watchedDate: formatDate(trakt?.watched_at, locale.value),
            mediaType: trakt?.type,
            subtitle: trakt?.subtitle,
            overview: trakt?.overview
              ? truncateDescription(trakt.overview, 280)
              : undefined,
            tagline: trakt?.tagline,
            rating:
              typeof trakt?.rating === "number"
                ? Math.round(trakt.rating * 10) / 10
                : undefined,
            votes: trakt?.votes,
            runtime: trakt?.runtime,
            genres: trakt?.genres ?? [],
            traktMoviesWatched: trakt?.stats?.moviesWatched,
            traktShowsWatched: trakt?.stats?.showsWatched,
            traktEpisodesWatched: trakt?.stats?.episodesWatched,
            traktTotalHours:
              totalMinutes !== undefined
                ? Math.round(totalMinutes / 60)
                : undefined,
            visitUrl,
          };
        }
        case "github": {
          const stats = card.data as GitHubStats;
          return {
            title: t("currentVibes.cards.github.title"),
            category: t("currentVibes.cards.github.category"),
            src: "/images/github-stats-bg.png",
            visitUrl: appConfig.socialLinks?.github || undefined,
            commits: stats?.commits,
            repos: stats?.publicRepos,
            contributions: stats?.totalContributions,
            pullRequests: stats?.pullRequests,
            issues: stats?.issues,
            pullRequestReviews: stats?.pullRequestReviews,
            reposContributedTo: stats?.reposContributedTo,
            year: stats?.year,
            contributionsByMonth: stats?.contributionsByMonth ?? [],
            topLanguages: stats?.topLanguages ?? [],
            topRepos: stats?.topRepos ?? [],
            statsCategory: t("currentVibes.cards.githubStats.statsCategory"),
          };
        }
        case "reading": {
          const book = card.data as GoodreadsBook;
          const visitUrl =
            book?.link || appConfig.socialLinks?.goodreads || undefined;
          const readingDate = formatDate(book?.date, locale.value);
          const stats = book?.stats;
          return {
            title: book?.title || t("currentVibes.cards.reading.defaultTitle"),
            category:
              book?.status === "finished"
                ? t("currentVibes.cards.reading.recentlyFinished")
                : t("currentVibes.cards.reading.currentlyReading"),
            src: book?.image || "",
            author: book?.author || undefined,
            readingStatus: book?.status,
            readingDate:
              readingDate && readingDate !== "Invalid Date"
                ? readingDate
                : undefined,
            readingPages: book?.pages,
            readingUserRating: book?.userRating,
            readingAverageRating: book?.averageRating,
            readingBooksRead: stats?.booksRead,
            readingBooksThisYear: stats?.booksThisYear,
            readingCurrentlyReading: stats?.currentlyReading,
            readingToRead: stats?.toRead,
            readingAvgUserRating: stats?.averageRating,
            readingPagesRead: stats?.pagesRead,
            readingTopAuthors: stats?.topAuthors ?? [],
            statsCategory: stats
              ? t("currentVibes.cards.reading.statsTitle")
              : undefined,
            visitUrl,
          };
        }
        case "map": {
          const visitedCountries = appConfig.maps?.countriesVisited;
          const visitedCities = appConfig.maps?.citiesVisited;
          const totalCountries = 195;
          const completionPercentage = Math.round(
            ((Number(visitedCountries) || 0) / Number(totalCountries)) * 100,
          );
          const places = (
            Array.isArray(appConfig.maps?.places)
              ? appConfig.maps.places
              : []
          ) as TravelPlace[];
          const highlightedPlaces = places.filter(
            (place) => place.highlighted === true,
          );
          const morePlaces = places.filter(
            (place) => place.highlighted !== true,
          );
          const toGroups = (list: TravelPlace[]) =>
            groupTravelPlacesByCountry(
              list,
              t("currentVibes.cards.map.otherRegion"),
            ).map((group) => ({
              country: group.country,
              cities: group.places.map((place) => place.name),
            }));
          const placesByCountry = toGroups(highlightedPlaces);
          const morePlacesByCountry = toGroups(morePlaces);
          return {
            title: t("currentVibes.cards.map.title"),
            category: t("currentVibes.cards.map.category"),
            src: "/images/map-card-bg.jpg",
            description: t("currentVibes.cards.map.description"),
            cities: Number(visitedCities) || undefined,
            countries: Number(visitedCountries) || undefined,
            completionPercentage,
            placesPinned: places.length || undefined,
            placesByCountry:
              placesByCountry.length > 0 ? placesByCountry : undefined,
            morePlacesByCountry:
              morePlacesByCountry.length > 0
                ? morePlacesByCountry
                : undefined,
            morePlacesCount:
              morePlaces.length > 0 ? morePlaces.length : undefined,
            visitUrl: appConfig.maps?.placesBeen || undefined,
          };
        }
        default:
          return {
            title: t("currentVibes.cards.default.title"),
            category: t("currentVibes.cards.default.category"),
            src: "/images/blog-post-card-bg.jpg",
            visitUrl: undefined,
          };
      }
    } catch (error) {
      console.error("❌ [Metadata] Error generating metadata:", error);
      return {
        title: t("currentVibes.cards.error.title"),
        category: t("currentVibes.cards.error.category"),
        src: "/images/error.jpg",
        visitUrl: undefined,
      };
    }
  };

  return {
    getCardMetadata,
  };
};
