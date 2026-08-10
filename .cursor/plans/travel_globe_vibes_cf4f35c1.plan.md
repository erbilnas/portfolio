---
name: Travel Globe Vibes
overview: Replace the Travel tab’s static map cover with a client-only interactive COBE globe (drag + auto-spin) whose marker pins are loaded from a TRAVEL_PLACES env JSON via Nuxt appConfig.
todos:
  - id: travel-places-env
    content: Add TRAVEL_PLACES env JSON, parse into appConfig.maps.places in nuxt.config
    status: completed
  - id: travel-globe
    content: Build TravelGlobe.vue (cobe + spring drag, theme, reducedMotion, resize/cleanup; markers from appConfig)
    status: completed
  - id: stage-wire
    content: Swap map cover in CurrentVibesStage to ClientOnly TravelGlobe
    status: completed
isProject: false
---

# Travel 3D Globe for Current Vibes

## Approach

Use existing `cobe` + `vue-use-spring` (no new deps). Swap the Travel cover image in [`CurrentVibesStage.vue`](components/current-vibes/CurrentVibesStage.vue) for a WebGL globe. Marker coordinates come from env (`TRAVEL_PLACES`), same pattern as existing `COUNTRIES_VISITED_COUNT` / `CITIES_VISITED_COUNT`. Keep the ink-panel stats and Visit link unchanged.

## Data (env-driven)

Extend [`nuxt.config.ts`](nuxt.config.ts) `appConfig.maps`:

```ts
maps: {
  placesBeen: process.env.PLACES_BEEN_URL,
  countriesVisited: process.env.COUNTRIES_VISITED_COUNT,
  citiesVisited: process.env.CITIES_VISITED_COUNT,
  places: parseTravelPlaces(process.env.TRAVEL_PLACES),
},
```

`TRAVEL_PLACES` is a JSON array string:

```json
[
  { "id": "tokyo", "name": "Tokyo", "lat": 35.6762, "lng": 139.6503 },
  { "id": "osaka", "name": "Osaka", "lat": 34.6937, "lng": 135.5023 }
]
```

Parser (inline in `nuxt.config.ts` or a tiny root helper imported there):

- `JSON.parse` the env string
- Validate each entry has `id`, `name`, finite `lat`/`lng`
- On missing/invalid env: `places: []` (globe still renders, no pins; no throw at boot)
- Map to COBE shape `{ location: [lat, lng], size: 0.03 }` inside `TravelGlobe`

Seed `.env` with the full list the user provided (Tokyo, Osaka, Kyoto, Kobe, Nagoya, Hakone, Tirana, Vienna, Sarajevo, Mostar, Rome, Florence, Venice, Pisa, Pristina, Budva, Kotor, Skopje, Ohrid, Belgrade, Istanbul, Ankara, Izmir) plus approximate lat/lng. Do not commit secrets; only document the key if an `.env.example` exists, otherwise leave a one-line comment near the maps block in `nuxt.config.ts`.

No hardcoded `constants/travel-places.ts` source of truth — env is the catalog.

Uniform marker size (~`0.03`). Names stay for maintenance / future a11y; no floating label chips on the cover.

## Component

Add [`components/current-vibes/TravelGlobe.vue`](components/current-vibes/TravelGlobe.vue):

- Read markers via `useAppConfig().maps.places`.
- Canvas fills the cover (`absolute inset-0`, `cursor-grab` / `grabbing`).
- `createGlobe` on mount; `destroy()` on unmount.
- Pointer drag → spring (`vue-use-spring`) on `phi`; auto-rotate when not dragging.
- `ResizeObserver` + `devicePixelRatio` so the canvas matches the cover box.
- Theme from `@nuxtjs/color-mode`: light/dark tonal neutrals for base/marker/glow (not cyan/purple).
- Honor `reducedMotion` from [`composables/settings.ts`](composables/settings.ts): freeze auto-spin; drag still allowed.
- Mount only via `<ClientOnly>` (WebGL / no SSR canvas).

Export from [`components/current-vibes/index.ts`](components/current-vibes/index.ts).

## Stage wiring

In [`CurrentVibesStage.vue`](components/current-vibes/CurrentVibesStage.vue) cover slot (~lines 71–84):

- If `card.type === 'map'`: render `<ClientOnly><TravelGlobe /></ClientOnly>` (neutral cover bg as hydrate fallback).
- Else: keep the existing `<img :src="metadata.src" />`.

Stats/`visitUrl` in [`cards-metadata.ts`](composables/current-vibes/cards-metadata.ts) stay as-is.

## Motion / a11y

- Cover bg always visible; no opacity-gated content.
- Decorative canvas `aria-hidden="true"`; meaning lives in the ink panel.
- `touch-action: none` on the canvas for mobile drag without fighting scroll.

## Out of scope

- No arcs between cities.
- No geocoding API (coords live in the env JSON).
- No fullscreen / change to other vibe types.
