<script setup lang="ts">
import SkillsCarouselNavigation from "~/components/skills/SkillsCarouselNavigation.vue";
import { useSettings } from "~/composables/settings";
import type { SponsoredApp } from "~/types/sponsored-app";

const props = defineProps<{
  items: SponsoredApp[];
}>();

const { t, te } = useI18n();
const { reducedMotion } = useSettings();

const activeId = ref(props.items[0]?.id ?? "");
const railRef = ref<HTMLDivElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

watch(
  () => props.items,
  (items) => {
    if (!items.length) {
      activeId.value = "";
      return;
    }
    if (!items.some((item) => item.id === activeId.value)) {
      activeId.value = items[0].id;
    }
    nextTick(checkRailScrollability);
  },
  { deep: true },
);

const featured = computed(
  () => props.items.find((item) => item.id === activeId.value) ?? props.items[0],
);

const FALLBACK_BRAND = "#737373";
const RAIL_SCROLL_STEP = 320;

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) {
    return { r: 115, g: 115, b: 115 };
  }
  return {
    r: Number.parseInt(m[1], 16),
    g: Number.parseInt(m[2], 16),
    b: Number.parseInt(m[3], 16),
  };
}

function brandVars(item: SponsoredApp) {
  const hex = item.brandColor || FALLBACK_BRAND;
  const { r, g, b } = hexToRgb(hex);
  return {
    "--brand": hex,
    "--brand-r": String(r),
    "--brand-g": String(g),
    "--brand-b": String(b),
  };
}

function brandOrbStyle(brand: string, strength: number) {
  return {
    backgroundColor: `color-mix(in srgb, ${brand} ${strength}%, transparent)`,
  };
}

function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

function isSvgPath(src: string) {
  return /\.svg(\?|#|$)/i.test(src);
}

function checkRailScrollability() {
  const el = railRef.value;
  if (!el) {
    canScrollLeft.value = false;
    canScrollRight.value = false;
    return;
  }
  const threshold = 1;
  canScrollLeft.value = el.scrollLeft > threshold;
  canScrollRight.value =
    el.scrollLeft < el.scrollWidth - el.clientWidth - threshold;
}

function scrollRail(direction: -1 | 1) {
  railRef.value?.scrollBy({
    left: direction * RAIL_SCROLL_STEP,
    behavior: reducedMotion.value ? "auto" : "smooth",
  });
}

function scrollRailItemIntoView(id: string) {
  const rail = railRef.value;
  const target = document.getElementById(`sponsored-rail-${id}`);
  if (!rail || !target) {
    return;
  }
  const railRect = rail.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const overflowLeft = targetRect.left - railRect.left;
  const overflowRight = targetRect.right - railRect.right;
  if (overflowLeft < 0) {
    rail.scrollBy({
      left: overflowLeft - 8,
      behavior: reducedMotion.value ? "auto" : "smooth",
    });
  } else if (overflowRight > 0) {
    rail.scrollBy({
      left: overflowRight + 8,
      behavior: reducedMotion.value ? "auto" : "smooth",
    });
  }
}

function caseLine(id: string, key: "problem" | "stack" | "outcome") {
  const path = `projects.apps.${id}.${key}`;
  return te(path) ? t(path) : "";
}

function selectApp(id: string) {
  activeId.value = id;
  nextTick(() => scrollRailItemIntoView(id));
}

function onRailKeydown(event: KeyboardEvent) {
  const ids = props.items.map((item) => item.id);
  const index = ids.indexOf(activeId.value);
  if (index < 0) {
    return;
  }

  type RailNavKey =
    | "ArrowRight"
    | "ArrowDown"
    | "ArrowLeft"
    | "ArrowUp"
    | "Home"
    | "End";

  const navKeys: ReadonlySet<string> = new Set([
    "ArrowRight",
    "ArrowDown",
    "ArrowLeft",
    "ArrowUp",
    "Home",
    "End",
  ]);
  if (!navKeys.has(event.key)) {
    return;
  }

  const key = event.key as RailNavKey;
  let next: number;

  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (index + 1) % ids.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (index - 1 + ids.length) % ids.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = ids.length - 1;
      break;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }

  event.preventDefault();
  selectApp(ids[next]);
  document.getElementById(`sponsored-rail-${ids[next]}`)?.focus();
}

