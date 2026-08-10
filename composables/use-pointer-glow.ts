import {
  computed,
  onUnmounted,
  ref,
  watch,
  type Ref,
} from "vue";

import { useMediaQuery } from "~/composables/use-media-query-client";
import { useSettings } from "~/composables/settings";

const DEFAULT_SPOT = { x: 50, y: 42 };

const spotX = ref(DEFAULT_SPOT.x);
const spotY = ref(DEFAULT_SPOT.y);

let listenersBound = false;
let rafId: number | null = null;
let pendingX = DEFAULT_SPOT.x;
let pendingY = DEFAULT_SPOT.y;
let glowEl: HTMLElement | null = null;
let consumerCount = 0;

/**
 * Viewport pointer glow shared across the app.
 * Writes --glow-x / --glow-y (%) on the glow layer element.
 */
export function usePointerGlow(glowRef?: Ref<HTMLElement | null>) {
  const { reducedMotion } = useSettings();
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const hasFinePointer = useMediaQuery("(pointer: fine)");

  const interactionEnabled = computed(
    () => !reducedMotion.value && isMdUp.value && hasFinePointer.value,
  );

  const magnetEnabled = computed(() => interactionEnabled.value);

  const applyCssVars = (el: HTMLElement | null = glowEl) => {
    if (!el) return;
    el.style.setProperty("--glow-x", `${spotX.value}%`);
    el.style.setProperty("--glow-y", `${spotY.value}%`);
  };

  const freezeCenter = () => {
    spotX.value = DEFAULT_SPOT.x;
    spotY.value = DEFAULT_SPOT.y;
    pendingX = DEFAULT_SPOT.x;
    pendingY = DEFAULT_SPOT.y;
    applyCssVars();
  };

  const flush = () => {
    rafId = null;
    spotX.value = pendingX;
    spotY.value = pendingY;
    applyCssVars();
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!interactionEnabled.value) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w <= 0 || h <= 0) return;

    pendingX = (event.clientX / w) * 100;
    pendingY = (event.clientY / h) * 100;

    if (rafId == null) {
      rafId = window.requestAnimationFrame(flush);
    }
  };

  const onPointerLeave = () => {
    if (!interactionEnabled.value) return;
    pendingX = DEFAULT_SPOT.x;
    pendingY = DEFAULT_SPOT.y;
    if (rafId == null) {
      rafId = window.requestAnimationFrame(flush);
    }
  };

  const bindWindow = () => {
    if (listenersBound || !process.client) return;
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener(
      "pointerleave",
      onPointerLeave,
      { passive: true },
    );
    listenersBound = true;
  };

  const unbindWindow = () => {
    if (!listenersBound || !process.client) return;
    window.removeEventListener("pointermove", onPointerMove);
    document.documentElement.removeEventListener(
      "pointerleave",
      onPointerLeave,
    );
    listenersBound = false;
  };

  consumerCount += 1;
  bindWindow();

  if (glowRef) {
    watch(
      glowRef,
      (el) => {
        glowEl = el;
        if (el) applyCssVars(el);
      },
      { immediate: true },
    );
  }

  watch(
    interactionEnabled,
    (enabled) => {
      if (!enabled) freezeCenter();
    },
    { immediate: true },
  );

  onUnmounted(() => {
    consumerCount = Math.max(0, consumerCount - 1);
    if (consumerCount === 0) {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      unbindWindow();
      glowEl = null;
    }
  });

  return {
    spotX,
    spotY,
    interactionEnabled,
    magnetEnabled,
  };
}
