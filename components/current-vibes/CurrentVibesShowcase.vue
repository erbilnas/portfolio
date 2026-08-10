<script setup lang="ts">
import CurrentVibesStage from "~/components/current-vibes/CurrentVibesStage.vue";
import { useCardsMetadata } from "~/composables/current-vibes";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  cards: CardData[];
}>();

const { t } = useI18n();
const { reducedMotion } = useSettings();
const { getCardMetadata } = useCardsMetadata();

const activeType = ref<CardData["type"] | "">(props.cards[0]?.type ?? "");
const tablistRef = ref<HTMLElement | null>(null);
const tabRefs = ref<Record<string, HTMLElement | null>>({});

const indicator = ref({ left: 0, width: 0, ready: false });

watch(
  () => props.cards,
  (cards) => {
    if (!cards.length) {
      activeType.value = "";
      return;
    }
    if (!cards.some((card) => card.type === activeType.value)) {
      activeType.value = cards[0].type;
    }
  },
  { deep: true },
);

const featuredIndex = computed(() =>
  props.cards.findIndex((card) => card.type === activeType.value),
);

const featured = computed(() => {
  const index = featuredIndex.value;
  if (index < 0) {
    return props.cards[0] ?? null;
  }
  return props.cards[index] ?? null;
});

const featuredMetadata = computed(() => {
  if (!featured.value) {
    return null;
  }
  const index = Math.max(featuredIndex.value, 0);
  return getCardMetadata(featured.value, index);
});

const tabItems = computed(() =>
  props.cards.map((card, index) => ({
    card,
    index,
    metadata: getCardMetadata(card, index),
  })),
);

function setTabRef(type: string, el: Element | null) {
  tabRefs.value[type] = el as HTMLElement | null;
}

function measureIndicator() {
  const list = tablistRef.value;
  const active = activeType.value
    ? tabRefs.value[activeType.value]
    : null;
  if (!list || !active) {
    indicator.value = { left: 0, width: 0, ready: false };
    return;
  }
  const listRect = list.getBoundingClientRect();
  const tabRect = active.getBoundingClientRect();
  indicator.value = {
    left: tabRect.left - listRect.left + list.scrollLeft,
    width: tabRect.width,
    ready: true,
  };
}

function selectType(type: CardData["type"]) {
  activeType.value = type;
}

function onTabsKeydown(event: KeyboardEvent) {
  const types = props.cards.map((card) => card.type);
  const index = types.indexOf(activeType.value as CardData["type"]);
  if (index < 0) {
    return;
  }

  type TabNavKey =
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

  const key = event.key as TabNavKey;
  let next: number;

  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      next = (index + 1) % types.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      next = (index - 1 + types.length) % types.length;
      break;
    case "Home":
      next = 0;
      break;
    case "End":
      next = types.length - 1;
      break;
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }

  event.preventDefault();
  activeType.value = types[next];
  document.getElementById(`vibes-tab-${types[next]}`)?.focus();
}

let resizeObserver: ResizeObserver | null = null;

watch(activeType, async () => {
  await nextTick();
  measureIndicator();
  const active = activeType.value
    ? tabRefs.value[activeType.value]
    : null;
  active?.scrollIntoView({
    block: "nearest",
    inline: "center",
    behavior: reducedMotion.value ? "auto" : "smooth",
  });
});

watch(tabItems, async () => {
  await nextTick();
  measureIndicator();
});

onMounted(async () => {
  await nextTick();
  measureIndicator();
  if (tablistRef.value) {
    resizeObserver = new ResizeObserver(() => measureIndicator());
    resizeObserver.observe(tablistRef.value);
  }
  window.addEventListener("resize", measureIndicator);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
  window.removeEventListener("resize", measureIndicator);
});
</script>

<template>
  <div
    v-if="cards.length > 0 && featured && featuredMetadata"
    class="flex w-full max-w-7xl flex-col gap-8 md:gap-12"
  >
    <div class="flex w-full flex-col">
      <div
        ref="tablistRef"
        role="tablist"
        :aria-label="t('currentVibes.railAriaLabel')"
        class="relative isolate flex w-full gap-1 overflow-x-auto rounded-2xl bg-black/[0.04] p-1 dark:bg-white/[0.06] [-ms-overflow-style:none] [scrollbar-width:none] md:w-fit md:max-w-full [&::-webkit-scrollbar]:hidden"
        @keydown="onTabsKeydown"
      >
        <!-- Sliding active plate -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute top-1 z-0 h-[calc(100%-0.5rem)] rounded-xl bg-white outline outline-1 outline-black/5 dark:bg-white/[0.12] dark:outline-white/10"
          :class="
            reducedMotion || !indicator.ready
              ? ''
              : 'transition-[transform,width] duration-300 ease-out'
          "
          :style="{
            width: `${indicator.width}px`,
            transform: `translate3d(${indicator.left}px, 0, 0)`,
            opacity: indicator.ready ? 1 : 0,
          }"
        />

        <button
          v-for="item in tabItems"
          :id="`vibes-tab-${item.card.type}`"
          :key="item.card.type"
          :ref="(el) => setTabRef(item.card.type, el as Element | null)"
          type="button"
          role="tab"
          :aria-selected="item.card.type === activeType"
          :tabindex="item.card.type === activeType ? 0 : -1"
          :aria-controls="`vibes-panel-${item.card.type}`"
          :aria-label="
            t('currentVibes.cardAriaLabel', {
              category: t(`currentVibes.tabs.${item.card.type}`),
              title: item.metadata.title,
            })
          "
          :class="[
            'relative z-10 shrink-0 rounded-xl px-3.5 py-2 text-sm tracking-tight md:px-4 md:py-2.5 md:text-base',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black',
            'active:scale-[0.96]',
            item.card.type === activeType
              ? 'font-semibold text-neutral-950 dark:text-white'
              : 'font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100',
            reducedMotion
              ? ''
              : 'transition-[color,transform] duration-200 ease-out',
          ]"
          @click="selectType(item.card.type)"
        >
          {{ t(`currentVibes.tabs.${item.card.type}`) }}
        </button>
      </div>
    </div>

    <Transition
      mode="out-in"
      :enter-active-class="
        reducedMotion ? '' : 'transition duration-300 ease-out'
      "
      :enter-from-class="reducedMotion ? '' : 'opacity-0 translate-y-2'"
      :enter-to-class="reducedMotion ? '' : 'opacity-100 translate-y-0'"
      :leave-active-class="
        reducedMotion ? '' : 'transition duration-200 ease-in'
      "
      :leave-from-class="reducedMotion ? '' : 'opacity-100 translate-y-0'"
      :leave-to-class="reducedMotion ? '' : 'opacity-0 -translate-y-1'"
    >
      <CurrentVibesStage
        :id="`vibes-panel-${featured.type}`"
        :key="featured.type"
        role="tabpanel"
        :card="featured"
        :metadata="featuredMetadata"
      />
    </Transition>
  </div>
</template>
