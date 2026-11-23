<script setup lang="ts">
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import type { ExperienceTabKey } from "~/types/experience";

interface TabOption {
  key: ExperienceTabKey;
  label: string;
}

interface Props {
  tabs: TabOption[];
  activeKey: ExperienceTabKey;
}

interface Emits {
  (e: "update:activeKey", value: ExperienceTabKey): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <LiquidGlass
    layout="inline"
    :radius="18"
    :frost="0.12"
    :border="0.04"
    :blur="8"
    :scale="-120"
    container-class="max-w-full"
    class="max-w-full"
  >
    <div
      class="inline-flex max-w-full items-center gap-0.5 overflow-x-auto p-1.5 scrollbar-hide"
      role="tablist"
      :aria-label="$t('experience.title')"
    >
      <button
        v-for="tab in tabs"
        :id="`experience-tab-${tab.key}`"
        :key="tab.key"
        type="button"
        role="tab"
        :aria-selected="activeKey === tab.key"
        :aria-controls="`experience-panel-${tab.key}`"
        class="shrink-0 rounded-[12px] px-3.5 py-2 text-[13px] transition-[background-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-500 dark:focus-visible:ring-offset-black md:px-4"
        :class="
          activeKey === tab.key
            ? 'bg-neutral-950/[0.08] font-medium text-neutral-950 dark:bg-white/[0.12] dark:text-white'
            : 'font-normal text-neutral-500 hover:bg-neutral-950/[0.04] hover:text-neutral-800 dark:text-neutral-400 dark:hover:bg-white/[0.06] dark:hover:text-neutral-100'
        "
        @click="emit('update:activeKey', tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
  </LiquidGlass>
</template>
