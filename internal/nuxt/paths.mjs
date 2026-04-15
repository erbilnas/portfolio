/**
 * Subpath import target for `#internal/nuxt/paths` (see root package.json "imports").
 * Nuxt’s Vite SSR bundle imports `baseURL` as a function used by `$fetch` setup.
 */
export function baseURL() {
  const raw = process.env.NUXT_APP_BASE_URL;
  if (raw === undefined || raw === "" || raw === "/") {
    return "/";
  }
  return String(raw).replace(/\/$/, "") || "/";
}
