const { spotify } = useRuntimeConfig();

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Top artists/tracks require 'user-top-read' scope. Re-authorize your Spotify app
// with this scope and update SPOTIFY_REFRESH_TOKEN to get stats on the card.

type SpotifyTimeRange = "short_term" | "medium_term" | "long_term";

interface SpotifyArtist {
  name: string;
  popularity?: number;
  genres?: string[];
}

interface SpotifyTrack {
  name: string;
  popularity?: number;
  duration_ms?: number;
  artists?: { name: string }[];
  album?: { name?: string };
}

const getAccessToken = async () => {
  if (!spotify.token_api || !spotify.refresh_token || !spotify.client_token) {
    console.warn(
      "[Spotify] Missing config:",
      JSON.stringify({
        has_token_api: Boolean(spotify.token_api),
        has_refresh_token: Boolean(spotify.refresh_token),
        has_client_token: Boolean(spotify.client_token),
      }),
    );
    return null;
  }

  const response = await fetch(spotify.token_api, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${spotify.client_token}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: spotify.refresh_token,
    }),
  });

  const data = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
    scope?: string;
  };

  if (!response.ok || !data.access_token) {
    console.warn(
      "[Spotify] Token refresh failed:",
      JSON.stringify({
        status: response.status,
        error: data.error,
        error_description: data.error_description,
      }),
    );
    return null;
  }

  return data;
};

const getCurrentlyPlayingSong = async (accessToken: string) => {
  const response = await fetch(`${spotify.player_api}/currently-playing`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // Return empty object if no song is playing (204 status)
  if (response.status === 204) {
    return {
      is_playing: false,
      item: {},
    };
  }

  return response.json();
};

const getRecentlyPlayedTrack = async (accessToken: string) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/player/recently-played?limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 403) {
      console.warn(
        "[Spotify] Recently played returned 403. Add 'user-read-recently-played' scope and re-authorize.",
      );
      return null;
    }

    if (!response.ok) return null;

    const data = (await response.json()) as {
      items?: { track?: Record<string, unknown> }[];
    };
    return data?.items?.[0]?.track ?? null;
  } catch (err) {
    console.error("[Spotify] getRecentlyPlayedTrack error:", err);
    return null;
  }
};

const getTopArtists = async (
  accessToken: string,
  limit = 8,
  timeRange: SpotifyTimeRange = "short_term",
) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/artists?limit=${limit}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 403) {
      console.warn(
        "[Spotify] Top artists returned 403. Add 'user-top-read' scope to your Spotify app and re-authorize.",
      );
      return null;
    }

    if (response.status === 401 || !response.ok) {
      return null;
    }

    const data = (await response.json()) as { items?: SpotifyArtist[] };
    const items = data?.items ?? [];
    return items.map((artist, i) => ({
      label: artist.name,
      count: artist.popularity ?? Math.max(items.length - i, 1) * 12,
      subtitle: artist.genres?.slice(0, 2).join(" · ") || undefined,
      popularity: artist.popularity,
      genres: artist.genres ?? [],
    }));
  } catch (err) {
    console.error("[Spotify] getTopArtists error:", err);
    return null;
  }
};

