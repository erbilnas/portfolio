const MEDIUM_RSS_FEED =
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40erbilnas";

const getRecentPost = async () => {
  const response = await fetch(MEDIUM_RSS_FEED);

  return response.json();
};

export default defineEventHandler(async (event) => {
  const {
    items,
    feed: { link, description },
    status,
  } = await getRecentPost();

  if (status === "ok") {
    const { title, link, pubDate } = items[0];

    return {
      title,
      link,
      feed: link,
      description: description,
      publishedDate: pubDate,
      status: "success",
    };
  }

  return {
    title: "🚫 Medium service is not available.",
    status: "error",
  };
});
