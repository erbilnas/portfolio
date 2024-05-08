const RSS2JSON_API_KEY = process.env.RSS2JSON_API_KEY;

const MEDIUM_RSS_FEED =
  "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40erbilnas&api_key=" +
  RSS2JSON_API_KEY;

const getRecentPost = async () => {
  const response = await fetch(MEDIUM_RSS_FEED);

  return response.json();
};

export default defineEventHandler(async (event) => {
  try {
    const { items, feed, status } = await getRecentPost();

    if (status === "ok") {
      const { title, link, pubDate } = items[0];

      return {
        title,
        link,
        feed: feed.link,
        description: feed.description,
        publishedDate: pubDate,
        status: "success",
      };
    }
  } catch (error) {
    return {
      title: "🚫 Medium service is not available at this time",
      status: "error",
    };
  }
});
