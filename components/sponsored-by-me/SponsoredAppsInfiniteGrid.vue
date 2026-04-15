<script setup lang="ts">
import ExpandableAppGallery from "~/components/sponsored-by-me/ExpandableAppGallery.vue";
import InfiniteGrid from "~/components/ui/infinite-grid/InfiniteGrid.vue";
import type {
  CardData,
  TileClickEventDetail,
} from "~/components/ui/infinite-grid/types";
import { useSettings } from "~/composables/settings";
import { sponsoredApps } from "~/constants/sponsored-apps";
import { onKeyStroke, useFullscreen } from "@vueuse/core";
import { Maximize2, Minimize2 } from "lucide-vue-next";

const { t } = useI18n();
const { reducedMotion } = useSettings();

const fullscreenRef = ref<HTMLElement | null>(null);
const { isFullscreen, isSupported, enter, exit } = useFullscreen(fullscreenRef);

/**
 * iOS / many mobile browsers do not expose Fullscreen API for generic elements,
 * so `useFullscreen` is unsupported and native `toggle()` does nothing.
 * This mirrors fullscreen visually with fixed positioning + scroll lock.
 */
const pseudoFullscreen = ref(false);

const inFullscreen = computed(
  () => isFullscreen.value || pseudoFullscreen.value,
);

function setBodyScrollLocked(locked: boolean) {
  if (!import.meta.client) {
    return;
  }
  document.body.style.overflow = locked ? "hidden" : "";
}

async function toggleFullscreen() {
  if (isFullscreen.value) {
    await exit();
    return;
  }
  if (pseudoFullscreen.value) {
    pseudoFullscreen.value = false;
    setBodyScrollLocked(false);
    return;
  }
  if (isSupported.value) {
    try {
      await enter();
      return;
    } catch {
      /* fall through to pseudo */
    }
  }
  pseudoFullscreen.value = true;
  setBodyScrollLocked(true);
}

onKeyStroke("Escape", () => {
  if (!pseudoFullscreen.value) {
    return;
  }
  pseudoFullscreen.value = false;
  setBodyScrollLocked(false);
});

/** Signals `Cursor.vue` to hide the custom cursor while the grid is in browser fullscreen. */
const sponsoredInfiniteGridFullscreen = useState(
  "sponsored-infinite-grid-fullscreen",
  () => false,
);

watch(
  inFullscreen,
  (v) => {
    sponsoredInfiniteGridFullscreen.value = v;
  },
  { immediate: true },
);

onBeforeUnmount(async () => {
  if (isFullscreen.value) {
    await exit();
  }
  pseudoFullscreen.value = false;
  setBodyScrollLocked(false);
  sponsoredInfiniteGridFullscreen.value = false;
});

/** Same-origin paths under `public/` — do not absolutize with `siteUrl` or dev hits production URLs and CORS breaks canvas textures. */
function imageUrlForGrid(src: string): string | undefined {
  if (!src) {
    return undefined;
  }
  if (/^https?:\/\//i.test(src)) {
    return src;
  }
  return src.startsWith("/") ? src : `/${src}`;
}

const cardData = computed<CardData[]>(() =>
  sponsoredApps.map((app, i) => ({
    title: t(`sponsoredByMe.apps.${app.id}.name`),
    badge: String(i + 1).padStart(2, "0"),
    description: t(`sponsoredByMe.apps.${app.id}.gridDescription`),
    tags: [],
    date: app.grid.date,
    image: imageUrlForGrid(app.image),
    url: app.url,
    sponsoredAppId: app.id,
  })),
);

const gridOptions = computed(() => ({
  gridCols: 4,
  gridRows: 4,
  gridGap: 0.1,
  tileSize: 3,
  baseCameraZ: 9,
  enablePostProcessing: true,
  postProcessParams: {
    distortionIntensity: -1,
    vignetteOffset: 0,
    vignetteDarkness: 0,
  },
}));

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function onTileClicked(detail: TileClickEventDetail) {
  const url = detail.cardData.url;
  if (!url) {
    return;
  }
  if (isExternalUrl(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    navigateTo(url);
  }
}
</script>

<template>
  <ExpandableAppGallery v-if="reducedMotion" :items="sponsoredApps" />
  <ClientOnly v-else>
    <div
      ref="fullscreenRef"
      :class="[
        'relative overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-950 shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)] ring-1 ring-white/10 light:border-neutral-200 light:bg-neutral-950 light:ring-black/10',
        inFullscreen
          ? pseudoFullscreen
            ? 'fixed inset-0 z-[9998] h-[100dvh] max-h-[100dvh] w-screen max-w-none rounded-none'
            : 'h-screen max-h-[100dvh] w-screen max-w-none rounded-none'
          : 'w-full max-w-6xl',
      ]"
    >
      <button
        type="button"
        class="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-black/55 text-white shadow-lg backdrop-blur-md transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 light:border-white/25 light:bg-white/90 light:text-neutral-900 light:hover:bg-white light:focus-visible:ring-neutral-400 light:focus-visible:ring-offset-white md:right-4 md:top-4"
        :aria-label="
          inFullscreen
            ? t('sponsoredByMe.exitFullscreen')
            : t('sponsoredByMe.enterFullscreen')
        "
        :aria-pressed="inFullscreen"
        @click="toggleFullscreen()"
      >
        <Minimize2 v-if="inFullscreen" class="h-5 w-5" aria-hidden="true" />
        <Maximize2 v-else class="h-5 w-5" aria-hidden="true" />
      </button>
      <div
        :class="[
          'w-full',
          inFullscreen ? 'h-full min-h-0' : 'h-[min(70vh,560px)] md:h-[min(70vh,640px)]',
        ]"
      >
        <InfiniteGrid
          :card-data="cardData"
          :options="gridOptions"
          @tile-clicked="onTileClicked"
        />
      </div>
    </div>
    <template #fallback>
      <div
        class="h-[min(70vh,560px)] w-full max-w-6xl rounded-2xl border border-neutral-800/80 bg-neutral-950 md:h-[min(70vh,640px)] light:border-neutral-200 light:bg-neutral-950"
        aria-hidden="true"
      />
    </template>
  </ClientOnly>
</template>
