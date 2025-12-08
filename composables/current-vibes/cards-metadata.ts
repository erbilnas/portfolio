import type {
  MediumPost,
  MusicPlayerData,
  SingleGameDetail,
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
  // Blog specific
  readTime?: number;
  publishedDate?: string;
  // Map specific
  cities?: number;
  countries?: number;
  completionPercentage?: number;
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
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Truncate description to max length
 */
const truncateDescription = (
  description: string | undefined,
  maxLength = 150
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

  /**
   * Get metadata for a card based on its type
   */
  const getCardMetadata = (card: CardData, _index: number): CardMetadata => {
    try {
      const appConfig = getAppConfig();
      switch (card.type) {
        case "game": {
          const game = card.data as SingleGameDetail;

          const visitUrl = appConfig.socialLinks.howlongtobeat || undefined;
          const platformParts = [game?.platform, game?.storefront].filter(
            Boolean
          );
          const platform =
            platformParts.length > 0 ? platformParts.join(" / ") : undefined;

          const metadata = {
            title: game?.title || "Game",
            category:
              game?.status === "playing"
                ? "I'm currently playing"
                : "I recently completed",
            src: game?.image || "/images/blog-post-card-bg.jpg",
            progress: game?.progress,
            progressPercentage: calculateProgressPercentage(game),
            platform,
            description: game?.description,
            visitUrl,
          };

          return metadata;
        }
        case "music": {
          const player = card.data as MusicPlayerData;
          const visitUrl = appConfig.socialLinks.spotify || undefined;
          return {
            title: player?.name || "No song playing",
            category: player?.album?.image ? "I'm listening to" : "",
            src: player?.album?.image || "/images/no-music-playing.jpg",
            artist: player?.artist,
            album: player?.album?.name,
            isPlaying: !!player?.name,
            visitUrl,
          };
        }
        case "blog": {
          const post = card.data as MediumPost;
          return {
            title: post?.title || "Blog Post",
            category: "The latest blog post I've written",
            src: "/images/blog-post-card-bg.jpg",
            readTime: calculateReadTime(post?.description),
            publishedDate: formatDate(post?.published_at),
            description: truncateDescription(post?.description),
            visitUrl: post?.link || appConfig.socialLinks.medium || undefined,
          };
        }
        case "map": {
          const visitedCountries = appConfig.maps?.countriesVisited;
          const visitedCities = appConfig.maps?.citiesVisited;
          const totalCountries = 195;
          const completionPercentage = Math.round(
            ((Number(visitedCountries) || 0) / Number(totalCountries)) * 100
          );
          return {
            title: "Places I've Been",
            category: "Biggest travel achievements",
            src: "/images/map-card-bg.jpg",
            cities: Number(visitedCities) || undefined,
            countries: Number(visitedCountries) || undefined,
            completionPercentage,
            visitUrl: appConfig.maps?.placesBeen || undefined,
          };
        }
        default:
          return {
            title: "Card",
            category: "Content",
            src: "/images/blog-post-card-bg.jpg",
            visitUrl: undefined,
          };
      }
    } catch (error) {
      console.error("❌ [Metadata] Error generating metadata:", error);
      return {
        title: "Error",
        category: "Failed to load",
        src: "/images/error.jpg",
        visitUrl: undefined,
      };
    }
  };

  return {
    getCardMetadata,
  };
};
