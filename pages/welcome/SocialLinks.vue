<script lang="ts" setup>
import { useMediaQuery } from "@/composables/use-media-query-client";

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
const { t } = useI18n();

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

const moreOpen = ref(false);
const activeLabel = ref("");
const offsets = ref<Record<string, { x: number; y: number }>>({});

const iconLinkClass =
  "flex size-12 items-center justify-center rounded-xl text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out will-change-transform hover:bg-foreground/[0.06] hover:text-foreground focus-visible:bg-foreground/[0.06] focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 active:scale-[0.96] dark:hover:bg-foreground/[0.08] dark:focus-visible:bg-foreground/[0.08]";

const moreItemClass =
  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-[color,background-color,transform] duration-150 ease-out hover:bg-foreground/[0.06] hover:text-foreground focus-visible:bg-foreground/[0.06] focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/30 active:scale-[0.98] dark:hover:bg-foreground/[0.08]";

const moreLabel = computed(() => t("welcome.socialMore"));

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

const toggleMore = () => {
  moreOpen.value = !moreOpen.value;
  activeLabel.value = moreOpen.value ? moreLabel.value : "";
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
    <ul class="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      <li v-for="{ icon, href, label } in primaryLinks" :key="href">
        <a
          :href="href"
          target="_blank"
          rel="noopener noreferrer"
          :class="iconLinkClass"
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

      <li
        class="mx-0.5 hidden h-5 w-px shrink-0 bg-foreground/15 sm:mx-1.5 sm:block"
        aria-hidden="true"
        role="presentation"
      ></li>

      <li>
        <button
          type="button"
          :class="[
            iconLinkClass,
            moreOpen ? 'bg-foreground/[0.08] text-foreground' : '',
          ]"
          :aria-label="moreLabel"
          :aria-expanded="moreOpen"
          aria-controls="social-links-more"
          @click="toggleMore"
          @pointerenter="onLinkPointerEnter(moreLabel)"
          @pointerleave="activeLabel = moreOpen ? moreLabel : ''"
          @focus="onLinkFocus(moreLabel)"
          @blur="onLinkBlur"
        >
          <Icon
            :name="moreOpen ? 'ph:x-bold' : 'ph:dots-three-bold'"
            :size="22"
          />
        </button>
      </li>
    </ul>

    <ul
      v-if="moreOpen"
      id="social-links-more"
      class="mt-3 flex flex-wrap items-center justify-center gap-1"
    >
      <li v-for="link in moreLinks" :key="link.href">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          :class="moreItemClass"
          @pointerenter="onLinkPointerEnter(link.label)"
          @pointerleave="activeLabel = moreOpen ? moreLabel : ''"
          @focus="onLinkFocus(link.label)"
          @blur="onLinkBlur"
        >
          <Icon :name="link.icon" :size="18" class="shrink-0" />
          <span>{{ link.label }}</span>
        </a>
      </li>
    </ul>

    <p
      class="mt-3 h-5 text-center text-sm font-light text-muted-foreground transition-opacity duration-150 ease-out"
      :class="activeLabel && !moreOpen ? 'opacity-100' : 'opacity-0'"
      aria-live="polite"
    >
      <span v-if="activeLabel && !moreOpen">{{ activeLabel }}</span>
    </p>
  </nav>
</template>
