const { spotify } = useRuntimeConfig();

const getAccessToken = async () => {
  const response = await fetch(spotify.tokenApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${spotify.clientToken}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: spotify.refreshToken,
    }),
  });

  return response.json();
};

const getCurrentlyPlayingSong = async () => {
  const { access_token } = await getAccessToken();

  const response = await fetch(`${spotify.playerApi}/currently-playing`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return response.json();
};

export default defineEventHandler(async (event) => {
  const { player } = getQuery(event);

  if (player === "currently-playing") {
    try {
      const { item } = await getCurrentlyPlayingSong();

      const { artists, name } = item;

      const player_message = `${artists[0].name} - ${name}`;

      return player_message;
    } catch (error) {
      return "No song is currently playing.";
    }
  }
});
