import { useI18n } from "#imports";
import type {
  GitHubStats,
  HLTBStats,
  MediumPost,
  MusicPlayerData,
  SingleGameDetail,
  TraktWatchedDetail,
} from "~/types/current-vibes";
import type { CardData } from "./current-vibes-data";

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
  // Music specific
  artist?: string;
  album?: string;
  isPlaying?: boolean;
  topArtistsByMonth?: { label: string; count: number }[];
  topTracksByMonth?: { label: string; count: number }[];
  topTracksCount?: number;
  // Blog specific
  readTime?: number;
  publishedDate?: string;
  // Map specific
  cities?: number;
  countries?: number;
  completionPercentage?: number;
  // Trakt specific
  watchedDate?: string;
  mediaType?: "movie" | "episode";
  subtitle?: string;
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
  statsCategory?: string;
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
  return new Date(dateString).toLocaleDateString(
    locale === "tr" ? "tr-TR" : "en-US",
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
            visitUrl,
            totalHours: stats?.totalHours,
            gamesPlayed: stats?.gamesPlayed,
            gamesCompleted: stats?.gamesCompleted,
            completionRate: stats?.completionRate,
            platforms: stats?.platforms ?? [],
            releaseByYear: stats?.releaseByYear ?? [],
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
            stats?.topTracksCount !== undefined;
          return {
            title: player?.name || t("currentVibes.cards.music.noSongPlaying"),
            category: player?.album?.image
              ? t("currentVibes.cards.music.listeningTo")
              : "",
            src: player?.album?.image || "/images/no-music-playing.jpg",
            artist: player?.artist,
            album: player?.album?.name,
            isPlaying: !!player?.name,
            visitUrl,
            topArtistsByMonth: stats?.topArtistsByMonth ?? [],
            topTracksByMonth: stats?.topTracksByMonth ?? [],
            topTracksCount: stats?.topTracksCount,
            statsCategory: hasStats
              ? t("currentVibes.cards.spotifyStats.statsCategory")
              : undefined,
          };
        }
        case "blog": {
          const post = card.data as MediumPost;
          return {
            title: post?.title || t("currentVibes.cards.blog.defaultTitle"),
            category: t("currentVibes.cards.blog.latestPost"),
            src: "/images/blog-post-card-bg.jpg",
            readTime: calculateReadTime(post?.description),
            publishedDate: formatDate(post?.published_at, locale.value),
            description: truncateDescription(post?.description),
            visitUrl: post?.link || appConfig.socialLinks.medium || undefined,
          };
        }
        case "trakt": {
          const trakt = card.data as TraktWatchedDetail;
          const visitUrl = appConfig.socialLinks.trakt || undefined;
          return {
            title: trakt?.title || t("currentVibes.cards.trakt.defaultTitle"),
            category: t("currentVibes.cards.trakt.lastWatched"),
            src: trakt?.image || "/images/trakt-card-bg.png",
            watchedDate: formatDate(trakt?.watched_at, locale.value),
            mediaType: trakt?.type,
            subtitle: trakt?.subtitle,
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
            statsCategory: t("currentVibes.cards.githubStats.statsCategory"),
          };
        }
        case "map": {
          const visitedCountries = appConfig.maps?.countriesVisited;
          const visitedCities = appConfig.maps?.citiesVisited;
          const totalCountries = 195;
          const completionPercentage = Math.round(
            ((Number(visitedCountries) || 0) / Number(totalCountries)) * 100,
          );
          return {
            title: t("currentVibes.cards.map.title"),
            category: t("currentVibes.cards.map.category"),
            src: "/images/map-card-bg.jpg",
            cities: Number(visitedCities) || undefined,
            countries: Number(visitedCountries) || undefined,
            completionPercentage,
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
