export interface SponsoredApp {
  /** Key for `sponsoredByMe.apps.<id>` name + tagline in locale files */
  id: string;
  /**
   * Primary brand hex from the logo (e.g. `#42b883`) — tints the card atmosphere and glow.
   */
  brandColor: string;
  /** External or internal URL */
  url: string;
  /** Path under `public/` (e.g. `/sponsored/app.png`) or absolute image URL; empty = gradient placeholder */
  image: string;
  /** Logos and marks often need `contain`; full-bleed screenshots use `cover` (default). */
  imageFit?: "cover" | "contain";
  /**
   * Use PNG or SVG with an alpha channel so the card gradient shows through.
   * If you only have a flat white background, set `multiply` so the logo blends into the scene (alters colors slightly).
   */
  logoBlend?: "normal" | "multiply";
  /**
   * Horizontal wordmarks: wider top-left slot and slightly shorter max height so the mark reads clearly.
   */
  logoLayout?: "wide";
}
