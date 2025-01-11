<script lang="ts" setup>
const appConfig = useAppConfig();

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

const socialLinks: SocialLink[] = [
  {
    icon: "ph:github-logo",
    href: appConfig.socialLinks.github,
    label: "GitHub ",
  },
  {
    icon: "ph:goodreads-logo",
    href: appConfig.socialLinks.goodreads,
    label: "Goodreads ",
  },
  {
    icon: "ph:instagram-logo",
    href: appConfig.socialLinks.instagram,
    label: "Instagram ",
  },
  {
    icon: "ph:linkedin-logo",
    href: appConfig.socialLinks.linkedin,
    label: "LinkedIn ",
  },
  {
    icon: "ph:medium-logo",
    href: appConfig.socialLinks.medium,
    label: "Medium ",
  },
  {
    icon: "ph:spotify-logo",
    href: appConfig.socialLinks.spotify,
    label: "Spotify",
  },
  {
    icon: "ph:steam-logo",
    href: appConfig.socialLinks.steam,
    label: "Steam",
  },
  {
    icon: "ph:twitch-logo",
    href: appConfig.socialLinks.twitch,
    label: "Twitch",
  },
  {
    icon: "ph:twitter-logo",
    href: appConfig.socialLinks.twitter,
    label: "Twitter",
  },
  {
    icon: "ph:youtube-logo",
    href: appConfig.socialLinks.youtube,
    label: "YouTube",
  },
];
</script>

<template>
  <div class="mx-auto">
    <TooltipProvider>
      <div class="grid grid-cols-5 md:grid-cols-10 gap-4">
        <template v-for="{ icon, href, label } in socialLinks" :key="href">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                :href="href"
                target="_blank"
                class="flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon :name="icon" :size="24" />
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
