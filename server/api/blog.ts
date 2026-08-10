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

export interface MediumWritingStats {
  postsInFeed: number;
  postsThisYear: number;
  averageReadTime: number;
  topics: string[];
}

const medium_rss_feed = process.env.RSS2JSON_API_URL;

const estimateReadTime = (html: string | undefined): number => {
  if (!html) return 0;
  const wordsPerMinute = 200;
  const cleanText = html
    .replace(/<[^>]*>/g, "")
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = cleanText
    .split(" ")
    .filter((word) => word.length > 0).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const getMediumFeed = async (): Promise<MediumResponse> => {
  if (!medium_rss_feed) {
    throw new Error("RSS feed URL is not defined");
  }

  const response = await fetch(medium_rss_feed);

  return response.json();
};

const buildWritingStats = (items: MediumItem[]): MediumWritingStats => {
  const currentYear = new Date().getFullYear();
  const topicCounts = new Map<string, number>();
  let readTimeSum = 0;
  let postsThisYear = 0;

  for (const item of items) {
    const published = new Date(item.pubDate);
    if (!Number.isNaN(published.getTime()) && published.getFullYear() === currentYear) {
      postsThisYear += 1;
    }

    readTimeSum += estimateReadTime(item.description || item.content);

    for (const category of item.categories ?? []) {
      const topic = category.trim();
      if (!topic) continue;
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }

  const topics = [...topicCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6)
    .map(([topic]) => topic);

  return {
    postsInFeed: items.length,
    postsThisYear,
    averageReadTime:
      items.length > 0 ? Math.max(1, Math.round(readTimeSum / items.length)) : 0,
    topics,
  };
};

export default defineEventHandler(async (event) => {
  try {
    const { items } = await getMediumFeed();

    if (!items?.length) {
      setResponseStatus(event, 404);
      return {
        status: 404,
        message: "No Medium posts found",
      };
    }

    const recentPost = items[0];
    const { title, link, pubDate, description, categories } = recentPost;

    return {
      title,
      link,
      published_at: pubDate,
      description,
      categories: (categories ?? []).filter(Boolean),
      readTime: estimateReadTime(description || recentPost.content),
      stats: buildWritingStats(items),
    };
  } catch (error) {
    setResponseStatus(event, 500);

    return {
      status: 500,
      message: "Medium service is not available at this time",
    };
  }
});
