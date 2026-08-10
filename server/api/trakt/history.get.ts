interface TraktIds {
  trakt?: number;
  slug?: string;
  imdb?: string;
  tmdb?: number;
}

interface TraktImages {
  poster?: { full?: string; medium?: string; thumb?: string };
  fanart?: { full?: string; medium?: string; thumb?: string };
}

interface TraktMediaBase {
  title: string;
  year: number | null;
  ids: TraktIds;
  images?: TraktImages;
  overview?: string;
  runtime?: number;
  rating?: number;
  votes?: number;
  genres?: string[];
  tagline?: string;
}

interface TraktMovie extends TraktMediaBase {}

interface TraktShow extends TraktMediaBase {}

interface TraktEpisode {
  season: number;
  number: number;
  title: string;
  ids: TraktIds;
  overview?: string;
  runtime?: number;
  rating?: number;
  votes?: number;
}

interface TraktHistoryMovie {
  type: "movie";
  movie: TraktMovie;
  watched_at: string;
}

interface TraktHistoryEpisode {
  type: "episode";
  episode: TraktEpisode;
  show: TraktShow;
  watched_at: string;
}

type TraktHistoryItem = TraktHistoryMovie | TraktHistoryEpisode;

interface TraktUserStats {
  movies?: { plays?: number; watched?: number; minutes?: number };
  shows?: { watched?: number };
  episodes?: { plays?: number; watched?: number; minutes?: number };
}

export interface TraktHistoryResponse {
  type: "movie" | "episode";
  title: string;
  subtitle?: string;
  year: number | null;
  image: string;
  ids: TraktIds;
  watched_at: string;
  overview?: string;
  tagline?: string;
  rating?: number;
  votes?: number;
  runtime?: number;
  genres?: string[];
  stats?: {
    moviesWatched: number;
    showsWatched: number;
    episodesWatched: number;
    totalMinutes: number;
  };
}

function getImageUrl(images?: TraktImages): string {
  if (!images) return "";
  return (
    images.fanart?.full ||
    images.fanart?.medium ||
    images.poster?.full ||
    images.poster?.medium ||
    images.poster?.thumb ||
    ""
  );
}

function parseGenres(genres?: string[]): string[] {
  if (!Array.isArray(genres)) return [];
  return genres
    .map((g) => g.trim())
    .filter(Boolean)
    .map((g) => g.charAt(0).toUpperCase() + g.slice(1));
}

async function fetchPosterFromTmdb(
  tmdbId: number,
  type: "movie" | "tv",
  apiKey: string,
): Promise<string> {
  const endpoint =
    type === "movie"
      ? `https://api.themoviedb.org/3/movie/${tmdbId}`
      : `https://api.themoviedb.org/3/tv/${tmdbId}`;
  const url = `${endpoint}?api_key=${apiKey}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) return "";
  const data = (await res.json()) as { poster_path?: string };
  const path = data.poster_path;
  if (!path) return "";
  return `https://image.tmdb.org/t/p/w780${path}`;
}

function traktHeaders(clientId: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "trakt-api-key": clientId,
    "trakt-api-version": "2",
    "User-Agent": "Portfolio-Trakt-Integration/1.0 (https://erbilnas.com)",
  };
}

async function fetchUserStats(
  username: string,
  clientId: string,
): Promise<TraktHistoryResponse["stats"] | undefined> {
  try {
    const response = await fetch(
      `https://api.trakt.tv/users/${username}/stats`,
      { headers: traktHeaders(clientId) },
    );
    if (!response.ok) return undefined;
    const data = (await response.json()) as TraktUserStats;
    const movieMinutes = data.movies?.minutes ?? 0;
    const episodeMinutes = data.episodes?.minutes ?? 0;
    return {
      moviesWatched: data.movies?.watched ?? 0,
      showsWatched: data.shows?.watched ?? 0,
      episodesWatched: data.episodes?.watched ?? 0,
      totalMinutes: movieMinutes + episodeMinutes,
    };
  } catch (error) {
    console.warn("Trakt stats fetch error:", error);
    return undefined;
  }
}

