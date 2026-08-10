<script setup lang="ts">
import Copyright from "./Copyright.vue";
import UsedTechnologies from "./UsedTechnologies.vue";
import Version from "./Version.vue";

const { t, locale } = useI18n();

const sectionRef = ref<HTMLElement | null>(null);
const farewellRef = ref<HTMLElement | null>(null);

const isCjk = computed(() => locale.value === "ja");

const farewellChars = computed(() => {
  const word = t("footer.farewell");
  return [...word];
});
</script>

<template>
  <section
    id="footer"
    ref="sectionRef"
    class="relative overflow-hidden bg-white dark:bg-black"
    :aria-label="t('footer.label')"
  >
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/[0.035] to-transparent dark:from-white/[0.05]"
      aria-hidden="true"
    />

    <div
      class="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 pt-24 md:gap-10 md:pt-32"
    >
      <UsedTechnologies />

      <div class="flex flex-col items-center gap-2.5">
        <Version />
        <Copyright />
      </div>
    </div>

    <div
      class="relative z-10 px-4 pb-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))] pt-14 md:pt-20"
    >
      <p
        ref="farewellRef"
        class="footer-farewell text-center font-light leading-[0.9] text-gray-900 dark:text-white"
        :class="
          isCjk
            ? 'footer-farewell--cjk tracking-normal'
            : 'footer-farewell--latin tracking-[0.04em]'
        "
        :aria-label="t('footer.farewell')"
      >
        <span
          v-for="(char, index) in farewellChars"
          :key="`${char}-${index}`"
          class="footer-farewell__char inline-block"
          :style="{ '--i': index }"
          aria-hidden="true"
        >{{ char === " " ? "\u00A0" : char }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.footer-farewell {
  /* Soft exit: only the baseline tips dissolve */
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
  font-size: clamp(4rem, 16vw, 10rem);
}

.footer-farewell--cjk {
  font-size: clamp(2.75rem, 11vw, 7rem);
}

.footer-farewell__char {
  /* Visible by default — motion only softens, never hides */
  opacity: 1;
  transform: translateY(0);
  transition:
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--i) * 28ms);
}

@media (hover: hover) and (pointer: fine) {
  .footer-farewell:hover .footer-farewell__char {
    opacity: 0.45;
  }
}

@supports (animation-timeline: view()) {
  .footer-farewell__char {
    animation: farewell-drift linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 45%;
    animation-delay: calc(var(--i) * 18ms);
  }

  @keyframes farewell-drift {
    from {
      transform: translateY(0.12em);
    }
    to {
      transform: translateY(0);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-farewell__char {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }

  .footer-farewell:hover .footer-farewell__char {
    transform: none;
  }
}

:global(html.reduce-motion) .footer-farewell__char {
  animation: none !important;
  transition: none !important;
  transform: none !important;
}
</style>
