<template>
  <div>
    <div
      ref="cursor"
      class="fixed w-4 h-4 bg-white rounded-full mix-blend-difference select-none pointer-events-none z-50 hidden"
    />
    <div
      ref="follower"
      class="fixed -top-3 -left-3 w-10 h-10 bg-white/[0.02] border border-white/[0.2] rounded-full select-none pointer-events-none z-50 hidden transition-[width,height] duration-200"
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
          ease: "power2.out",
        });
        gsap.to(follower.value, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const hover = (e: Event) => {
      if (cursor.value && follower.value) {
        const mouseEvent = e as MouseEvent;
        const target = mouseEvent.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Magnetic effect
        const maxDistance = 100;
        const distanceX = mouseEvent.clientX - centerX;
        const distanceY = mouseEvent.clientY - centerY;
        const distance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );
        const magnetStrength = Math.max(0, 1 - distance / maxDistance);

        const magnetX = centerX + distanceX * magnetStrength * 0.5;
        const magnetY = centerY + distanceY * magnetStrength * 0.5;

        gsap.to(cursor.value, {
          scale: 0.5,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(follower.value, {
          scale: 3,
          duration: 0.3,
          ease: "power2.out",
          x: magnetX,
          y: magnetY,
          borderColor: "rgba(255, 255, 255, 0.5)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
        });

        // Move target element slightly
        gsap.to(target, {
          x: distanceX * magnetStrength * 0.1,
          y: distanceY * magnetStrength * 0.1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const unHover = (e: Event) => {
      if (cursor.value && follower.value) {
        const target = (e as MouseEvent).currentTarget as HTMLElement;

        gsap.to(cursor.value, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(follower.value, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          borderColor: "rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        });

        // Reset target element position
        gsap.to(target, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    const click = () => {
      if (cursor.value && follower.value) {
        // Click animation
        gsap.to(cursor.value, {
          scale: 0.8,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });

        gsap.to(follower.value, {
          scale: 2.5,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      }
    };

    document.addEventListener("mousemove", moveCircle);
    document.addEventListener("click", click);

    const clickableElements = document.querySelectorAll(
      'a, button, [role="button"], .link, input[type="submit"], input[type="button"], .card, .card-raised-big'
    );

    clickableElements.forEach((el) => {
      el.addEventListener("mouseenter", hover);
      el.addEventListener("mouseleave", unHover);
      el.addEventListener("mousemove", hover); // For continuous magnetic effect
    });

    onUnmounted(() => {
      document.removeEventListener("mousemove", moveCircle);
      document.removeEventListener("click", click);
      clickableElements.forEach((el) => {
        el.removeEventListener("mouseenter", hover);
        el.removeEventListener("mouseleave", unHover);
        el.removeEventListener("mousemove", hover);
      });
    });
  }
});
</script>

<style scoped>
.cursor-dot {
  mix-blend-mode: difference;
}
</style>
