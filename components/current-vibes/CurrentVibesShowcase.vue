<script setup lang="ts">
import CurrentVibesStage from "~/components/current-vibes/CurrentVibesStage.vue";
import { useCardsMetadata } from "~/composables/current-vibes";
import type { CardData } from "~/composables/current-vibes/current-vibes-data";
import { useVibeQuery } from "~/composables/current-vibes/vibe-query";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  cards: CardData[];
}>();

const { t } = useI18n();
const { reducedMotion } = useSettings();
const { getCardMetadata } = useCardsMetadata();
const { vibe, setVibe } = useVibeQuery();

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
    if (vibe.value && cards.some((card) => card.type === vibe.value)) {
      activeType.value = vibe.value;
      return;
    }
    if (!cards.some((card) => card.type === activeType.value)) {
      activeType.value = cards[0].type;
    }
  },
  { deep: true, immediate: true },
);

watch(vibe, (next) => {
  if (!next) {
    return;
  }
  if (props.cards.some((card) => card.type === next)) {
    activeType.value = next;
  }
});

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
  if (vibe.value !== type) {
    setVibe(type);
  }
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
  selectType(types[next]);
  document.getElementById(`vibes-tab-${types[next]}`)?.focus();
}

let resizeObserver: ResizeObserver | null = null;

watch(activeType, async () => {
  await nextTick();
  measureIndicator();
  const active = activeType.value
    ? tabRefs.value[activeType.value]
    : null;
  const list = tablistRef.value;
  if (!active || !list) {
    return;
  }
  // Scroll the tab strip only — element.scrollIntoView also moves the document.
  const left =
    active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  list.scrollTo({
    left: Math.max(0, left),
    behavior: reducedMotion.value ? "instant" : "smooth",
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
    class="flex w-full max-w-7xl flex-col gap-10 md:gap-16"
  >
    <div class="flex w-full flex-col">
      <div
        ref="tablistRef"
        role="tablist"
        :aria-label="t('currentVibes.railAriaLabel')"
        class="relative isolate flex w-full snap-x snap-mandatory gap-0 overflow-x-auto border-b border-neutral-200 dark:border-white/15 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-1 [&::-webkit-scrollbar]:hidden"
        @keydown="onTabsKeydown"
      >
        <!-- Sliding ink rule under the active category -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute bottom-0 z-0 h-0.5 bg-neutral-950 dark:bg-white"
          :class="
            reducedMotion || !indicator.ready
              ? ''
              : 'transition-[transform,width] duration-200 ease-out'
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
            'relative z-10 flex shrink-0 snap-start items-baseline gap-2 px-3 pb-3 pt-1 first:pl-0 last:pr-0 md:gap-2.5 md:px-3.5 md:pb-3.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black',
            item.card.type === activeType
              ? 'text-neutral-950 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100',
            reducedMotion ? '' : 'transition-colors duration-150 ease-out',
          ]"
          @click="selectType(item.card.type)"
        >
          <span
            class="text-[11px] tabular-nums leading-none md:text-xs"
            :class="
              item.card.type === activeType
                ? 'text-neutral-500 dark:text-neutral-400'
                : 'text-neutral-400 dark:text-neutral-500'
            "
            aria-hidden="true"
          >
            {{ String(item.index + 1).padStart(2, "0") }}
          </span>
          <span
            class="text-sm leading-none md:text-[15px]"
            :class="
              item.card.type === activeType ? 'font-semibold' : 'font-medium'
            "
          >
            {{ t(`currentVibes.tabs.${item.card.type}`) }}
          </span>
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
