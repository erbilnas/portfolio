<script lang="ts" setup>
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import NumberFlow from "@number-flow/vue";
import { onMounted, onUnmounted, ref } from "vue";

interface Props {
  /** Accessible name for the progresschip. */
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Progress",
});

const { t } = useI18n();

const scrollPercentage = ref(0);

const percentValue = computed(() =>
  Math.min(1, Math.max(0, scrollPercentage.value)),
);

const percentDisplay = computed(() => Math.round(percentValue.value * 100));

const circumference = 2 * Math.PI * 10;
const dashOffset = computed(
  () => circumference * (1 - percentValue.value),
);

function updatePageScroll() {
  const height = document.body.scrollHeight - window.innerHeight;
  scrollPercentage.value = height > 0 ? window.scrollY / height : 0;
}

onMounted(() => {
  window.addEventListener("scroll", updatePageScroll, { passive: true });
  updatePageScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updatePageScroll);
});
</script>

<template>
  <LiquidGlass
    layout="fixed"
    :radius="20"
    :frost="0.12"
    :border="0.04"
    :blur="8"
    :scale="-120"
    container-class="fixed left-1/2 top-[max(0.75rem,env(safe-area-inset-top))] z-[999] -translate-x-1/2"
    class="max-w-[calc(100vw-2rem)]"
  >
    <div
      class="flex h-10 items-center gap-2.5 px-3.5 text-neutral-950 dark:text-white"
      role="progressbar"
      :aria-label="title || t('common.scrollToSeeMore')"
      :aria-valuenow="percentDisplay"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <svg
        class="size-5 shrink-0 -rotate-90"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          class="opacity-20"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          class="transition-[stroke-dashoffset] duration-150 ease-out"
        />
      </svg>

      <NumberFlow
        :value="percentValue"
        :format="{ style: 'percent', maximumFractionDigits: 0 }"
        locales="en-US"
        class="min-w-[2.75ch] text-[13px] font-medium tabular-nums tracking-tight"
      />
    </div>
  </LiquidGlass>
</template>
