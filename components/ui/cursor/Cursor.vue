<template>
  <div>
    <div
      ref="cursor"
      class="fixed w-4 h-4 bg-white rounded-full mix-blend-difference select-none pointer-events-none z-50 hidden"
    />
    <div
      ref="follower"
      class="fixed -top-3 -left-3 w-10 h-10 bg-white/[0.02] border border-white/[0.2] rounded-full select-none pointer-events-none z-50 hidden"
    />
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import { onMounted, onUnmounted, ref } from "vue";

const cursor = ref<HTMLElement | null>(null);
const follower = ref<HTMLElement | null>(null);

onMounted(() => {
  if (document.body.clientWidth > 767) {
    cursor.value?.classList.remove("hidden");
    follower.value?.classList.remove("hidden");

    const moveCircle = (e: MouseEvent) => {
      if (cursor.value && follower.value) {
        gsap.to(cursor.value, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: "none",
        });
        gsap.to(follower.value, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "none",
        });
      }
    };

    const hover = () => {
      if (cursor.value && follower.value) {
        gsap.to(cursor.value, {
          scale: 0.5,
          duration: 0.3,
        });
        gsap.to(follower.value, {
          scale: 3,
          duration: 0.3,
        });
      }
    };

    const unHover = () => {
      if (cursor.value && follower.value) {
        gsap.to(cursor.value, {
          scale: 1,
          duration: 0.3,
        });
        gsap.to(follower.value, {
          scale: 1,
          duration: 0.3,
        });
      }
    };

    document.addEventListener("mousemove", moveCircle);

    const clickableElements = document.querySelectorAll(
      'a, button, [role="button"], .link, input[type="submit"], input[type="button"], .card, .card-raised-big'
    );

    clickableElements.forEach((el) => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", unHover);
    });

    onUnmounted(() => {
      document.removeEventListener("mousemove", moveCircle);
      clickableElements.forEach((el) => {
        el.removeEventListener("mouseenter", hover);
        el.removeEventListener("mouseleave", unHover);
      });
    });
  }
});
</script>
