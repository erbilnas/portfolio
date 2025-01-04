<script lang="ts" setup>
const appConfig = useAppConfig();

const social_links = [
  {
    icon: "ph:github-logo",
    href: appConfig.social_links.github,
    label: "GitHub ",
  },
  {
    icon: "ph:goodreads-logo",
    href: appConfig.social_links.goodreads,
    label: "Goodreads ",
  },
  {
    icon: "ph:instagram-logo",
    href: appConfig.social_links.instagram,
    label: "Instagram ",
  },
  {
    icon: "ph:linkedin-logo",
    href: appConfig.social_links.linkedin,
    label: "LinkedIn ",
  },
  {
    icon: "ph:medium-logo",
    href: appConfig.social_links.medium,
    label: "Medium ",
  },
  {
    icon: "ph:spotify-logo",
    href: appConfig.social_links.spotify,
    label: "Spotify ",
  },
  {
    icon: "ph:steam-logo",
    href: appConfig.social_links.steam,
    label: "Steam ",
  },
  {
    icon: "ph:twitch-logo",
    href: appConfig.social_links.twitch,
    label: "Twitch ",
  },
  {
    icon: "ph:twitter-logo",
    href: appConfig.social_links.twitter,
    label: "Twitter ",
  },
  {
    icon: "ph:youtube-logo",
    href: appConfig.social_links.youtube,
    label: "YouTube ",
  },
];
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <TooltipProvider>
      <div class="grid grid-cols-5 md:grid-cols-10 gap-4 mt-4">
        <template v-for="{ icon, href, label } in social_links" :key="href">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                :href="href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon :name="icon" size="24" />
              </a>
            </TooltipTrigger>

            <TooltipContent>
              <p>{{ label }}</p>
            </TooltipContent>
          </Tooltip>
        </template>
      </div>
    </TooltipProvider>
  </div>
</template>
