<template>
  <div
    ref="timelineContainerRef"
    class="w-full font-sans md:px-10"
  >
    <div class="mx-auto max-w-7xl px-4 py-20 lg:px-10 md:px-8">
      <h2 class="mb-4 max-w-4xl text-lg text-black md:text-4xl dark:text-white">
        {{ title }}
      </h2>
      <p
        class="max-w-sm text-sm text-neutral-700 md:text-base dark:text-neutral-300"
      >
        {{ description }}
      </p>
    </div>

    <div ref="timelineRef" class="relative z-0 mx-auto max-w-7xl pb-20">
      <div
        v-for="(item, index) in props.items"
        :key="item.id + index"
        class="relative flex justify-start pt-6 md:gap-10 md:pt-40"
      >
        <!-- Dot positioned relative to timeline line -->
        <div
          class="absolute left-4 md:left-9 top-6 md:top-40 z-40 flex size-10 items-center justify-center rounded-full bg-white dark:bg-black -translate-x-1/2"
        >
          <div
            class="size-4 rounded-full border border-neutral-300 bg-neutral-200 p-2 dark:border-neutral-700 dark:bg-neutral-800"
          />
        </div>
        <!-- Label container - hidden on mobile, visible on desktop -->
        <div
          class="hidden md:flex sticky top-40 z-40 max-w-xs items-center self-start lg:max-w-sm w-full flex-row"
        >
          <h3
            class="text-xl font-bold text-neutral-500 md:pl-20 md:text-5xl dark:text-neutral-500"
          >
            {{ item.label }}
          </h3>
        </div>
        <slot :name="item.id"></slot>
      </div>
      <div
        :style="{
          height: height + 'px',
        }"
        class="absolute left-4 md:left-9 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-0% via-neutral-200 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] dark:via-neutral-700"
      >
        <Motion
          v-if="isReady && scrollYProgress !== null"
          as="div"
          :style="{
            height: heightTransform + 'px',
            opacity: opacityTransform,
          }"
          class="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-gray-900 from-0% via-gray-600 via-10% to-transparent dark:from-white dark:via-gray-400"
        >
        </Motion>
        <div
          v-else
          :style="{
            height: '0px',
            opacity: 0,
          }"
          class="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-gray-900 from-0% via-gray-600 via-10% to-transparent dark:from-white dark:via-gray-400"
        >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Motion, useScroll, useTransform } from "motion-v";
import { unref, shallowRef, ref, computed, onMounted, nextTick } from "vue";
import type { HTMLAttributes } from "vue";

interface Props {
  containerClass?: HTMLAttributes["class"];
  class?: HTMLAttributes["class"];
  items?: {
    id: string;
    label: string;
  }[];
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});

const timelineContainerRef = ref<HTMLElement | null>(null);
const timelineRef = ref<HTMLElement | null>(null);
const height = ref(0);
const isReady = ref(false);

// Use shallowRef to store composable results and defer initialization
const scrollYProgress = shallowRef<ReturnType<typeof useScroll>['scrollYProgress'] | null>(null);
const opacityTransformRef = shallowRef<ReturnType<typeof useTransform> | null>(null);

const opacityTransform = computed(() => {
  // Guard against SSR and accessing before initialization
  if (process.server || typeof window === 'undefined') return 0;
  if (!isReady.value || !opacityTransformRef.value) return 0;
  try {
    const transformRef = opacityTransformRef.value;
    if (!transformRef) return 0;
    const value = unref(transformRef);
    if (typeof value !== 'number' || isNaN(value)) return 0;
    return value;
  } catch (e) {
    // Guard against $r initialization errors
    return 0;
  }
});

const heightTransform = computed(() => {
  // Guard against SSR and accessing before initialization
  if (process.server || typeof window === 'undefined') return 0;
  if (!isReady.value || height.value === 0 || !scrollYProgress.value) return 0;
  try {
    const progressRef = scrollYProgress.value;
    if (!progressRef) return 0;
    // Use unref to safely access the value
    const progress = unref(progressRef);
    if (typeof progress !== 'number' || isNaN(progress)) return 0;
    // Map progress from [0, 1] to [0, height.value]
    return progress * height.value;
  } catch (e) {
    // Guard against $r initialization errors
    return 0;
  }
});

onMounted(async () => {
  // Only initialize on client side
  if (process.server || typeof window === 'undefined') {
    isReady.value = true;
    return;
  }
  
  // Wait for multiple ticks to ensure Vue's reactivity system is fully initialized
  await nextTick();
  await nextTick();
  
  if (!timelineRef.value) {
    isReady.value = true;
    return;
  }
  
  // Use requestAnimationFrame to ensure DOM is fully rendered
  requestAnimationFrame(async () => {
    // Use setTimeout to defer initialization even further, ensuring Vue is fully ready
    setTimeout(async () => {
      try {
        // Double-check ref is still available and we're on client
        if (!timelineRef.value || process.server || typeof window === 'undefined') {
          isReady.value = true;
          return;
        }
        
        // Ensure the element is actually in the DOM
        if (!timelineRef.value.isConnected) {
          isReady.value = true;
          return;
        }
        
        // Initialize motion-v composables after mount to ensure refs are available
        // This prevents the $r initialization error by deferring reactive setup
        // Pass the ref itself - motion-v handles ref unwrapping internally
        const scrollResult = useScroll({
          target: timelineRef,
          offset: ["start 10%", "end 50%"],
        });
        
        // Wait a tick before storing to ensure reactivity is set up
        await nextTick();
        
        // Store references to the reactive values only after they're initialized
        if (scrollResult && scrollResult.scrollYProgress) {
          scrollYProgress.value = scrollResult.scrollYProgress;
          
          // Wait another tick before initializing transform
          await nextTick();
          
          // Initialize transform after scroll is set up
          if (scrollYProgress.value) {
            opacityTransformRef.value = useTransform(scrollResult.scrollYProgress, [0, 0.1], [0, 1]);
          }
        }
        
        // Calculate height after a brief delay to ensure layout is stable
        await nextTick();
        const rect = timelineRef.value.getBoundingClientRect();
        height.value = rect.height;
        
        // Set ready flag after everything is initialized
        await nextTick();
        isReady.value = true;
      } catch (e) {
        console.error('Error initializing timeline scroll:', e);
        // Set ready anyway to prevent UI blocking
        isReady.value = true;
      }
    }, 150); // Small delay to ensure Vue reactivity is fully initialized
  });
});
</script>
