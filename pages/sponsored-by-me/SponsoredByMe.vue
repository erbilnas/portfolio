<script lang="ts" setup>
import ExpandableAppGallery from "~/components/sponsored-by-me/ExpandableAppGallery.vue";
import { sponsoredApps } from "~/constants/sponsored-apps";

const sectionRef = ref<HTMLElement | null>(null);

useObserver("Sponsored (by me)", sectionRef);

const { t } = useI18n();
</script>

<template>
  <section id="sponsored-by-me" ref="sectionRef" class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.18),transparent)]"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute left-0 top-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-400/10 blur-[100px] dark:bg-violet-500/15"
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute bottom-0 right-0 -z-10 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/10 blur-[90px] dark:bg-cyan-500/12"
      aria-hidden="true"
    />

    <div
      class="relative flex min-h-screen flex-col items-center justify-center gap-14 bg-white/95 px-6 py-24 dark:bg-black/95 md:gap-16 md:py-28"
    >
      <div class="w-full max-w-6xl text-center">
        <h2
          class="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-5xl font-semibold tracking-tight text-transparent dark:from-white dark:via-gray-100 dark:to-gray-400 md:text-7xl md:leading-[1.05]"
        >
          {{ t("sponsoredByMe.title") }}
        </h2>
        <p
          class="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400 md:mt-6 md:text-xl"
        >
          {{ t("sponsoredByMe.description") }}
        </p>
      </div>

      <ExpandableAppGallery v-if="sponsoredApps.length > 0" :items="sponsoredApps" />

      <p
        v-else
        class="max-w-xl text-center text-gray-500 dark:text-gray-400"
      >
        {{ t("sponsoredByMe.empty") }}
      </p>
    </div>
  </section>
</template>
