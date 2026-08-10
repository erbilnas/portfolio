const ALLOWED_HOSTS = new Set([
  "howlongtobeat.com",
  "www.howlongtobeat.com",
  "i.scdn.co",
  "mosaic.scdn.co",
  "image.tmdb.org",
  "images.igdb.com",
  "i.gr-assets.com",
  "images.gr-assets.com",
  "s.gr-assets.com",
]);

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const raw = typeof query.url === "string" ? query.url : "";
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: "Missing url" });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid url" });
  }

  if (target.protocol !== "https:" && target.protocol !== "http:") {
    throw createError({ statusCode: 400, statusMessage: "Invalid protocol" });
  }

  if (
    !ALLOWED_HOSTS.has(target.hostname) &&
    !target.hostname.endsWith(".gr-assets.com")
  ) {
    throw createError({ statusCode: 403, statusMessage: "Host not allowed" });
  }

  const upstream = await fetch(target.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; erbilnas-portfolio/1.0; +https://erbilnas.com)",
      Accept: "image/*,*/*;q=0.8",
      Referer: `${target.origin}/`,
    },
  });

  if (!upstream.ok) {
    throw createError({
      statusCode: upstream.status,
      statusMessage: "Upstream image failed",
    });
  }

  const contentType = upstream.headers.get("content-type") || "image/jpeg";
  setHeader(event, "Content-Type", contentType);
  setHeader(event, "Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

  return Buffer.from(await upstream.arrayBuffer());
});