async function normalizeHistoryItem(
  item: TraktHistoryItem,
  tmdbApiKey?: string,
): Promise<Omit<TraktHistoryResponse, "stats">> {
  let image = "";
  let ids: TraktIds = {};
  let title = "";
  let subtitle: string | undefined;
  let year: number | null = null;
  let type: "movie" | "episode";
  let overview: string | undefined;
  let tagline: string | undefined;
  let rating: number | undefined;
  let votes: number | undefined;
  let runtime: number | undefined;
  let genres: string[] = [];
  const watched_at = item.watched_at;

  if (item.type === "movie") {
    type = "movie";
    title = item.movie.title;
    year = item.movie.year;
    ids = item.movie.ids;
    image = getImageUrl(item.movie.images);
    overview = item.movie.overview?.trim() || undefined;
    tagline = item.movie.tagline?.trim() || undefined;
    rating =
      typeof item.movie.rating === "number" ? item.movie.rating : undefined;
    votes = typeof item.movie.votes === "number" ? item.movie.votes : undefined;
    runtime =
      typeof item.movie.runtime === "number" ? item.movie.runtime : undefined;
    genres = parseGenres(item.movie.genres);
    if (!image && tmdbApiKey && ids.tmdb) {
      image = await fetchPosterFromTmdb(ids.tmdb, "movie", tmdbApiKey);
    }
  } else {
    type = "episode";
    title = `${item.show.title} - S${item.episode.season}E${item.episode.number}`;
    subtitle = item.episode.title || item.show.title;
    year = item.show.year;
    ids = item.show.ids;
    image = getImageUrl(item.show.images);
    overview =
      item.episode.overview?.trim() ||
      item.show.overview?.trim() ||
      undefined;
    tagline = item.show.tagline?.trim() || undefined;
    rating =
      typeof item.episode.rating === "number"
        ? item.episode.rating
        : typeof item.show.rating === "number"
          ? item.show.rating
          : undefined;
    votes =
      typeof item.episode.votes === "number"
        ? item.episode.votes
        : typeof item.show.votes === "number"
          ? item.show.votes
          : undefined;
    runtime =
      typeof item.episode.runtime === "number"
        ? item.episode.runtime
        : typeof item.show.runtime === "number"
          ? item.show.runtime
          : undefined;
    genres = parseGenres(item.show.genres);
    if (!image && tmdbApiKey && ids.tmdb) {
      image = await fetchPosterFromTmdb(ids.tmdb, "tv", tmdbApiKey);
    }
  }

  return {
    type,
    title,
    subtitle,
    year,
    image,
    ids,
    watched_at,
    overview,
    tagline,
    rating,
    votes,
    runtime,
    genres,
  };
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { trakt } = config;

  if (!trakt?.clientId || !trakt?.username) {
    return null;
  }

  try {
    const url = new URL(`https://api.trakt.tv/users/${trakt.username}/history`);
    url.searchParams.set("limit", "1");
    url.searchParams.set("extended", "full");

    const [historyResponse, stats] = await Promise.all([
      fetch(url.toString(), { headers: traktHeaders(trakt.clientId) }),
      fetchUserStats(trakt.username, trakt.clientId),
    ]);

    if (!historyResponse.ok) {
      if (historyResponse.status === 404) return null;
      throw new Error(`Trakt API error: ${historyResponse.status}`);
    }

    const data = (await historyResponse.json()) as TraktHistoryItem[];

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const item = await normalizeHistoryItem(data[0], trakt?.tmdbApiKey);
    return { ...item, stats } satisfies TraktHistoryResponse;
  } catch (error) {
    console.error("Trakt history fetch error:", error);
    return null;
  }
});
