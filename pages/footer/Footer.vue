<script setup lang="ts">
import { useSettings } from "~/composables/settings";
import Copyright from "./Copyright.vue";
import UsedTechnologies from "./UsedTechnologies.vue";

const { t, locale } = useI18n();
const { reducedMotion } = useSettings();

const sectionRef = ref<HTMLElement | null>(null);
const scrollProgress = ref(0);
const prefersReduced = ref(false);

const isCjk = computed(() => locale.value === "ja");

const motionAllowed = computed(
  () => !reducedMotion.value && !prefersReduced.value,
);

/** Ease-out so scale settles instead of racing linearly. */
const easedProgress = computed(() => {
  const p = scrollProgress.value;
  return 1 - (1 - p) * (1 - p);
});

/** Grow through the footer travel; rests under version / copyright. */
const farewellScale = computed(() => {
  if (!motionAllowed.value) return 1;
  return 1 + easedProgress.value * 0.35;
});

const farewellStyle = computed(() => ({
  transform: `scale(${farewellScale.value})`,
}));

/** Reserve layout height for max scale so glyphs don’t spill under the nav. */
const farewellSlotStyle = computed(() => {
  if (!motionAllowed.value) return undefined;
  return {
    minHeight: isCjk.value
      ? "calc(1.35 * clamp(2.75rem, 11vw, 7rem))"
      : "calc(1.35 * clamp(4.25rem, 16vw, 10rem))",
  };
});

let ticking = false;

const updateScrollProgress = () => {
  const section = sectionRef.value;
  if (!section || !motionAllowed.value) {
    scrollProgress.value = 0;
    ticking = false;
    return;
  }

  const rect = section.getBoundingClientRect();
  // 0 as footer enters the fold; 1 when its bottom meets the viewport bottom
  const start = window.innerHeight;
  const finish = window.innerHeight - rect.height;
  const span = Math.max(1, start - finish);
  scrollProgress.value = Math.min(1, Math.max(0, (start - rect.top) / span));
  ticking = false;
};

const onScrollOrResize = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScrollProgress);
};

useObserver("Footer", sectionRef);

onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    prefersReduced.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }
  updateScrollProgress();
  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScrollOrResize);
  window.removeEventListener("resize", onScrollOrResize);
});

watch(motionAllowed, () => {
  updateScrollProgress();
});
</script>

<template>
  <section
    id="footer"
    ref="sectionRef"
    class="relative overflow-x-clip bg-white dark:bg-black"
    :aria-label="t('footer.label')"
  >
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/[0.035] to-transparent dark:from-white/[0.05]"
      aria-hidden="true"
    />

    <div
      class="relative z-10 flex w-full flex-col items-center px-4 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] pt-12 md:pt-16"
    >
      <div
        class="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-2"
      >
        <UsedTechnologies />
        <Copyright />
      </div>

      <div
        class="mt-8 flex w-full items-start justify-center md:mt-10"
        :style="farewellSlotStyle"
      >
        <p
          class="footer-farewell origin-top text-center font-semibold leading-none tracking-tight text-gray-900 dark:text-white"
          :class="
            isCjk
              ? 'footer-farewell--cjk tracking-normal'
              : 'footer-farewell--latin'
          "
          :style="farewellStyle"
        >
          {{ t("footer.farewell") }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.footer-farewell {
  /* Soft exit: baseline tips dissolve into the page end */
  -webkit-mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 72%,
    rgba(0, 0, 0, 0.85) 84%,
    rgba(0, 0, 0, 0.35) 94%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    #000 0%,
    #000 72%,
    rgba(0, 0, 0, 0.85) 84%,
    rgba(0, 0, 0, 0.35) 94%,
    transparent 100%
  );
}

.footer-farewell--latin {
  font-size: clamp(4.25rem, 16vw, 10rem);
}

.footer-farewell--cjk {
  font-size: clamp(2.75rem, 11vw, 7rem);
}
</style>
