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

interface TraktMovie {
  title: string;
  year: number | null;
  ids: TraktIds;
  images?: TraktImages;
}

interface TraktShow {
  title: string;
  year: number | null;
  ids: TraktIds;
  images?: TraktImages;
}

interface TraktEpisode {
  season: number;
  number: number;
  title: string;
  ids: TraktIds;
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

async function normalizeHistoryItem(
  item: TraktHistoryItem,
  tmdbApiKey?: string,
): Promise<{
  type: "movie" | "episode";
  title: string;
  subtitle?: string;
  year: number | null;
  image: string;
  ids: TraktIds;
  watched_at: string;
}> {
  let image = "";
  let ids: TraktIds = {};
  let title = "";
  let subtitle: string | undefined;
  let year: number | null = null;
  let type: "movie" | "episode";
  const watched_at = item.watched_at;

  if (item.type === "movie") {
    type = "movie";
    title = item.movie.title;
    year = item.movie.year;
    ids = item.movie.ids;
    image = getImageUrl(item.movie.images);
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
    if (!image && tmdbApiKey && ids.tmdb) {
      image = await fetchPosterFromTmdb(ids.tmdb, "tv", tmdbApiKey);
    }
  }

  return { type, title, subtitle, year, image, ids, watched_at };
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

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": trakt.clientId,
        "trakt-api-version": "2",
        "User-Agent": "Portfolio-Trakt-Integration/1.0 (https://erbilnas.com)",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Trakt API error: ${response.status}`);
    }

    const data = (await response.json()) as TraktHistoryItem[];

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return normalizeHistoryItem(data[0], trakt?.tmdbApiKey);
  } catch (error) {
    console.error("Trakt history fetch error:", error);
    return null;
  }
});
