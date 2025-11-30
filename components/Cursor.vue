<template>
  <div>
    <div
      ref="cursor"
      class="fixed w-4 h-4 bg-white rounded-full mix-blend-difference select-none pointer-events-none z-[9999] hidden"
    />
    <div
      ref="follower"
      class="fixed -top-3 -left-3 w-10 h-10 bg-white/[0.02] border border-white/[0.2] rounded-full select-none pointer-events-none z-[9999] hidden transition-[width,height] duration-200"
    />
  </div>
</template>

<script setup lang="ts">
import { useSettings } from "@/composables/settings";
import { useMediaQuery } from "@/composables/use-media-query-client";
import { computed, nextTick, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";

// Lazy load GSAP to avoid top-level await causing $r initialization errors
let gsap: typeof import("gsap").default | null = null;
const loadGSAP = async () => {
  if (!gsap) {
    const module = await import("gsap");
    gsap = module.default;
  }
  return gsap;
};

// Constants
const MAGNETIC_MAX_DISTANCE = 100;
const MAGNETIC_STRENGTH = 0.5;
const ELEMENT_MAGNETIC_STRENGTH = 0.1;

// Refs
const cursor = ref<HTMLElement | null>(null);
const follower = ref<HTMLElement | null>(null);
let clickableElements: NodeListOf<Element> | null = null;
let listenersAttached = false;

// Composables
const isDesktop = useMediaQuery("(min-width: 768px)");
const { cursorDisabled } = useSettings();

// Fallback check for desktop (in case media query hasn't initialized)
const isDesktopFallback = computed(() => {
  if (process.server) return false;
  if (typeof window === "undefined") return false;
  return window.innerWidth >= 768;
});

// Animation configurations
const cursorConfig = {
  normal: {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
  },
  hover: {
    scale: 0.5,
    duration: 0.3,
    ease: "power2.out",
  },
  click: {
    scale: 0.8,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  },
};

const followerConfig = {
  normal: {
    scale: 1,
    duration: 0.3,
    ease: "power2.out",
    borderColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  hover: {
    scale: 3,
    duration: 0.3,
    ease: "power2.out",
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  click: {
    scale: 2.5,
    duration: 0.1,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  },
};

// Utility functions
const calculateMagneticEffect = (
  mouseEvent: MouseEvent,
  target: HTMLElement
) => {
  const rect = target.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const distanceX = mouseEvent.clientX - centerX;
  const distanceY = mouseEvent.clientY - centerY;
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  const magnetStrength = Math.max(0, 1 - distance / MAGNETIC_MAX_DISTANCE);

  return {
    magnetX: centerX + distanceX * magnetStrength * MAGNETIC_STRENGTH,
    magnetY: centerY + distanceY * magnetStrength * MAGNETIC_STRENGTH,
    elementX: distanceX * magnetStrength * ELEMENT_MAGNETIC_STRENGTH,
    elementY: distanceY * magnetStrength * ELEMENT_MAGNETIC_STRENGTH,
  };
};

// Event handlers
const moveCircle = async (e: MouseEvent) => {
  if (!cursor.value || !follower.value) return;
  const gsapInstance = await loadGSAP();

  gsapInstance.to(cursor.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out",
  });

  gsapInstance.to(follower.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
    ease: "power2.out",
  });
};

const hover = async (e: Event) => {
  if (!cursor.value || !follower.value) return;
  const gsapInstance = await loadGSAP();

  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.currentTarget as HTMLElement;
  const { magnetX, magnetY, elementX, elementY } = calculateMagneticEffect(
    mouseEvent,
    target
  );

  gsapInstance.to(cursor.value, cursorConfig.hover);
  gsapInstance.to(follower.value, { ...followerConfig.hover, x: magnetX, y: magnetY });
  gsapInstance.to(target, {
    x: elementX,
    y: elementY,
    duration: 0.3,
    ease: "power2.out",
  });
};

const unhover = async (e: Event) => {
  if (!cursor.value || !follower.value) return;
  const gsapInstance = await loadGSAP();
  const target = (e as MouseEvent).currentTarget as HTMLElement;

  gsapInstance.to(cursor.value, cursorConfig.normal);
  gsapInstance.to(follower.value, followerConfig.normal);
  gsapInstance.to(target, {
    x: 0,
    y: 0,
    duration: 0.3,
    ease: "power2.out",
  });
};

const click = async () => {
  if (!cursor.value || !follower.value) return;
  const gsapInstance = await loadGSAP();
  gsapInstance.to(cursor.value, cursorConfig.click);
  gsapInstance.to(follower.value, followerConfig.click);
};

// Helper function to attach event listeners
const attachListeners = async () => {
  if (listenersAttached) return;
  if (!cursor.value || !follower.value) return;
  const gsapInstance = await loadGSAP();

  // Remove hidden class and set initial position
  cursor.value.classList.remove("hidden");
  follower.value.classList.remove("hidden");
  document.body.classList.remove("cursor-disabled");

  // Set initial position at center of screen (will be updated on first mousemove)
  const initialX = window.innerWidth / 2;
  const initialY = window.innerHeight / 2;
  
  gsapInstance.set(cursor.value, { x: initialX, y: initialY });
  gsapInstance.set(follower.value, { x: initialX, y: initialY });

  clickableElements = document.querySelectorAll(
    'a,  button, [role="button"], .link, input[type="submit"], input[type="button"], .card, .card-raised-big'
  );

  document.addEventListener("mousemove", moveCircle);
  document.addEventListener("click", click);

  clickableElements.forEach((el) => {
    el.addEventListener("mouseenter", hover);
    el.addEventListener("mouseleave", unhover);
    el.addEventListener("mousemove", hover);
  });

  listenersAttached = true;
};

// Helper function to remove event listeners
const removeListeners = () => {
  if (!listenersAttached) return;

  cursor.value?.classList.add("hidden");
  follower.value?.classList.add("hidden");
  document.body.classList.add("cursor-disabled");

  document.removeEventListener("mousemove", moveCircle);
  document.removeEventListener("click", click);

  if (clickableElements) {
    clickableElements.forEach((el) => {
      el.removeEventListener("mouseenter", hover);
      el.removeEventListener("mouseleave", unhover);
      el.removeEventListener("mousemove", hover);
    });
  }

  listenersAttached = false;
};

// Helper function to check if cursor should be enabled
const shouldEnableCursor = () => {
  // Use fallback if media query hasn't initialized yet
  const desktop = isDesktop.value || isDesktopFallback.value;
  return desktop && !cursorDisabled.value;
};

// Lifecycle hooks
onMounted(() => {
  if (cursorDisabled.value) {
    document.body.classList.add("cursor-disabled");
  }
  
  // Use nextTick to ensure DOM is ready, then check immediately
  // The watchEffect will also handle state changes
  nextTick(() => {
    if (shouldEnableCursor()) {
      attachListeners().catch(console.error);
    }
  });
});

onUnmounted(() => {
  removeListeners();
});

// Watch both values together to handle state changes
watchEffect(() => {
  if (shouldEnableCursor() && !listenersAttached) {
    attachListeners().catch(console.error);
  } else if (!shouldEnableCursor() && listenersAttached) {
    removeListeners();
  }
});
</script>
