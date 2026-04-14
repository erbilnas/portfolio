import type { SponsoredApp } from "~/types/sponsored-app";

/**
 * Display names and taglines live in locale files under `sponsoredByMe.apps.<id>`.
 * Logos: `public/sponsored/` as PNG or SVG with transparency when possible.
 * `brandColor` (hex) should match the logo — it tints the card background and glow.
 */
export const sponsoredApps: SponsoredApp[] = [
  {
    id: "farkle",
    brandColor: "#c2410c",
    url: "https://farkle.erbilnas.com/",
    image: "/sponsored/farkle-logo.png",
    imageFit: "contain",
  },
  {
    id: "baklavue",
    brandColor: "#42b883",
    url: "https://baklavue.erbilnas.com",
    image: "/sponsored/baklavue-logo.png",
    imageFit: "contain",
  },
  {
    id: "nestConcept",
    /** Warm stone — tweak `brandColor` to match https://conceptnest.com.tr/ logo if needed */
    brandColor: "#78716c",
    logoLayout: "wide",
    url: "https://conceptnest.com.tr/",
    image: "/sponsored/nest-concept-logo.png",
    imageFit: "contain",
  },
  {
    id: "dontBeAfk",
    brandColor: "#22c55e",
    url: "https://github.com/erbilnas/dont-be-afk",
    image: "/sponsored/dont-be-afk-icon.png",
    imageFit: "contain",
  },
];
