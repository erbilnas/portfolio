export const NAME_MAX = 40;
export const NOTE_MAX = 120;
export const RATE_WINDOW_MS = 15 * 60 * 1000;

export function stripTags(value) {
  return String(value ?? "").replace(/<[^>]*>/g, "");
}

export function sanitizeField(value, max) {
  return stripTags(value).replace(/\s+/g, " ").trim().slice(0, max);
}

export function isHoneypotFilled(website) {
  return Boolean(String(website ?? "").trim());
}

export function createRateLimiter(windowMs = RATE_WINDOW_MS) {
  const hits = new Map();
  return {
    allow(key) {
      const now = Date.now();
      const last = hits.get(key) ?? 0;
      if (now - last < windowMs) {
        return false;
      }
      hits.set(key, now);
      return true;
    },
  };
}
