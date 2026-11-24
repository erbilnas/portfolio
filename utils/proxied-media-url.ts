/** Hosts served via `/api/image-proxy` (keep in sync with server/api/image-proxy.get.ts). */
const PROXY_HOSTS = new Set([
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

/**
 * Rewrite remote vibes media to same-origin proxy so canvas / WebGL
 * can load with CORS (HLTB, Spotify, TMDB, Goodreads, etc.).
 */
export function proxiedMediaUrl(src: string): string {
  if (!src || src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const { hostname } = new URL(src);
    if (
      PROXY_HOSTS.has(hostname) ||
      hostname.endsWith(".gr-assets.com") ||
      hostname.endsWith(".scdn.co")
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return src;
  }
  return src;
}
