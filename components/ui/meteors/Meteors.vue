<template>
  <span
    v-for="index in count"
    :key="'meteor ' + index"
    :class="
      cn(
        'animate-meteor absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]',
        `before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-[#64748b] before:to-transparent`,
        $props.class
      )
    "
    :style="getMeteorStyle(index)"
  ></span>
</template>

<script lang="ts" setup>
import { cn } from "~/lib/utils";

const props = defineProps({
  count: {
    type: Number,
    default: 20,
  },
  class: String,
});

// Seeded random number generator with fixed precision
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return Number((x - Math.floor(x)).toFixed(4));
};

const getMeteorStyle = (index: number) => {
  // Use index as seed for consistent random values
  const leftPosition = Math.floor(seededRandom(index) * (400 - -400) + -400);
  const animationDelay = Number(
    (seededRandom(index + 1) * (0.8 - 0.2) + 0.2).toFixed(4)
  );
  const animationDuration = Math.floor(seededRandom(index + 2) * (10 - 2) + 2);

  return {
    top: 0,
    left: `${leftPosition}px`,
    animationDelay: `${animationDelay}s`,
    animationDuration: `${animationDuration}s`,
  };
};
</script>

<style scoped>
@keyframes meteor {
  0% {
    transform: rotate(215deg) translateX(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: rotate(215deg) translateX(-500px);
    opacity: 0;
  }
}

.animate-meteor {
  animation: meteor 5s linear infinite;
}
</style>
