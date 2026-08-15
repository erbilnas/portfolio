export interface MediumWritingStats {
  postsInFeed: number;
  postsThisYear: number;
  averageReadTime: number;
  topics: string[];
}

export interface MediumRecentPost {
  title: string;
  link: string;
  published_at: string;
  readTime: number;
}

export interface MediumPost {
  title: string;
  link: string;
  published_at: string;
  description: string;
  categories?: string[];
  readTime?: number;
  stats?: MediumWritingStats;
  recent?: MediumRecentPost[];
}

export interface SingleGameDetail {
  image: string;
  title: string;
  platform: string;
  progress: string;
  description: string;
  storefront: string;
  completion_time: number;
  status: "playing" | "completed";
  genres?: string[];
}

export interface ReleaseByYear {
  label: string;
  count: number;
}

export interface HLTBStats {
  totalHours: number;
  gamesPlayed: number;
  gamesCompleted: number;
  completionRate: number;
  platforms: string[];
  releaseByYear: ReleaseByYear[];
}

export interface GameDetails {
  playing: SingleGameDetail | null;
  last_completed: SingleGameDetail | null;
  stats?: HLTBStats | null;
}

export interface Album {
  name: string;
  image: string;
}

export interface SpotifyRankItem {
  label: string;
  /** Relative weight for bars (usually Spotify popularity 0–100). */
  count: number;
  subtitle?: string;
  popularity?: number;
}

export interface SpotifyStats {
  topArtistsByMonth: SpotifyRankItem[];
  topTracksByMonth?: SpotifyRankItem[];
  topTracksCount?: number;
  topArtistsCount?: number;
  topGenres?: string[];
  timeRange?: "short_term" | "medium_term" | "long_term";
}

export interface MusicPlayerData {
  album: Album;
  artist: string;
  name: string;
  is_playing: boolean;
  stats?: SpotifyStats;
}

export interface MusicPlayer {
  player: MusicPlayerData;
}

export interface TraktUserWatchStats {
  moviesWatched: number;
  showsWatched: number;
  episodesWatched: number;
  totalMinutes: number;
}

export interface TraktWatchedDetail {
  type: "movie" | "episode";
  title: string;
  subtitle?: string;
  year: number | null;
  image: string;
  ids: { trakt?: number; slug?: string; imdb?: string; tmdb?: number };
  watched_at: string;
  overview?: string;
  tagline?: string;
  rating?: number;
  votes?: number;
  runtime?: number;
  genres?: string[];
  stats?: TraktUserWatchStats;
}

export interface ContributionsByMonth {
  label: string;
  count: number;
}

export interface GitHubTopLanguage {
  label: string;
  count: number;
  percentage: number;
}

export interface GitHubTopRepo {
  label: string;
  count: number;
  url?: string;
}

export interface GitHubStats {
  username: string;
  publicRepos: number;
  totalContributions: number;
  commits: number;
  pullRequests: number;
  issues: number;
  pullRequestReviews?: number;
  reposContributedTo?: number;
  year?: number;
  contributionsByMonth?: ContributionsByMonth[];
  topLanguages?: GitHubTopLanguage[];
  topRepos?: GitHubTopRepo[];
}

export interface GoodreadsReadingStats {
  booksRead: number;
  booksThisYear: number;
  currentlyReading: number;
  toRead: number;
  averageRating?: number;
  pagesRead?: number;
  topAuthors?: string[];
}

export interface GoodreadsBook {
  title: string;
  author: string;
  image: string;
  link: string;
  status: "reading" | "finished";
  date?: string;
  bookId?: string;
  pages?: number;
  userRating?: number;
  averageRating?: number;
  stats?: GoodreadsReadingStats;
}
