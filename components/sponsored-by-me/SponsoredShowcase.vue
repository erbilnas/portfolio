<script setup lang="ts">
import SkillsCarouselNavigation from "~/components/skills/SkillsCarouselNavigation.vue";
import { Button } from "~/components/ui/button";
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
const motionAllowed = computed(() => !reducedMotion.value);

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
  if (id === activeId.value) return;
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
    class="flex w-full max-w-6xl flex-col gap-6 md:gap-8"
  >
    <!-- Featured stage -->
    <article
      :style="brandVars(featured)"
      :class="[
        'sponsored-stage relative overflow-hidden rounded-3xl',
        'border border-neutral-200/60 bg-white dark:border-white/10 dark:bg-neutral-950',
        stageTransitionClass,
      ]"
      :aria-labelledby="`sponsored-featured-title-${featured.id}`"
    >
      <div class="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div class="brand-fill absolute inset-0" />
        <div
          class="absolute -left-[12%] top-[-20%] h-[70%] w-[55%] rounded-full blur-[90px] md:blur-[110px]"
          :class="
            motionAllowed
              ? 'transition-[background-color] duration-500 ease-out'
              : ''
          "
          :style="brandOrbStyle(featured.brandColor || FALLBACK_BRAND, 42)"
        />
        <div
          class="absolute -bottom-[30%] -right-[8%] h-[65%] w-[50%] rounded-full blur-[80px] md:blur-[100px]"
          :class="
            motionAllowed
              ? 'transition-[background-color] duration-500 ease-out'
              : ''
          "
          :style="brandOrbStyle(featured.brandColor || FALLBACK_BRAND, 22)"
        />
        <div
          class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white dark:via-black/25 dark:to-black/80"
        />
      </div>

      <div class="relative z-[1] p-8 sm:p-10 md:p-12">
        <Transition
          mode="out-in"
          :enter-active-class="
            motionAllowed
              ? 'transition duration-[250ms] ease-[cubic-bezier(0.32,0.72,0,1)]'
              : ''
          "
          :enter-from-class="motionAllowed ? 'translate-y-1' : ''"
          :enter-to-class="motionAllowed ? 'translate-y-0' : ''"
          :leave-active-class="
            motionAllowed
              ? 'transition duration-150 ease-[cubic-bezier(0.32,0.72,0,1)]'
              : ''
          "
          :leave-from-class="motionAllowed ? 'translate-y-0' : ''"
          :leave-to-class="motionAllowed ? 'translate-y-1' : ''"
        >
          <div
            :key="featured.id"
            class="flex w-full max-w-2xl flex-col gap-8"
            aria-live="polite"
          >
            <div
              :class="[
                'flex items-center',
                featured.logoLayout === 'wide'
                  ? 'h-14 max-w-[14rem] md:h-16 md:max-w-[18rem]'
                  : 'h-14 max-w-[10rem] md:h-16 md:max-w-[12rem]',
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
                      ? '(max-width: 768px) 55vw, 200px'
                      : '(max-width: 768px) 40vw, 140px'
                  "
                  loading="eager"
                  decoding="async"
                  class="max-h-full max-w-full object-contain object-left"
                  :class="
                    featured.logoBlend === 'multiply'
                      ? 'mix-blend-multiply'
                      : ''
                  "
                />
                <img
                  v-else
                  :src="featured.image"
                  :alt="t(`projects.apps.${featured.id}.name`)"
                  class="max-h-full max-w-full object-contain object-left"
                  :class="
                    featured.logoBlend === 'multiply'
                      ? 'mix-blend-multiply'
                      : ''
                  "
                  loading="eager"
                  decoding="async"
                />
              </template>
            </div>

            <div>
              <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3
                  :id="`sponsored-featured-title-${featured.id}`"
                  class="text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white md:text-4xl"
                >
                  {{ t(`projects.apps.${featured.id}.name`) }}
                </h3>
                <span
                  class="text-sm tabular-nums text-neutral-500 dark:text-neutral-400"
                >
                  {{ featured.year }}
                </span>
              </div>
              <p
                class="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-lg"
              >
                {{ t(`projects.apps.${featured.id}.tagline`) }}
              </p>
              <dl
                v-if="
                  caseLine(featured.id, 'problem') ||
                  caseLine(featured.id, 'stack') ||
                  caseLine(featured.id, 'outcome')
                "
                class="mt-5 flex flex-col gap-2.5"
              >
                <div
                  v-if="caseLine(featured.id, 'problem')"
                  class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                >
                  {{ caseLine(featured.id, "problem") }}
                </div>
                <div
                  v-if="caseLine(featured.id, 'stack')"
                  class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                >
                  {{ caseLine(featured.id, "stack") }}
                </div>
                <div
                  v-if="caseLine(featured.id, 'outcome')"
                  class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
                >
                  {{ caseLine(featured.id, "outcome") }}
                </div>
              </dl>

              <div class="mt-7">
                <Button
                  as="a"
                  :href="featured.url"
                  :target="isExternalUrl(featured.url) ? '_blank' : undefined"
                  :rel="
                    isExternalUrl(featured.url)
                      ? 'noopener noreferrer'
                      : undefined
                  "
                  class="gap-2"
                >
                  {{
                    isExternalUrl(featured.url)
                      ? t("projects.visitExternal")
                      : t("projects.visitInternal")
                  }}
                  <span aria-hidden="true">↗</span>
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </article>

    <!-- App rail -->
    <div
      class="flex w-full max-w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
    >
      <div
        ref="railRef"
        role="radiogroup"
        :aria-label="t('projects.title')"
        class="w-full min-w-0 max-w-full flex-1 touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth pb-1 scrollbar-hide snap-x snap-mandatory md:snap-none [-webkit-overflow-scrolling:touch]"
        @scroll="checkRailScrollability"
        @keydown="onRailKeydown"
      >
        <div class="flex w-max min-w-full gap-1 md:gap-1.5">
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
              'group relative flex w-[9.75rem] shrink-0 snap-start flex-col gap-2.5 rounded-2xl px-3.5 py-3.5 text-left sm:w-[11rem]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black',
              item.id === activeId
                ? 'bg-neutral-950/[0.06] dark:bg-white/[0.08]'
                : 'hover:bg-neutral-950/[0.03] dark:hover:bg-white/[0.04]',
              motionAllowed
                ? 'transition-[background-color,color] duration-150 ease-out'
                : '',
            ]"
            @click="selectApp(item.id)"
          >
            <div class="flex h-9 items-center">
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
                class="max-h-8 max-w-[7.5rem] object-contain object-left opacity-90"
                :class="
                  item.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''
                "
              />
              <img
                v-else-if="item.image"
                :src="item.image"
                :alt="t(`projects.apps.${item.id}.name`)"
                class="max-h-8 max-w-[7.5rem] object-contain object-left opacity-90"
                :class="
                  item.logoBlend === 'multiply' ? 'mix-blend-multiply' : ''
                "
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
                  'truncate text-[13px] tracking-tight',
                  item.id === activeId
                    ? 'font-semibold text-neutral-950 dark:text-white'
                    : 'font-medium text-neutral-600 dark:text-neutral-300',
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

      <SkillsCarouselNavigation
        :can-scroll-left="canScrollLeft"
        :can-scroll-right="canScrollRight"
        @scroll-left="scrollRail(-1)"
        @scroll-right="scrollRail(1)"
      />
    </div>
  </div>
</template>

<style scoped>
.brand-fill {
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--brand, #737373) 22%, rgb(255 255 255)) 0%,
    rgb(255 255 255) 58%,
    rgb(255 255 255) 100%
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
    0 8px 20px -16px rgba(0, 0, 0, 0.18),
    0 1px 3px -1px
      rgba(var(--brand-r, 115), var(--brand-g, 115), var(--brand-b, 115), 0.12);
}

:global(html.dark) .sponsored-stage {
  box-shadow:
    0 12px 28px -18px rgba(0, 0, 0, 0.7),
    0 1px 4px -1px
      rgba(var(--brand-r, 115), var(--brand-g, 115), var(--brand-b, 115), 0.22);
}
</style>
