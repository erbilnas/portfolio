<template>
  <div
    v-if="props.tabs.length"
    ref="containerRef"
    :class="cn('relative inline-flex items-center gap-1 rounded-lg bg-background/50 p-1', props.class)"
  >
    <div
      class="absolute inset-y-1 left-1 rounded-md bg-primary transition-all duration-300 ease-out"
      :style="indicatorStyle"
    />
    <button
      v-for="(tab, index) in props.tabs"
      :key="tab"
      :ref="(el) => setTabRef(el, index)"
      :class="
        cn(
          'relative z-10 px-4 py-2 text-sm font-medium transition-all duration-300 rounded-md whitespace-nowrap',
          activeTab === tab
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )
      "
      @click="handleTabClick(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, onUnmounted, onBeforeUnmount } from "vue";
import { cn } from "@/lib/utils";

interface Props {
  tabs: string[];
  activeTab: string;
  class?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: string): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const tabRefs = ref<(HTMLElement | null)[]>([]);
const indicatorStyle = ref<{ width: string; transform: string }>({
  width: "0px",
  transform: "translateX(0px)",
});

let resizeObserver: ResizeObserver | null = null;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

const setTabRef = (el: Element | null, index: number) => {
  if (el && el instanceof HTMLElement) {
    tabRefs.value[index] = el;
  } else {
    tabRefs.value[index] = null;
  }
};

const updateIndicator = () => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  updateTimeout = setTimeout(() => {
    const activeIndex = props.tabs.indexOf(props.activeTab);
    const activeTabElement = tabRefs.value[activeIndex];
    const container = containerRef.value;

    if (!activeTabElement || !container) {
      // Retry after a short delay if elements aren't ready
      requestAnimationFrame(() => {
        updateIndicator();
      });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeTabRect = activeTabElement.getBoundingClientRect();

    // Account for padding (p-1 = 4px)
    const padding = 4;
    const left = activeTabRect.left - containerRect.left - padding;
    const width = activeTabRect.width;

    indicatorStyle.value = {
      width: `${width}px`,
      transform: `translateX(${left}px)`,
    };
  }, 10);
};

const handleTabClick = (tab: string) => {
  emit("update:activeTab", tab);
};

watch(
  () => props.activeTab,
  () => {
    nextTick(() => {
      updateIndicator();
    });
  },
  { immediate: true }
);

watch(
  () => props.tabs,
  () => {
    nextTick(() => {
      updateIndicator();
    });
  },
  { deep: true }
);

onMounted(() => {
  nextTick(() => {
    updateIndicator();

    // Use ResizeObserver for better performance
    if (containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateIndicator();
      });
      resizeObserver.observe(containerRef.value);
    }

    // Fallback to window resize
    window.addEventListener("resize", updateIndicator);
  });
});

onBeforeUnmount(() => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  window.removeEventListener("resize", updateIndicator);
});
</script>