const stageTransitionClass = computed(() =>
  reducedMotion.value
    ? ""
    : "transition-[background-color,box-shadow] duration-500 ease-out",
);

onMounted(() => {
  nextTick(checkRailScrollability);
  window.addEventListener("resize", checkRailScrollability);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkRailScrollability);
});
</script>

<template>
  <div
    v-if="items.length > 0 && featured"
    class="flex w-full max-w-6xl flex-col gap-8 md:gap-10"
  >
    <!-- Featured stage -->
    <article
      :style="brandVars(featured)"
      :class="[
        'sponsored-stage relative overflow-hidden rounded-3xl',
        'border border-neutral-200/80 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950',
        stageTransitionClass,
      ]"
      :aria-labelledby="`sponsored-featured-title-${featured.id}`"
    >
      <div class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div class="brand-fill absolute inset-0" />
        <div
          class="absolute -left-[12%] top-[-20%] h-[70%] w-[55%] rounded-full blur-[90px] md:blur-[110px]"
          :style="brandOrbStyle(featured.brandColor || FALLBACK_BRAND, 48)"
        />
        <div
          class="absolute -bottom-[30%] -right-[8%] h-[65%] w-[50%] rounded-full blur-[80px] md:blur-[100px]"
          :style="brandOrbStyle(featured.brandColor || FALLBACK_BRAND, 28)"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white dark:via-black/25 dark:to-black/80"
        />
      </div>

      <div
        class="relative z-[1] flex min-h-[22rem] flex-col justify-between gap-10 p-8 sm:min-h-[24rem] sm:p-10 md:min-h-[26rem] md:flex-row md:items-end md:gap-14 md:p-12"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-8">
          <div
            :class="[
              'flex items-center',
              featured.logoLayout === 'wide'
                ? 'h-16 max-w-[16rem] md:h-20 md:max-w-[20rem]'
                : 'h-16 max-w-[11rem] md:h-20 md:max-w-[13rem]',
            ]"
          >
            <template v-if="featured.image">
              <NuxtImg
                v-if="!isSvgPath(featured.image)"
                :src="featured.image"
                :alt="t(`projects.apps.${featured.id}.name`)"
                format="webp"
                :quality="95"
                width="960"
                :sizes="
                  featured.logoLayout === 'wide'
                    ? '(max-width: 768px) 55vw, 220px'
                    : '(max-width: 768px) 40vw, 160px'
                "
                loading="eager"
                decoding="async"
                class="max-h-full max-w-full object-contain object-left [filter:drop-shadow(0_8px_24px_rgba(0,0,0,0.35))] dark:[filter:drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]"
                :class="
                  featured.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''
                "
              />
              <img
                v-else
                :src="featured.image"
                :alt="t(`projects.apps.${featured.id}.name`)"
                class="max-h-full max-w-full object-contain object-left [filter:drop-shadow(0_8px_24px_rgba(0,0,0,0.35))] dark:[filter:drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]"
                :class="
                  featured.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''
                "
                loading="eager"
                decoding="async"
              />
            </template>
          </div>

          <div class="max-w-xl" aria-live="polite">
            <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3
                :id="`sponsored-featured-title-${featured.id}`"
                class="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-4xl"
              >
                {{ t(`projects.apps.${featured.id}.name`) }}
              </h3>
              <span
                class="text-sm tabular-nums text-neutral-500 dark:text-neutral-300"
              >
                {{ featured.year }}
              </span>
            </div>
            <p
              class="mt-4 text-base font-light leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-lg"
            >
              {{ t(`projects.apps.${featured.id}.tagline`) }}
            </p>
            <dl
              v-if="
                caseLine(featured.id, 'problem') ||
                caseLine(featured.id, 'stack') ||
                caseLine(featured.id, 'outcome')
              "
              class="mt-6 flex max-w-xl flex-col gap-3"
            >
              <div
                v-if="caseLine(featured.id, 'problem')"
                class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
              >
                {{ caseLine(featured.id, "problem") }}
              </div>
              <div
                v-if="caseLine(featured.id, 'stack')"
                class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
              >
                {{ caseLine(featured.id, "stack") }}
              </div>
              <div
                v-if="caseLine(featured.id, 'outcome')"
                class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300"
              >
                {{ caseLine(featured.id, "outcome") }}
              </div>
            </dl>
          </div>
        </div>

        <div class="shrink-0">
          <a
            :href="featured.url"
            :target="isExternalUrl(featured.url) ? '_blank' : undefined"
            :rel="
              isExternalUrl(featured.url) ? 'noopener noreferrer' : undefined
            "
            class="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-neutral-950"
          >
            {{
              isExternalUrl(featured.url)
                ? t("projects.visitExternal")
                : t("projects.visitInternal")
            }}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>

    <!-- App rail slider -->
    <div class="w-full">
      <SkillsCarouselNavigation
        :can-scroll-left="canScrollLeft"
        :can-scroll-right="canScrollRight"
        @scroll-left="scrollRail(-1)"
        @scroll-right="scrollRail(1)"
      />

      <div
        ref="railRef"
        role="radiogroup"
        :aria-label="t('projects.title')"
        class="flex gap-3 overflow-x-auto overscroll-x-contain scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        @scroll="checkRailScrollability"
        @keydown="onRailKeydown"
      >
        <button
          v-for="item in items"
          :id="`sponsored-rail-${item.id}`"
          :key="item.id"
          type="button"
          role="radio"
          :aria-checked="item.id === activeId"
          :tabindex="item.id === activeId ? 0 : -1"
          :aria-label="
            t('projects.cardAriaLabel', {
              name: t(`projects.apps.${item.id}.name`),
              tagline: t(`projects.apps.${item.id}.tagline`),
            })
          "
          :style="brandVars(item)"
          :class="[
            'group relative flex w-[9.5rem] shrink-0 flex-col gap-3 rounded-2xl border px-4 py-4 text-left',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black',
            item.id === activeId
              ? 'border-neutral-900 bg-neutral-100 dark:border-white dark:bg-neutral-900'
              : 'border-neutral-200 bg-transparent text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:bg-white/[0.03]',
            reducedMotion ? '' : 'transition-colors duration-300',
          ]"
          @click="selectApp(item.id)"
        >
          <div class="flex h-10 items-center">
            <NuxtImg
              v-if="item.image && !isSvgPath(item.image)"
              :src="item.image"
              :alt="t(`projects.apps.${item.id}.name`)"
              format="webp"
              :quality="90"
              width="160"
              sizes="40px"
              loading="lazy"
              decoding="async"
              class="max-h-9 max-w-[7rem] object-contain object-left opacity-90"
              :class="item.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''"
            />
            <img
              v-else-if="item.image"
              :src="item.image"
              :alt="t(`projects.apps.${item.id}.name`)"
              class="max-h-9 max-w-[7rem] object-contain object-left opacity-90"
              :class="item.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''"
              loading="lazy"
              decoding="async"
            />
            <span
              v-else
              class="h-2.5 w-2.5 rounded-full"
              :style="{ backgroundColor: item.brandColor || FALLBACK_BRAND }"
              aria-hidden="true"
            />
          </div>
          <div class="min-w-0">
            <p
              :class="[
                'truncate text-sm tracking-tight',
                item.id === activeId
                  ? 'font-semibold text-neutral-950 dark:text-white'
                  : 'font-medium text-neutral-700 dark:text-neutral-300',
              ]"
            >
              {{ t(`projects.apps.${item.id}.name`) }}
            </p>
            <p
              class="mt-0.5 text-xs tabular-nums text-neutral-500 dark:text-neutral-400"
            >
              {{ item.year }}
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand-fill {
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--brand, #737373) 28%, rgb(250 250 250)) 0%,
    rgb(250 250 250) 55%,
    rgb(250 250 250) 100%
  );
}

:global(html.dark) .brand-fill {
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--brand, #737373) 34%, rgb(10 10 10)) 0%,
    rgb(10 10 10) 58%,
    rgb(10 10 10) 100%
  );
}

.sponsored-stage {
  box-shadow:
    0 12px 28px -18px rgba(0, 0, 0, 0.22),
    0 2px 8px -4px
      rgba(var(--brand-r, 115), var(--brand-g, 115), var(--brand-b, 115), 0.18);
}

:global(html.dark) .sponsored-stage {
  box-shadow:
    0 16px 36px -20px rgba(0, 0, 0, 0.75),
    0 2px 10px -4px
      rgba(var(--brand-r, 115), var(--brand-g, 115), var(--brand-b, 115), 0.28);
}
</style>