const getTopTracks = async (
  accessToken: string,
  limit = 8,
  timeRange: SpotifyTimeRange = "short_term",
) => {
  try {
    const response = await fetch(
      `${SPOTIFY_API_BASE}/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.status === 403) {
      console.warn(
        "[Spotify] Top tracks returned 403. Add 'user-top-read' scope to your Spotify app and re-authorize.",
      );
      return null;
    }

    if (response.status === 401 || !response.ok) {
      return null;
    }

    const data = (await response.json()) as { items?: SpotifyTrack[] };
    const items = data?.items ?? [];
    return items.map((track, i) => {
      const artists = track.artists?.map((a) => a.name).filter(Boolean) ?? [];
      const durationSec =
        typeof track.duration_ms === "number"
          ? Math.round(track.duration_ms / 1000)
          : undefined;
      const mins =
        durationSec !== undefined ? Math.floor(durationSec / 60) : undefined;
      const secs =
        durationSec !== undefined
          ? String(durationSec % 60).padStart(2, "0")
          : undefined;
      const durationLabel =
        mins !== undefined && secs !== undefined ? `${mins}:${secs}` : undefined;

      const subtitleParts = [
        artists.join(", ") || undefined,
        track.album?.name || undefined,
        durationLabel,
      ].filter(Boolean);

      return {
        label: track.name,
        count: track.popularity ?? Math.max(items.length - i, 1) * 12,
        subtitle: subtitleParts.join(" · ") || undefined,
        popularity: track.popularity,
      };
    });
  } catch (err) {
    console.error("[Spotify] getTopTracks error:", err);
    return null;
  }
};

function topGenresFromArtists(
  artists: { genres?: string[] }[] | null,
  limit = 6,
): string[] {
  if (!artists?.length) return [];
  const counts = new Map<string, number>();
  for (const artist of artists) {
    for (const genre of artist.genres ?? []) {
      const key = genre.trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([genre]) => genre);
}

export default defineEventHandler(async (event) => {
  try {
    const tokenResponse = await getAccessToken();
    const access_token = tokenResponse?.access_token;

    if (!access_token) {
      throw new Error("Spotify authentication failed");
    }

    const [song, topArtistsInitial, topTracksInitial] = await Promise.all([
      getCurrentlyPlayingSong(access_token),
      getTopArtists(access_token, 8, "short_term"),
      getTopTracks(access_token, 8, "short_term"),
    ]);

    let timeRange: SpotifyTimeRange = "short_term";
    let topArtists = topArtistsInitial;
    let topTracks = topTracksInitial;

    // Fallback to medium_term (6 months) if short_term returns empty
    if (!topArtists?.length || !topTracks?.length) {
      const [artistsMedium, tracksMedium] = await Promise.all([
        !topArtists?.length
          ? getTopArtists(access_token, 8, "medium_term")
          : Promise.resolve(topArtists),
        !topTracks?.length
          ? getTopTracks(access_token, 8, "medium_term")
          : Promise.resolve(topTracks),
      ]);
      if (!topArtists?.length && artistsMedium?.length) {
        topArtists = artistsMedium;
        timeRange = "medium_term";
      }
      if (!topTracks?.length && tracksMedium?.length) {
        topTracks = tracksMedium;
        if (timeRange === "short_term" && !topArtistsInitial?.length) {
          timeRange = "medium_term";
        }
      }
    }

    const { item: currentItem, is_playing } = song;
    let item = currentItem;

    // Nothing in the player — fall back to the most recent track.
    if (!item?.name) {
      const recent = await getRecentlyPlayedTrack(access_token);
      if (recent) item = recent;
    }

    const player = {
      album: {
        name: item?.album?.name ?? "",
        image: item?.album?.images?.[0]?.url ?? "",
      },
      artist: item?.artists?.[0]?.name ?? "",
      name: item?.name ?? "",
      is_playing: Boolean(is_playing && item?.name),
    };

    const topGenres = topGenresFromArtists(topArtists);
    const artistsForClient = topArtists?.map(
      ({ genres: _genres, ...rest }) => rest,
    );

    const stats =
      artistsForClient || topTracks
        ? {
            topArtistsByMonth: artistsForClient ?? [],
            topTracksByMonth: topTracks ?? [],
            topTracksCount: topTracks?.length ?? undefined,
            topArtistsCount: artistsForClient?.length ?? undefined,
            topGenres: topGenres.length ? topGenres : undefined,
            timeRange,
          }
        : undefined;

    return {
      is_playing: player.is_playing,
      player: {
        ...player,
        stats,
      },
    };
  } catch (error) {
    setResponseStatus(event, 500);

    return {
      status: 500,
      message: "Spotify service is not available at this time",
    };
  }
});
