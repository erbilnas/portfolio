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
    image: upgradeCoverUrl(image),
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

async function fetchShelfXml(
  userId: string,
  shelf: Shelf,
): Promise<string | null> {
  const url = `https://www.goodreads.com/review/list_rss/${encodeURIComponent(userId)}?shelf=${shelf}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": BROWSER_UA,
      Accept: "application/rss+xml, application/xml, text/xml, */*",
    },
  });

  if (!response.ok) {
    // Goodreads has been returning 404 for list_rss for many accounts.
    console.warn(
      `[goodreads] RSS ${shelf} unavailable (${response.status}); will try profile HTML fallback`,
    );
    return null;
  }

  const text = await response.text();
  // Guard against HTML "Page not found" bodies served as 200 in the future.
  if (!text.includes("<item") && text.includes("<html")) {
    console.warn(
      `[goodreads] RSS ${shelf} returned HTML instead of feed; using profile HTML fallback`,
    );
    return null;
  }

  return text;
}

function upgradeCoverUrl(url: string): string {
  if (!url) return url;
  // Prefer a readable cover over the tiny profile thumb (_SX98_).
  return url.replace(/\._[A-Z]{2}\d+_/, "._SX600_");
}

/** Parse currently-reading cards from the public profile HTML. */
function parseCurrentlyReadingFromProfile(html: string): ParsedItem[] {
  const section = html.match(
    /id=["']currentlyReadingReviews["']([\s\S]*?)(?:id=["'](?:currentlyReadingReviews|updates|friendUpdates)|<\/body>)/i,
  )?.[1];
  if (!section) return [];

  const blocks = section.split(/class=["']Updates\b/i).slice(1);
  const books: ParsedItem[] = [];

  for (const block of blocks) {
    const titleMatch = block.match(
      /class=["']bookTitle["'][^>]*href=["']([^"']+)["'][^>]*>([^<]+)</i,
    );
    if (!titleMatch) continue;

    const href = titleMatch[1]!;
    const title = decodeXmlEntities(titleMatch[2]!);
    const author =
      block.match(
        /class=["']authorName["'][^>]*>([^<]+)</i,
      )?.[1]?.trim() ?? "";
    const image =
      block.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] ?? "";
    const bookId =
      href.match(/\/book\/show\/(\d+)/i)?.[1] ||
      block.match(/name=["']book_id["'][^>]*value=["'](\d+)["']/i)?.[1];

    // e.g. "(page 47 of 232)" on the progress widget
    const pageProgress = block.match(/\(page\s+(\d+)\s+of\s+(\d+)\)/i);
    const progressPage = pageProgress
      ? Number.parseInt(pageProgress[1]!, 10)
      : undefined;
    const pages = pageProgress
      ? Number.parseInt(pageProgress[2]!, 10)
      : undefined;
    const progressPercentage =
      progressPage && pages && pages > 0
        ? Math.round((progressPage / pages) * 100)
        : undefined;

    const date =
      block.match(
        /class=["'](?:greyText|updatedTimestamp)["'][^>]*>([^<]*\d{4}[^<]*)</i,
      )?.[1]?.trim() || undefined;

    books.push({
      title,
      author: decodeXmlEntities(author),
      image: upgradeCoverUrl(image),
      link: href.startsWith("http")
        ? href
        : `https://www.goodreads.com${href}`,
      status: "reading",
      bookId,
      date,
      pages:
        Number.isFinite(pages) && pages! > 0 ? pages : undefined,
      progressPage:
        Number.isFinite(progressPage) && progressPage! > 0
          ? progressPage
          : undefined,
      progressPercentage,
    });
  }

  return books;
}

interface BookPageEnrichment {
  pages?: number;
  averageRating?: number;
  ratingCount?: number;
  genres?: string[];
  bookFormat?: string;
  language?: string;
  image?: string;
}

