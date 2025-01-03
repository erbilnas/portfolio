<script lang="ts" setup>
import {
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-vue-next";

const appConfig = useAppConfig();

const social_links = [
  {
    icon: LinkedinIcon,
    href: appConfig.social_links.linkedin,
    label: "LinkedIn ",
  },
  {
    icon: TwitterIcon,
    href: appConfig.social_links.twitter,
    label: "Twitter ",
  },
  {
    icon: GithubIcon,
    href: appConfig.social_links.github,
    label: "GitHub ",
  },
  {
    icon: InstagramIcon,
    href: appConfig.social_links.instagram,
    label: "Instagram ",
  },
];
</script>

<template>
  <div class="flex items-center justify-center gap-4 mt-8">
    <TooltipProvider>
      <template v-for="{ icon, href, label } in social_links" :key="href">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              :href="href"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
            >
              <component :is="icon" />
            </a>
          </TooltipTrigger>

          <TooltipContent>
            <p>{{ label }}</p>
          </TooltipContent>
        </Tooltip>
      </template>
    </TooltipProvider>
  </div>
</template>
