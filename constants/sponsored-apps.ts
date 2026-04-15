import type { SponsoredApp } from "~/types/sponsored-app";

/**
 * Display names, taglines, and grid card blurbs live in locale files under `sponsoredByMe.apps.<id>`.
 * Logos: `public/sponsored/` as PNG or SVG with transparency when possible.
 * `brandColor` (hex) should match the logo — it tints the card atmosphere and glow.
 */
export const sponsoredApps: SponsoredApp[] = [
  {
    id: "farkle",
    brandColor: "#c2410c",
    url: "https://farkle.erbilnas.com/",
    image: "/sponsored/farkle-logo.png",
    imageFit: "contain",
    grid: { date: "2026" },
  },
  {
    id: "baklavue",
    brandColor: "#42b883",
    url: "https://baklavue.erbilnas.com",
    image: "/sponsored/baklavue-logo.png",
    imageFit: "contain",
    grid: { date: "2025" },
  },
  {
    id: "nestConcept",
    brandColor: "#78716c",
    logoLayout: "wide",
    url: "https://conceptnest.com.tr/",
    image: "/sponsored/nest-concept-logo.png",
    imageFit: "contain",
    grid: { date: "2025" },
  },
  {
    id: "dontBeAfk",
    brandColor: "#22c55e",
    url: "https://github.com/erbilnas/dont-be-afk",
    image: "/sponsored/dont-be-afk-icon.png",
    imageFit: "contain",
    grid: { date: "2025" },
  },
  {
    id: "readMyScreen",
    brandColor: "#8b5cf6",
    url: "https://github.com/erbilnas/read-my-screen",
    image: "/sponsored/read-my-screen-icon.png",
    imageFit: "contain",
    grid: { date: "2026" },
  },
];
