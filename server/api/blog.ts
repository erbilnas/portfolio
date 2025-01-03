interface MediumFeed {
  url: string;
  title: string;
  link: string;
  author: string;
  description: string;
  image: string;
}

interface MediumItem {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  enclosure: Record<string, unknown>;
  categories: string[];
}

interface MediumResponse {
  status: string;
  feed: MediumFeed;
  items: MediumItem[];
}

const medium_rss_feed = process.env.RSS2JSON_API_URL;

const getMediumFeed = async (): Promise<MediumResponse> => {
  if (!medium_rss_feed) {
    throw new Error("RSS feed URL is not defined");
  }

  const response = await fetch(medium_rss_feed);

  return response.json();
};

const getRecentPost = async (): Promise<MediumItem> => {
  const { items } = await getMediumFeed();

  return items[0];
};

export default defineEventHandler(async (event) => {
  try {
    const recentPost = await getRecentPost();

    const { title, link, pubDate, description } = recentPost;

    return {
      title,
      link,
      published_at: pubDate,
      description,
    };
  } catch (error) {
    setResponseStatus(event, 500);

    return {
      status: 500,
      message: "Medium service is not available at this time",
    };
  }
});
