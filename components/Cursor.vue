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
import { useMediaQuery } from "@vueuse/core";
import { onMounted, onUnmounted, ref } from "vue";

const gsap = await import("gsap").then((m) => m.default);
// Constants
const MAGNETIC_MAX_DISTANCE = 100;
const MAGNETIC_STRENGTH = 0.5;
const ELEMENT_MAGNETIC_STRENGTH = 0.1;
const MOBILE_BREAKPOINT = 767;

// Refs
const cursor = ref<HTMLElement | null>(null);
const follower = ref<HTMLElement | null>(null);

// Composables
const isDesktop = useMediaQuery(`(min-width: ${MOBILE_BREAKPOINT}px)`);

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
const moveCircle = (e: MouseEvent) => {
  if (!cursor.value || !follower.value) return;

  gsap.to(cursor.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out",
  });

  gsap.to(follower.value, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.3,
    ease: "power2.out",
  });
};

const hover = (e: Event) => {
  if (!cursor.value || !follower.value) return;

  const mouseEvent = e as MouseEvent;
  const target = mouseEvent.currentTarget as HTMLElement;
  const { magnetX, magnetY, elementX, elementY } = calculateMagneticEffect(
    mouseEvent,
    target
  );

  gsap.to(cursor.value, cursorConfig.hover);
  gsap.to(follower.value, { ...followerConfig.hover, x: magnetX, y: magnetY });
  gsap.to(target, {
    x: elementX,
    y: elementY,
    duration: 0.3,
    ease: "power2.out",
  });
};

const unhover = (e: Event) => {
  if (!cursor.value || !follower.value) return;
  const target = (e as MouseEvent).currentTarget as HTMLElement;

  gsap.to(cursor.value, cursorConfig.normal);
  gsap.to(follower.value, followerConfig.normal);
  gsap.to(target, {
    x: 0,
    y: 0,
    duration: 0.3,
    ease: "power2.out",
  });
};

const click = () => {
  if (!cursor.value || !follower.value) return;
  gsap.to(cursor.value, cursorConfig.click);
  gsap.to(follower.value, followerConfig.click);
};

// Lifecycle hooks
onMounted(() => {
  if (!isDesktop.value) return;

  cursor.value?.classList.remove("hidden");
  follower.value?.classList.remove("hidden");

  const clickableElements = document.querySelectorAll(
    'a,  button, [role="button"], .link, input[type="submit"], input[type="button"], .card, .card-raised-big'
  );

  document.addEventListener("mousemove", moveCircle);
  document.addEventListener("click", click);

  clickableElements.forEach((el) => {
    el.addEventListener("mouseenter", hover);
    el.addEventListener("mouseleave", unhover);
    el.addEventListener("mousemove", hover);
  });

  onUnmounted(() => {
    document.removeEventListener("mousemove", moveCircle);
    document.removeEventListener("click", click);
    clickableElements.forEach((el) => {
      el.removeEventListener("mouseenter", hover);
      el.removeEventListener("mouseleave", unhover);
      el.removeEventListener("mousemove", hover);
    });
  });
});
</script>
