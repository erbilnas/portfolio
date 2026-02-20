const { spotify } = useRuntimeConfig();

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// Top artists/tracks require 'user-top-read' scope. Re-authorize your Spotify app
// with this scope and update SPOTIFY_REFRESH_TOKEN to get stats on the card.

const getAccessToken = async () => {
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

  return response.json();
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

const getTopArtists = async (
  accessToken: string,
  limit = 5,
  timeRange = "short_term",
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

    const data = (await response.json()) as { items?: { name: string }[] };
    const items = data?.items ?? [];
    return items.map((artist, i) => ({
      label: artist.name,
      count: 5 - i,
    }));
  } catch (err) {
    console.error("[Spotify] getTopArtists error:", err);
    return null;
  }
};

const getTopTracks = async (
  accessToken: string,
  limit = 5,
  timeRange = "short_term",
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

    const data = (await response.json()) as { items?: unknown[] };
    return data?.items?.length ?? 0;
  } catch (err) {
    console.error("[Spotify] getTopTracks error:", err);
    return null;
  }
};

export default defineEventHandler(async (event) => {
  try {
    const tokenResponse = await getAccessToken();
    const access_token = tokenResponse?.access_token;

    if (!access_token) {
      console.warn("[Spotify] No access token - check refresh_token and token_api");
      throw new Error("Spotify authentication failed");
    }

    const [song, topArtistsInitial, topTracksCountInitial] = await Promise.all([
      getCurrentlyPlayingSong(access_token),
      getTopArtists(access_token, 5, "short_term"),
      getTopTracks(access_token, 5, "short_term"),
    ]);

    // Fallback to medium_term (6 months) if short_term returns empty
    const topArtists =
      topArtistsInitial && topArtistsInitial.length > 0
        ? topArtistsInitial
        : await getTopArtists(access_token, 5, "medium_term");
    const topTracksCount =
      topTracksCountInitial !== null && topTracksCountInitial > 0
        ? topTracksCountInitial
        : await getTopTracks(access_token, 5, "medium_term");

    const { item, is_playing } = song;

    const player = {
      album: {
        name: item?.album?.name ?? "",
        image: item?.album?.images?.[0]?.url ?? "/images/no-music-playing.jpg",
      },
      artist: item?.artists?.[0]?.name ?? "",
      name: item?.name ?? "",
    };

    const stats =
      topArtists || topTracksCount !== null
        ? {
            topArtistsByMonth: topArtists ?? [],
            topTracksCount: topTracksCount ?? undefined,
          }
        : undefined;

    return {
      is_playing,
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
