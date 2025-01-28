<template>
  <div
    v-if="props.tabs.length"
    :class="cn('relative', props.class)"
    style="filter: url('#exclusionTabsGoo')"
  >
    <button
      v-for="tab in props.tabs"
      :key="tab"
      :class="
        cn(
          'px-4 py-2 transition-all duration-500 relative',
          activeTab === tab
            ? 'text-white bg-primary shadow-glow'
            : 'text-muted-foreground bg-background hover:text-primary hover:bg-accent'
        )
      "
      :style="{
        margin: `0 ${activeTab === tab ? props.margin : 0}px`,
      }"
      @click="emit('update:activeTab', tab)"
    >
      {{ tab }}
      <div
        v-if="activeTab === tab"
        class="absolute inset-0 -z-10 animate-pulse-subtle bg-primary/50 blur-md"
      />
    </button>

    <div class="absolute w-full">
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter
            id="exclusionTabsGoo"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            color-interpolation-filters="sRGB"
          >
            <feGaussianBlur
              in="SourceGraphic"
              :stdDeviation="blurStdDeviation"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 36 -12"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";

interface Props {
  tabs: string[];
  activeTab: string;
  margin?: number;
  class?: string;
  blurStdDeviation?: number;
}

const props = withDefaults(defineProps<Props>(), {
  margin: 20,
  blurStdDeviation: 6,
});

const emit = defineEmits<{
  (e: "update:activeTab", tab: string): void;
}>();
</script>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 20px theme("colors.primary.DEFAULT / 30%");
}

@keyframes pulse-subtle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
