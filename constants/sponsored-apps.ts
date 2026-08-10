import type { SponsoredApp } from "~/types/sponsored-app";

/**
 * Display names and taglines live in locale files under `projects.apps.<id>`.
 * Logos: `public/sponsored/` as PNG or SVG with transparency when possible.
 * `brandColor` (hex) should match the logo — it tints the featured stage atmosphere.
 */
export const sponsoredApps: SponsoredApp[] = [
  {
    id: "farkle",
    brandColor: "#c2410c",
    url: "https://farkle.erbilnas.com/",
    image: "/sponsored/farkle-logo.png",
    imageFit: "contain",
    year: "2026",
  },
  {
    id: "baklavue",
    brandColor: "#42b883",
    url: "https://baklavue.erbilnas.com",
    image: "/sponsored/baklavue-logo.png",
    imageFit: "contain",
    year: "2025",
  },
  {
    id: "nestConcept",
    brandColor: "#78716c",
    logoLayout: "wide",
    url: "https://conceptnest.com.tr/",
    image: "/sponsored/nest-concept-logo.png",
    imageFit: "contain",
    year: "2025",
  },
  {
    id: "dontBeAfk",
    brandColor: "#22c55e",
    url: "https://www.glaze.app/app/dont-be-afk-2SXArO",
    image: "/sponsored/dont-be-afk-icon.png",
    imageFit: "contain",
    year: "2026",
  },
  {
    id: "gitPersona",
    brandColor: "#f97316",
    url: "https://www.glaze.app/app/git-persona-l3UPlC",
    image: "/sponsored/git-persona-icon.png",
    imageFit: "contain",
    year: "2026",
  },
  {
    id: "cura",
    brandColor: "#0ea5e9",
    url: "https://www.glaze.app/app/cura-HP0tKT",
    image: "/sponsored/cura-icon.png",
    imageFit: "contain",
    year: "2026",
  },
  {
    id: "readMyScreen",
    brandColor: "#2b8c6e",
    url: "https://www.raycast.com/erbilnas/read-my-screen",
    image: "/sponsored/read-my-screen-icon.png",
    imageFit: "contain",
    year: "2026",
  },
  {
    id: "crossingRhine",
    brandColor: "#7f1d1d",
    url: "https://team-horse-oclock.itch.io/ad406",
    image: "/sponsored/ad406-icon.png",
    imageFit: "contain",
    year: "2019",
  },
  {
    id: "spaceflash",
    brandColor: "#94a3b8",
    url: "https://sidequestvr.com/app/6529/spaceflash",
    image: "/sponsored/spaceflash-icon.png",
    imageFit: "contain",
    year: "2022",
  },
];
