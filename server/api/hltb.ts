import { HowLongToBeatService, type HowLongToBeatEntry } from "howlongtobeat";

const hltb = new HowLongToBeatService();

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const { status } = getQuery(event);

  if (status === "playing") {
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
      sortBy: "name",
      sortFlip: 0,
      view: "blox",
      random: 0,
      limit: 102,
      currentUserHome: false,
    });

    const response = await fetch(config.hltbApi, {
      method: "POST",
      headers,
      body,
    });

    const { data } = await response.json();

    const id = data.gamesList[0].game_id as HowLongToBeatEntry;
    const title = data.gamesList[0].custom_title as HowLongToBeatEntry;
    const platform = data.gamesList[0].platform as HowLongToBeatEntry;

    const { imageUrl } = await hltb.detail(id.toString());

    return {
      title,
      platform,
      image: imageUrl,
    };
  }
});
