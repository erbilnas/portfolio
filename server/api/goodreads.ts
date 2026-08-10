import type {
  GoodreadsBook,
  GoodreadsReadingStats,
} from "~/types/current-vibes";

type Shelf = "currently-reading" | "read";

interface ShelfCounts {
  read: number;
  currentlyReading: number;
  toRead: number;
}

interface ParsedItem extends GoodreadsBook {
  /** Finished date only (`user_read_at`); never falls back to date added. */
  readAt?: string;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function decodeXmlEntities(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .trim();
}

function tagValue(block: string, tag: string): string {
  const re = new RegExp(
    `<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,
    "i",
  );
  const match = block.match(re);
  return match ? decodeXmlEntities(match[1]) : "";
}

function allItems(xml: string): string[] {
  return xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
}

function parseYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.getFullYear();
}

function parseItem(
  itemXml: string,
  status: GoodreadsBook["status"],
): ParsedItem | null {
  const title = tagValue(itemXml, "title");
  if (!title) return null;

  const image =
    tagValue(itemXml, "book_large_image_url") ||
    tagValue(itemXml, "book_image_url") ||
    tagValue(itemXml, "book_medium_image_url") ||
    "";

  const readAt = tagValue(itemXml, "user_read_at") || undefined;
  const date =
    readAt ||
    tagValue(itemXml, "user_date_added") ||
    tagValue(itemXml, "pubDate") ||
    undefined;

  const pagesRaw = tagValue(itemXml, "num_pages");
  const pages = pagesRaw ? Number.parseInt(pagesRaw, 10) : NaN;
  const userRatingRaw = tagValue(itemXml, "user_rating");
  const userRating = userRatingRaw ? Number.parseFloat(userRatingRaw) : NaN;
  const averageRatingRaw = tagValue(itemXml, "average_rating");
  const averageRating = averageRatingRaw
    ? Number.parseFloat(averageRatingRaw)
    : NaN;

  return {
    title,
    author: tagValue(itemXml, "author_name") || "",
    image,
    link: tagValue(itemXml, "link") || "",
    status,
    date: date || undefined,
    readAt,
    bookId: tagValue(itemXml, "book_id") || undefined,
    pages: Number.isFinite(pages) && pages > 0 ? pages : undefined,
    userRating:
      Number.isFinite(userRating) && userRating > 0 ? userRating : undefined,
    averageRating:
      Number.isFinite(averageRating) && averageRating > 0
        ? Math.round(averageRating * 100) / 100
        : undefined,
  };
}

async function fetchShelfXml(userId: string, shelf: Shelf): Promise<string> {
  const url = `https://www.goodreads.com/review/list_rss/${encodeURIComponent(userId)}?shelf=${shelf}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });

  if (!response.ok) {
    throw new Error(`Goodreads RSS ${shelf} failed: ${response.status}`);
  }

  return response.text();
}

function parseShelfCounts(html: string): ShelfCounts | null {
  // Require the profile shelf list item so `shelf=read` does not match `to-read`.
  const countFor = (shelf: string) =>
    html.match(
      new RegExp(
        `userShowPageShelfListItem[^>]*shelf=${shelf}["'][^>]*>[\\s\\S]*?\\((\\d[\\d,]*)\\)`,
        "i",
      ),
    )?.[1];

  const read = countFor("read");
  const currentlyReading = countFor("currently-reading");
  const toRead = countFor("to-read");

  if (!read && !currentlyReading && !toRead) return null;

  const toInt = (value: string | undefined) =>
    value ? Number.parseInt(value.replace(/,/g, ""), 10) : 0;

  return {
    read: toInt(read),
    currentlyReading: toInt(currentlyReading),
    toRead: toInt(toRead),
  };
}

async function fetchProfile(
  userId: string,
  profileUrl: string | undefined,
): Promise<{ userId: string; html: string; counts: ShelfCounts | null }> {
  const url =
    profileUrl?.trim() ||
    `https://www.goodreads.com/user/show/${encodeURIComponent(userId)}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    return { userId, html: "", counts: null };
  }

  const html = await response.text();
  const resolvedId =
    response.url.match(/\/user\/show\/(\d+)/i)?.[1] ||
    html.match(/\/review\/list_rss\/(\d+)/i)?.[1] ||
    html.match(/\/user\/show\/(\d+)/i)?.[1] ||
    userId;

  return {
    userId: resolvedId,
    html,
    counts: parseShelfCounts(html),
  };
}

function buildStats(
  readingItems: ParsedItem[],
  readItems: ParsedItem[],
  shelfCounts: ShelfCounts | null,
): GoodreadsReadingStats {
  const year = new Date().getFullYear();
  let booksThisYear = 0;
  let ratingSum = 0;
  let ratingCount = 0;
  let pagesRead = 0;
  const authorCounts = new Map<string, number>();

  for (const book of readItems) {
    // Only count finishes with an explicit read date (not "date added").
    if (parseYear(book.readAt) === year) booksThisYear += 1;

    if (typeof book.userRating === "number") {
      ratingSum += book.userRating;
      ratingCount += 1;
    }
    if (typeof book.pages === "number") {
      pagesRead += book.pages;
    }
    const author = book.author.trim();
    if (author) {
      authorCounts.set(author, (authorCounts.get(author) ?? 0) + 1);
    }
  }

  const topAuthors = [...authorCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 4)
    .map(([name]) => name);

  return {
    // Prefer profile shelf totals — RSS is capped at ~100 items.
    booksRead: shelfCounts?.read || readItems.length,
    booksThisYear,
    currentlyReading:
      shelfCounts?.currentlyReading || readingItems.length,
    toRead: shelfCounts?.toRead ?? 0,
    averageRating:
      ratingCount > 0
        ? Math.round((ratingSum / ratingCount) * 10) / 10
        : undefined,
    pagesRead: pagesRead > 0 ? pagesRead : undefined,
    topAuthors: topAuthors.length > 0 ? topAuthors : undefined,
  };
}

/**
 * Resolve numeric Goodreads id from env or profile URL.
 * Supports /user/show/12345-… and vanity /erbilnas.
 */
function configuredUserId(
  configuredId: string | undefined,
  profileUrl: string | undefined,
): string | null {
  if (configuredId?.trim()) return configuredId.trim();
  if (!profileUrl) return null;
  return (
    profileUrl.match(/goodreads\.com\/user\/show\/(\d+)/i)?.[1] ?? null
  );
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const envUserId = (config.goodreads as { userId?: string } | undefined)
    ?.userId;
  const profileUrl = (
    appConfig.socialLinks as { goodreads?: string } | undefined
  )?.goodreads;

  const seedId = configuredUserId(envUserId, profileUrl);
  if (!seedId && !profileUrl) {
    return null;
  }

  try {
    const profile = await fetchProfile(seedId || "0", profileUrl);
    const userId = profile.userId !== "0" ? profile.userId : seedId;
    if (!userId) return null;

    const [readingXml, readXml] = await Promise.all([
      fetchShelfXml(userId, "currently-reading"),
      fetchShelfXml(userId, "read"),
    ]);

    const readingItems = allItems(readingXml)
      .map((item) => parseItem(item, "reading"))
      .filter((b): b is ParsedItem => !!b);
    const readItems = allItems(readXml)
      .map((item) => parseItem(item, "finished"))
      .filter((b): b is ParsedItem => !!b);

    const featured = readingItems[0] ?? readItems[0];
    if (!featured) return null;

    const { readAt: _readAt, ...featuredBook } = featured;
    const stats = buildStats(readingItems, readItems, profile.counts);

    return {
      ...featuredBook,
      stats,
    } satisfies GoodreadsBook;
  } catch (error) {
    console.error("[goodreads]", error);
    setResponseStatus(event, 500);
    return {
      status: 500,
      message: "Goodreads service is not available at this time",
    };
  }
});
