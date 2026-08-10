<script setup lang="ts">
import createGlobe, { type COBEOptions, type Marker } from "cobe";
import { useSpring } from "vue-use-spring";
import type { TravelPlace } from "~/utils/parse-travel-places";
import { useSettings } from "~/composables/settings";

const MARKER_SIZE = 0.03;

const appConfig = useAppConfig();
const colorMode = useColorMode();
const { reducedMotion } = useSettings();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const width = ref(0);
const phi = ref(0);
const pointerInteracting = ref<number | null>(null);
const pointerInteractionMovement = ref(0);

const spring = useSpring(
  { r: 0 },
  { mass: 1, tension: 280, friction: 100, precision: 0.001 },
);

let globe: ReturnType<typeof createGlobe> | null = null;
let resizeObserver: ResizeObserver | null = null;

const places = computed((): TravelPlace[] => {
  const raw = appConfig.maps?.places;
  return Array.isArray(raw) ? (raw as TravelPlace[]) : [];
});

const markers = computed((): Marker[] =>
  places.value.map((place) => ({
    location: [place.lat, place.lng],
    size: MARKER_SIZE,
  })),
);

const isDark = computed(() => colorMode.value === "dark");

function themeOptions(): Pick<
  COBEOptions,
  "dark" | "baseColor" | "markerColor" | "glowColor" | "mapBrightness" | "diffuse"
> {
  if (isDark.value) {
    return {
      dark: 1,
      baseColor: [0.28, 0.28, 0.28],
      markerColor: [0.92, 0.92, 0.92],
      glowColor: [0.72, 0.72, 0.72],
      mapBrightness: 4.5,
      diffuse: 1.1,
    };
  }
  return {
    dark: 0,
    baseColor: [0.94, 0.94, 0.94],
    markerColor: [0.18, 0.18, 0.18],
    glowColor: [1, 1, 1],
    mapBrightness: 1.4,
    diffuse: 0.55,
  };
}

function onRender(state: Record<string, unknown>) {
  if (pointerInteracting.value === null && !reducedMotion.value) {
    phi.value += 0.0025;
  }
  state.phi = phi.value + spring.r;
  state.width = width.value * 2;
  state.height = width.value * 2;
}

function destroyGlobe() {
  globe?.destroy();
  globe = null;
}

function createOrRecreateGlobe() {
  const canvas = canvasRef.value;
  if (!canvas || width.value <= 0) {
    return;
  }

  destroyGlobe();

  const theme = themeOptions();
  globe = createGlobe(canvas, {
    devicePixelRatio: 2,
    width: width.value * 2,
    height: width.value * 2,
    phi: 0,
    theta: 0.25,
    mapSamples: 16000,
    markers: markers.value,
    opacity: 1,
    scale: 1.07,
    ...theme,
    onRender,
  });
}

function updatePointerInteraction(clientX: number | null) {
  if (clientX !== null) {
    pointerInteracting.value = clientX - pointerInteractionMovement.value;
  } else {
    pointerInteracting.value = null;
  }
}

function updateMovement(clientX: number) {
  if (pointerInteracting.value === null) {
    return;
  }
  const delta = clientX - pointerInteracting.value;
  pointerInteractionMovement.value = delta;
  spring.r = delta / 200;
}

function measure() {
  const el = containerRef.value;
  if (!el) {
    return;
  }
  // Size to the longer edge so a tall cover still fills with the globe.
  const next = Math.max(el.clientWidth, el.clientHeight);
  if (next > 0 && next !== width.value) {
    width.value = next;
    createOrRecreateGlobe();
  } else if (next > 0 && !globe) {
    width.value = next;
    createOrRecreateGlobe();
  }
}

onMounted(() => {
  measure();
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  destroyGlobe();
});

watch([isDark, markers], () => {
  if (width.value > 0) {
    createOrRecreateGlobe();
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-950"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="h-full w-full max-w-none cursor-grab touch-none [contain:layout_paint_size] active:cursor-grabbing"
      @pointerdown="(e) => updatePointerInteraction(e.clientX)"
      @pointerup="updatePointerInteraction(null)"
      @pointerout="updatePointerInteraction(null)"
      @pointermove="(e) => updateMovement(e.clientX)"
      @touchmove.passive="
        (e) => e.touches[0] && updateMovement(e.touches[0].clientX)
      "
    />
  </div>
</template>
