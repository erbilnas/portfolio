const { spotify } = useRuntimeConfig();

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

const getCurrentlyPlayingSong = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${spotify.player_api}/currently-playing`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  // Return null if no song is playing (204 status)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export default defineEventHandler(async (event) => {
  try {
    const song = await getCurrentlyPlayingSong();

    if (!song) {
      return {
        is_playing: false,
        player: {},
      };
    }

    const { item, is_playing } = song;

    return {
      is_playing,
      player: {
        album: {
          name: item.album.name,
          image: item.album.images[0].url,
        },
        artist: item.artists[0].name,
        name: item.name,
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
