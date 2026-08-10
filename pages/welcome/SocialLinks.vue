<script lang="ts" setup>
import { useMediaQuery } from "@/composables/use-media-query-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const props = withDefaults(
  defineProps<{
    magnetEnabled?: boolean;
  }>(),
  {
    magnetEnabled: false,
  },
);

const appConfig = useAppConfig();
const isMobile = useMediaQuery("(max-width: 768px)");

interface SocialLink {
  icon: string;
  href: string;
  label: string;
  primary?: boolean;
}

const socialLinks: SocialLink[] = [
  {
    icon: "ph:github-logo",
    href: appConfig.socialLinks.github,
    label: "GitHub",
    primary: true,
  },
  {
    icon: "ph:linkedin-logo",
    href: appConfig.socialLinks.linkedin,
    label: "LinkedIn",
    primary: true,
  },
  {
    icon: "ph:x-logo",
    href: appConfig.socialLinks.twitter,
    label: "X",
    primary: true,
  },
  {
    icon: "ph:instagram-logo",
    href: appConfig.socialLinks.instagram,
    label: "Instagram",
    primary: true,
  },
  {
    icon: "ph:spotify-logo",
    href: appConfig.socialLinks.spotify,
    label: "Spotify",
    primary: true,
  },
  {
    icon: "ph:youtube-logo",
    href: appConfig.socialLinks.youtube,
    label: "YouTube",
    primary: true,
  },
  {
    icon: "ph:goodreads-logo",
    href: appConfig.socialLinks.goodreads,
    label: "Goodreads",
  },
  {
    icon: "ph:medium-logo",
    href: appConfig.socialLinks.medium,
    label: "Medium",
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
];

const primaryLinks = socialLinks.filter((link) => link.primary);
const moreLinks = socialLinks.filter((link) => !link.primary);

const MAGNET_STRENGTH = 0.28;
const MAGNET_RANGE = 72;

const activeLabel = ref("");
const offsets = ref<Record<string, { x: number; y: number }>>({});

const resetOffsets = () => {
  offsets.value = {};
};

const onLinkPointerMove = (href: string, event: PointerEvent) => {
  if (!props.magnetEnabled || isMobile.value) return;

  const target = event.currentTarget as HTMLElement | null;
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = event.clientX - cx;
  const dy = event.clientY - cy;
  const dist = Math.hypot(dx, dy);

  if (dist > MAGNET_RANGE) {
    offsets.value = { ...offsets.value, [href]: { x: 0, y: 0 } };
    return;
  }

  offsets.value = {
    ...offsets.value,
    [href]: {
      x: dx * MAGNET_STRENGTH,
      y: dy * MAGNET_STRENGTH,
    },
  };
};

const onLinkPointerEnter = (label: string) => {
  activeLabel.value = label;
};

const onLinkPointerLeave = (href: string) => {
  offsets.value = { ...offsets.value, [href]: { x: 0, y: 0 } };
  activeLabel.value = "";
};

const onLinkFocus = (label: string) => {
  activeLabel.value = label;
};

const onLinkBlur = () => {
  activeLabel.value = "";
};

watch(
  () => props.magnetEnabled,
  (enabled) => {
    if (!enabled) resetOffsets();
  },
);

const linkStyle = (href: string) => {
  const offset = offsets.value[href];
  if (!offset || (offset.x === 0 && offset.y === 0)) {
    return undefined;
  }
  return {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
  };
};
</script>

<template>
  <nav class="mx-auto w-full max-w-2xl" aria-label="Social links">
    <ul
      class="flex flex-wrap items-center justify-center gap-x-0.5 gap-y-1 sm:gap-x-1.5"
    >
      <li v-for="{ icon, href, label } in primaryLinks" :key="href">
        <a
          :href="href"
          target="_blank"
          rel="noopener noreferrer"
          class="flex size-11 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out will-change-transform hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
          :style="linkStyle(href)"
          :aria-label="label"
          @pointerenter="onLinkPointerEnter(label)"
          @pointermove="onLinkPointerMove(href, $event)"
          @pointerleave="onLinkPointerLeave(href)"
          @focus="onLinkFocus(label)"
          @blur="onLinkBlur"
        >
          <Icon :name="icon" :size="22" />
        </a>
      </li>

      <li>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              class="flex size-11 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
              :aria-label="$t('welcome.socialMore')"
              @pointerenter="onLinkPointerEnter($t('welcome.socialMore'))"
              @pointerleave="activeLabel = ''"
              @focus="onLinkFocus($t('welcome.socialMore'))"
              @blur="onLinkBlur"
            >
              <Icon name="ph:dots-three-bold" :size="22" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            class="w-auto border-foreground/10 bg-background p-2 shadow-none"
            align="center"
            :side-offset="8"
          >
            <ul class="flex items-center gap-0.5">
              <li v-for="{ icon, href, label } in moreLinks" :key="href">
                <a
                  :href="href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex size-10 items-center justify-center text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30"
                  :aria-label="label"
                  @pointerenter="onLinkPointerEnter(label)"
                  @pointerleave="activeLabel = ''"
                  @focus="onLinkFocus(label)"
                  @blur="onLinkBlur"
                >
                  <Icon :name="icon" :size="20" />
                </a>
              </li>
            </ul>
          </PopoverContent>
        </Popover>
      </li>
    </ul>

    <p
      class="mt-3 h-5 text-center text-sm font-light text-muted-foreground transition-opacity duration-150 ease-out"
      :class="activeLabel ? 'opacity-100' : 'opacity-0'"
      aria-live="polite"
    >
      <span v-if="activeLabel">{{ activeLabel }}</span>
    </p>
  </nav>
</template>
