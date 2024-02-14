import { HowLongToBeatService } from "howlongtobeat";

const hltb = new HowLongToBeatService();

const { hltbApi } = useRuntimeConfig();

const getGames = async (status: string, sortBy = "name") => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    user_id: 82755,
    lists: [status],
    set_playstyle: "comp_plus",
    name: "",
    platform: "",
    storefront: "",
    sortBy,
    sortFlip: 0,
    view: "blox",
    random: 0,
    limit: 102,
    currentUserHome: false,
  });

  const response = await fetch(hltbApi, {
    method: "POST",
    headers,
    body,
  });

  return response.json();
};

const getCurrentlyPlayingGame = async () => {
  const { data } = await getGames("playing");

  const { imageUrl } = await hltb.detail(data.gamesList[0].game_id.toString());

  const title = data.gamesList[0].custom_title;
  const platform = data.gamesList[0].platform;
  const progress = data.gamesList[0].invested_pro / 3600;

  return { title, platform, progress, image: imageUrl };
};

const getLastCompletedGame = async () => {
  const { data } = await getGames("completed", "date_complete");

  const { imageUrl } = await hltb.detail(data.gamesList[0].game_id.toString());

  const title = data.gamesList[0].custom_title;
  const platform = data.gamesList[0].platform;
  const status = "no-playing-games";

  return { title, platform, image: imageUrl, status };
};

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event);

  if (status === "currently-playing") {
    try {
      return await getCurrentlyPlayingGame();
    } catch (error) {
      return await getLastCompletedGame();
    }
  }
});
