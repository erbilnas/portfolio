## Learned User Preferences

- Prefer minimal UI and cut instructional/hint copy when the layout already makes the next action obvious.
- Light theme surfaces should stay near-white with less gray; avoid blueish skill/card fills; when fixing light theme, leave dark theme alone unless asked.
- Check dark-mode contrast for secondary text (years, labels, muted copy); prefer Tailwind `dark:` classes over JS color-mode branching so first paint stays readable under system dark.
- Prefer editorial Projects showcase (featured stage + app rail) over infinite-grid or fullscreen chrome; remove fullscreen when redesigning that section.
- Keep shipped app names/taglines/descriptions in locale files (en/tr/ja) under `projects.apps.*`, driven by ids in `constants/sponsored-apps.ts`.
- Keep Current Vibes visually distinct from Projects (no bordered stage + app-rail twin); use its own media-first dossier layout with short category labels and monochrome (ink/white) icons/progress, not colored brand accents; prefer unboxed metric rows over bordered stat containers.
- When redesigning Welcome, keep Hello, "It's me, Erbil", and FlipWords as the fold anchors.
- Prefer Bun-based Docker/build flows over npm for this project.
- Single CV entry point: open preview in a right-side drawer, then offer download.
- Do not reorder language lists when the language setting changes.
- Prefer compact, minimalist mobile layouts for dense cards and controls (pills, stats, settings).
- When a custom cursor is shown, hide the system default cursor.

## Learned Workspace Facts

- This is a Nuxt 3 portfolio (`erbilnas-com`) using Tailwind, shadcn-nuxt, `@nuxtjs/color-mode`, and `@nuxtjs/i18n` with en/tr/ja locales.
- Projects sits between About and Skills: editorial `SponsoredShowcase` (featured stage + rail) for shipped apps from `constants/sponsored-apps.ts` (brandColor + logos under `public/sponsored/`), plus a quiet GitHub repo strip from `/api/github/repos` (deduped against the catalog).
- Current Vibes integrates GitHub, Spotify, Trakt, HLTB, and Goodreads via a split dossier (`CurrentVibesShowcase` / `CurrentVibesStage`); non-travel categories use interactive Three.js scene components with live cover art where available (including `ReadingCover`); Travel uses `TravelGlobe` with places/highlights from env (via `parse-travel-places`); navbar vibes preview prefers live Spotify, then in-progress game, then currently reading, then last watched.
- Music vibes idle copy uses "Last played" when nothing is currently listening.
- Welcome uses `useWelcomeSpotlight` pointer light; the fold keeps Hello / intro / FlipWords / Resume / socials (scroll-hint chrome removed).
- Resume opens via `ResumeDrawer` (right-side sheet) over `public/resume.pdf` with preview-then-download.
- Scroll-driven browser tab titles come from section SEO meta and should not include Footer.
- Footer sign-off uses a "Farewell" treatment rather than a large name wordmark.
- App is commonly deployed with Coolify on Hetzner; branch/preview hosts include domains under `erbilnas.com`.
