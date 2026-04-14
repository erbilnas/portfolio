<script setup lang="ts">
import type { SponsoredApp } from "~/types/sponsored-app";
import { useSettings } from "~/composables/settings";

defineProps<{
  items: SponsoredApp[];
}>();

const { t } = useI18n();
const { reducedMotion } = useSettings();

const durationClass = computed(() =>
  reducedMotion.value ? "duration-0" : "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
);

const imageHoverClass = computed(() =>
  reducedMotion.value
    ? ""
    : "transition-transform duration-700 ease-out will-change-transform md:group-hover:scale-[1.05]"
);

const cardLiftClass = computed(() =>
  reducedMotion.value ? "" : "md:hover:-translate-y-2"
);

const FALLBACK_BRAND = "#6366f1";

function hexToRgb(hex: string) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) {
    return { r: 99, g: 102, b: 241 };
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

function brandBaseGradient(brand: string) {
  return {
    background: `linear-gradient(165deg, color-mix(in srgb, ${brand} 44%, rgb(15 23 42)) 0%, rgb(15 23 42) 46%, rgb(2 6 23) 100%)`,
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

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

/** Fixed-height band so every mark aligns; wide layout only widens the slot for wordmarks. */
const logoSlotInnerClass =
  "flex h-[4rem] w-full min-h-0 min-w-0 items-center justify-start md:h-[5rem]";

function logoSlotWrapClass(item: SponsoredApp) {
  if (item.logoLayout === "wide") {
    return "pointer-events-none absolute left-0 top-0 z-[1] hidden md:block w-[min(96%,17rem)] max-w-[17rem] p-3 md:w-[min(94%,20rem)] md:max-w-[20rem] md:p-4";
  }
  return "pointer-events-none absolute left-0 top-0 z-[1] hidden md:block w-[min(92%,12rem)] max-w-[12rem] p-3 md:w-[min(88%,13.5rem)] md:max-w-[13.5rem] md:p-4";
}

function logoImgClass() {
  return "max-h-full max-w-full h-auto w-auto object-contain object-left [image-rendering:auto]";
}
</script>

<template>
  <div
    v-if="items.length > 0"
    class="relative w-full max-w-6xl"
    role="list"
  >
    <!-- Ambient glow behind strip -->
    <div
      class="pointer-events-none absolute -inset-x-8 -inset-y-24 -z-10 opacity-70 blur-3xl md:-inset-x-16"
      aria-hidden="true"
    >
      <div
        class="absolute left-1/4 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-violet-500/25 dark:bg-violet-500/20"
      />
      <div
        class="absolute right-1/4 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-500/20 dark:bg-cyan-500/15"
      />
    </div>

    <div
      class="flex flex-col gap-4 md:h-[min(30rem,58vh)] md:flex-row md:gap-4"
    >
      <a
        v-for="(item, index) in items"
        :key="`${item.id}-${index}`"
        role="listitem"
        :href="item.url"
        :target="isExternalUrl(item.url) ? '_blank' : undefined"
        :rel="isExternalUrl(item.url) ? 'noopener noreferrer' : undefined"
        :style="brandVars(item)"
        :aria-label="
          t('sponsoredByMe.cardAriaLabel', {
            name: t(`sponsoredByMe.apps.${item.id}.name`),
            tagline: t(`sponsoredByMe.apps.${item.id}.tagline`),
          })
        "
        :class="[
          'sponsored-card group relative flex min-h-[13rem] min-w-0 flex-1 flex-col overflow-hidden rounded-3xl',
          'border border-white/15 bg-gray-950/40 ring-1 ring-white/[0.07]',
          'backdrop-blur-[2px]',
          'transition-[flex,transform,box-shadow] md:min-h-0 md:flex-[1] md:hover:flex-[3]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950',
          durationClass,
          cardLiftClass,
        ]"
      >
        <!-- Background: brand-tinted (contain) or image cover / placeholder -->
        <div class="absolute inset-0 z-0">
          <template v-if="item.image">
            <!-- Contain: brand atmosphere + logo top-left -->
            <template v-if="item.imageFit === 'contain'">
              <div class="absolute inset-0 overflow-hidden">
                <div
                  class="absolute inset-0"
                  :style="brandBaseGradient(item.brandColor || FALLBACK_BRAND)"
                />
                <div
                  class="absolute -left-[18%] top-[-8%] h-[62%] w-[68%] rounded-full blur-[72px] md:blur-[96px]"
                  :style="brandOrbStyle(item.brandColor || FALLBACK_BRAND, 52)"
                />
                <div
                  class="absolute -bottom-[26%] -right-[10%] h-[64%] w-[60%] rounded-full blur-[64px] md:blur-[88px]"
                  :style="brandOrbStyle(item.brandColor || FALLBACK_BRAND, 34)"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_70%_at_12%_18%,rgba(255,255,255,0.12)_0%,transparent_52%)]"
                />
                <div
                  class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/92"
                />
              </div>
              <!-- Logo: top-left (fixed-height slot for consistent alignment) -->
              <div :class="logoSlotWrapClass(item)">
                <div :class="logoSlotInnerClass">
                  <NuxtImg
                    v-if="!isSvgPath(item.image)"
                    :src="item.image"
                    :alt="t(`sponsoredByMe.apps.${item.id}.name`)"
                    format="webp"
                    :quality="95"
                    width="960"
                    :sizes="
                      item.logoLayout === 'wide'
                        ? '(max-width: 768px) 55vw, 200px'
                        : '(max-width: 768px) 38vw, 140px'
                    "
                    loading="lazy"
                    decoding="async"
                    :class="[
                      logoImgClass(),
                      '[filter:drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]',
                      imageHoverClass,
                      item.logoBlend === 'multiply' ? 'mix-blend-multiply' : '',
                    ]"
                  />
                  <img
                    v-else
                    :src="item.image"
                    :alt="t(`sponsoredByMe.apps.${item.id}.name`)"
                    :class="[
                      logoImgClass(),
                      '[filter:drop-shadow(0_10px_28px_rgba(0,0,0,0.55))]',
                      imageHoverClass,
                      item.logoBlend === 'multiply' ? 'mix-blend-multiply' : '',
                    ]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </template>
            <!-- Cover: full-bleed -->
            <template v-else>
              <NuxtImg
                v-if="!isSvgPath(item.image)"
                :src="item.image"
                :alt="t(`sponsoredByMe.apps.${item.id}.name`)"
                format="webp"
                :quality="95"
                width="960"
                sizes="sm:100vw md:40vw"
                loading="lazy"
                decoding="async"
                class="relative z-[1] h-full w-full [image-rendering:auto]"
                :class="[
                  'object-cover',
                  imageHoverClass,
                  item.logoBlend === 'multiply' ? 'mix-blend-multiply' : '',
                ]"
              />
              <img
                v-else
                :src="item.image"
                :alt="t(`sponsoredByMe.apps.${item.id}.name`)"
                class="relative z-[1] h-full w-full object-cover"
                :class="[
                  imageHoverClass,
                  item.logoBlend === 'multiply' ? 'mix-blend-multiply' : '',
                ]"
                loading="lazy"
                decoding="async"
              />
            </template>
          </template>
          <div
            v-else
            class="relative h-full w-full overflow-hidden"
          >
            <div
              class="absolute inset-0"
              :style="brandBaseGradient(item.brandColor || FALLBACK_BRAND)"
            />
            <div
              class="pointer-events-none absolute -left-[18%] top-[-8%] h-[62%] w-[68%] rounded-full blur-[72px] md:blur-[96px]"
              :style="brandOrbStyle(item.brandColor || FALLBACK_BRAND, 52)"
            />
            <div
              class="pointer-events-none absolute -bottom-[26%] -right-[10%] h-[64%] w-[60%] rounded-full blur-[64px] md:blur-[88px]"
              :style="brandOrbStyle(item.brandColor || FALLBACK_BRAND, 34)"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.08]"
            />
            <div
              class="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.08)_48%,transparent_62%)]"
            />
          </div>
        </div>

        <!-- Scrim -->
        <div
          class="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/92 via-black/35 to-black/10 md:from-black/85 md:via-black/25"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_150%_100%_at_50%_110%,rgba(0,0,0,0.65),transparent_58%)]"
          aria-hidden="true"
        />
        <div
          class="pointer-events-none absolute inset-0 z-[2] ring-1 ring-inset ring-white/[0.08]"
          aria-hidden="true"
        />

        <!-- Index badge -->
        <div
          class="absolute right-3 top-3 z-[4] flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border border-white/20 bg-black/35 px-2.5 font-mono text-[11px] font-medium tabular-nums text-white/85 shadow-lg backdrop-blur-md md:right-4 md:top-4"
          aria-hidden="true"
        >
          {{ indexLabel(index) }}
        </div>

        <!-- Content -->
        <div
          class="relative z-[3] mt-auto flex w-full flex-col gap-2 p-4 md:p-5"
        >
          <div
            class="rounded-2xl border border-white/10 bg-gradient-to-t from-black/70 via-black/35 to-black/15 p-4 shadow-inner backdrop-blur-xl md:p-5"
          >
            <h3
              class="mb-1 text-xl font-semibold tracking-tight text-white drop-shadow-sm md:text-2xl md:leading-tight"
            >
              {{ t(`sponsoredByMe.apps.${item.id}.name`) }}
            </h3>
            <div
              :class="[
                'grid transition-[grid-template-rows]',
                'grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-visible:grid-rows-[1fr]',
                durationClass,
              ]"
            >
              <p
                class="min-h-0 overflow-hidden text-sm font-light leading-relaxed text-white/85 md:text-[0.9375rem] md:leading-relaxed"
              >
                {{ t(`sponsoredByMe.apps.${item.id}.tagline`) }}
              </p>
            </div>
            <div
              class="mt-4 flex items-center border-t border-white/10 pt-3"
            >
              <span
                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-medium tracking-wide text-white/90 shadow-sm backdrop-blur-sm transition-colors duration-300 group-hover:border-white/25 group-hover:bg-white/[0.1]"
              >
                {{
                  isExternalUrl(item.url)
                    ? t("sponsoredByMe.visitExternal")
                    : t("sponsoredByMe.visitInternal")
                }}
                <span
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-white/15"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.sponsored-card {
  box-shadow:
    0 24px 48px -16px rgba(0, 0, 0, 0.5),
    0 0 60px -12px
      rgba(
        var(--brand-r, 99),
        var(--brand-g, 102),
        var(--brand-b, 241),
        0.4
      );
}
@media (min-width: 768px) {
  .sponsored-card:hover {
    box-shadow:
      0 40px 80px -20px rgba(0, 0, 0, 0.55),
      0 0 80px -8px
        rgba(
          var(--brand-r, 99),
          var(--brand-g, 102),
          var(--brand-b, 241),
          0.52
        );
  }
  :global(html.dark) .sponsored-card:hover {
    box-shadow:
      0 48px 96px -24px rgba(0, 0, 0, 0.85),
      0 0 80px -8px
        rgba(
          var(--brand-r, 99),
          var(--brand-g, 102),
          var(--brand-b, 241),
          0.52
        );
  }
}
</style>
