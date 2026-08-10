export interface SponsoredApp {
  /** Key for `projects.apps.<id>` name + tagline in locale files */
  id: string;
  /**
   * Primary brand hex from the logo (e.g. `#42b883`) — tints the featured stage atmosphere.
   */
  brandColor: string;
  /** External or internal URL */
  url: string;
  /** Path under `public/` (e.g. `/sponsored/app.png`) or absolute image URL; empty = gradient placeholder */
  image: string;
  /** Logos and marks often need `contain`; full-bleed screenshots use `cover` (default). */
  imageFit?: "cover" | "contain";
  /**
   * Use PNG or SVG with an alpha channel so the brand atmosphere shows through.
   * If you only have a flat white background, set `multiply` so the logo blends into the scene (alters colors slightly).
   */
  logoBlend?: "normal" | "multiply";
  /**
   * Horizontal wordmarks: wider logo slot so the mark reads clearly.
   */
  logoLayout?: "wide";
  /** Ship year shown on the featured stage and rail */
  year: string;
}
