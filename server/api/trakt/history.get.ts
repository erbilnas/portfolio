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

function normalizeHistoryItem(item: TraktHistoryItem) {
  if (item.type === "movie") {
    return {
      type: "movie" as const,
      title: item.movie.title,
      year: item.movie.year,
      image: getImageUrl(item.movie.images),
      ids: item.movie.ids,
      watched_at: item.watched_at,
    };
  }
  // Episode
  return {
    type: "episode" as const,
    title: `${item.show.title} - S${item.episode.season}E${item.episode.number}`,
    subtitle: item.episode.title || item.show.title,
    year: item.show.year,
    image: getImageUrl(item.show.images),
    ids: item.show.ids,
    watched_at: item.watched_at,
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

    const response = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-key": trakt.clientId,
        "trakt-api-version": "2",
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

    return normalizeHistoryItem(data[0]);
  } catch (error) {
    console.error("Trakt history fetch error:", error);
    return null;
  }
});
