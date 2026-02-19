export function usePersonJsonLd() {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();

  const siteUrl =
    (config.public as { siteUrl?: string })?.siteUrl ||
    "https://erbilnas.com";
  const siteDescription =
    (config.public as { siteDescription?: string })?.siteDescription ||
    "The digital showcase about me, a passionate software engineer with a love for video games, technology, and insightful writing.";

  const socialLinks = (appConfig as { socialLinks?: Record<string, string | undefined> })
    .socialLinks;
  const sameAs = Object.values(socialLinks ?? {}).filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Erbil Nas",
    jobTitle: "Software Engineer",
    url: siteUrl,
    description: siteDescription,
    ...(sameAs.length > 0 && { sameAs }),
  };
}