/** Fill gaps from the public book show page (JSON-LD + genre graph). */
async function enrichFromBookPage(
  bookId: string,
  link?: string,
): Promise<BookPageEnrichment | null> {
  try {
    const url =
      link?.includes("/book/show/")
        ? link
        : `https://www.goodreads.com/book/show/${encodeURIComponent(bookId)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.goodreads.com/",
      },
      redirect: "follow",
    });
    if (!response.ok) return null;
    const html = await response.text();
    // AWS WAF interstitial is tiny and has no book payload
    if (html.length < 8000 || !html.includes("application/ld+json")) {
      return null;
    }

    const enrichment: BookPageEnrichment = {};

    const ldMatch = html.match(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i,
    );
    if (ldMatch) {
      try {
        const data = JSON.parse(ldMatch[1]!) as {
          numberOfPages?: number;
          bookFormat?: string;
          inLanguage?: string;
          image?: string | string[];
          aggregateRating?: {
            ratingValue?: number | string;
            ratingCount?: number | string;
          };
        };
        if (typeof data.numberOfPages === "number" && data.numberOfPages > 0) {
          enrichment.pages = data.numberOfPages;
        }
        if (data.bookFormat) enrichment.bookFormat = String(data.bookFormat);
        if (data.inLanguage) enrichment.language = String(data.inLanguage);
        const ratingValue = Number(data.aggregateRating?.ratingValue);
        if (Number.isFinite(ratingValue) && ratingValue > 0) {
          enrichment.averageRating = Math.round(ratingValue * 100) / 100;
        }
        const ratingCount = Number(data.aggregateRating?.ratingCount);
        if (Number.isFinite(ratingCount) && ratingCount > 0) {
          enrichment.ratingCount = ratingCount;
        }
        const image = Array.isArray(data.image) ? data.image[0] : data.image;
        if (typeof image === "string" && image) {
          enrichment.image = upgradeCoverUrl(image);
        }
      } catch {
        // ignore malformed JSON-LD
      }
    }

    const genres = [
      ...html.matchAll(
        /"__typename"\s*:\s*"BookGenre"\s*,\s*"genre"\s*:\s*\{\s*"__typename"\s*:\s*"Genre"\s*,\s*"name"\s*:\s*"([^"]+)"/g,
      ),
    ]
      .map((m) => m[1]!)
      .filter(Boolean);
    // Dedupe while keeping order
    if (genres.length) {
      enrichment.genres = [...new Set(genres)].slice(0, 6);
    }

    return enrichment;
  } catch (error) {
    console.warn("[goodreads] book page enrich failed:", error);
    return null;
  }
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

    let readingItems = readingXml
      ? allItems(readingXml)
          .map((item) => parseItem(item, "reading"))
          .filter((b): b is ParsedItem => !!b)
      : [];
    const readItems = readXml
      ? allItems(readXml)
          .map((item) => parseItem(item, "finished"))
          .filter((b): b is ParsedItem => !!b)
      : [];

    if (readingItems.length === 0 && profile.html) {
      readingItems = parseCurrentlyReadingFromProfile(profile.html);
    }

    const featured = readingItems[0] ?? readItems[0];
    if (!featured) return null;

    const { readAt: _readAt, ...featuredBook } = featured;

    if (featuredBook.bookId) {
      const extra = await enrichFromBookPage(
        featuredBook.bookId,
        featuredBook.link,
      );
      if (extra) {
        if (!featuredBook.pages && extra.pages) {
          featuredBook.pages = extra.pages;
        }
        if (
          featuredBook.progressPage &&
          featuredBook.pages &&
          featuredBook.pages > 0 &&
          featuredBook.progressPercentage === undefined
        ) {
          featuredBook.progressPercentage = Math.round(
            (featuredBook.progressPage / featuredBook.pages) * 100,
          );
        }
        if (extra.averageRating !== undefined) {
          featuredBook.averageRating = extra.averageRating;
        }
        if (extra.ratingCount !== undefined) {
          featuredBook.ratingCount = extra.ratingCount;
        }
        if (extra.genres?.length) {
          featuredBook.genres = extra.genres;
        }
        if (extra.bookFormat) {
          featuredBook.bookFormat = extra.bookFormat;
        }
        if (extra.language) {
          featuredBook.language = extra.language;
        }
        if (extra.image) {
          featuredBook.image = extra.image;
        } else if (featuredBook.image) {
          featuredBook.image = upgradeCoverUrl(featuredBook.image);
        }
      }
    } else if (featuredBook.image) {
      featuredBook.image = upgradeCoverUrl(featuredBook.image);
    }

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
