<template>
  <div ref="timelineContainerRef" class="relative w-full font-sans md:px-10">
    <div
      v-if="title || description"
      class="mx-auto max-w-7xl px-4 py-20 lg:px-10 md:px-8"
    >
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
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Motion, useScroll, useTransform } from "motion-v";
import type { HTMLAttributes } from "vue";
import {
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  unref,
} from "vue";

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
const scrollYProgress = shallowRef<
  ReturnType<typeof useScroll>["scrollYProgress"] | null
>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opacityTransformRef = shallowRef<any>(null);

// Use regular refs instead of computed to avoid $r initialization errors
const opacityTransform = ref(0);
const heightTransform = ref(0);

// Animation frame ID for manual updates (safer than watchEffect in production)
let animationFrameId: number | null = null;

// Manual update function to avoid $r errors in production
// Uses requestAnimationFrame instead of watchEffect to prevent SSR/hydration issues
const updateTransforms = () => {
  if (!process.client || typeof window === "undefined") {
    return;
  }

  if (!isReady.value) {
    return;
  }

  // Update opacity transform
  if (opacityTransformRef.value) {
    try {
      const value = unref(opacityTransformRef.value);
      if (typeof value === "number" && !isNaN(value)) {
        opacityTransform.value = value;
      } else {
        opacityTransform.value = 0;
      }
    } catch (e) {
      opacityTransform.value = 0;
    }
  } else {
    opacityTransform.value = 0;
  }

  // Update height transform
  if (scrollYProgress.value && height.value > 0) {
    try {
      const progress = unref(scrollYProgress.value);
      if (typeof progress === "number" && !isNaN(progress)) {
        heightTransform.value = progress * height.value;
      } else {
        heightTransform.value = 0;
      }
    } catch (e) {
      heightTransform.value = 0;
    }
  } else {
    heightTransform.value = 0;
  }

  // Continue animation loop
  if (isReady.value && process.client) {
    animationFrameId = requestAnimationFrame(updateTransforms);
  }
};

onMounted(async () => {
  // Only initialize on client side - use process.client for explicit check
  if (!process.client || typeof window === "undefined") {
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
        if (
          !timelineRef.value ||
          !process.client ||
          typeof window === "undefined"
        ) {
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
        // Ensure ref is unwrapped before passing to motion-v
        const targetElement = unref(timelineRef);
        if (!targetElement) {
          isReady.value = true;
          return;
        }

        // Wrap in try-catch to handle any initialization errors gracefully
        let scrollResult: ReturnType<typeof useScroll> | null = null;
        try {
          // Pass unwrapped element directly to avoid $r initialization issues
          scrollResult = useScroll({
            target: targetElement,
            offset: ["start 10%", "end 50%"],
          });
        } catch (e) {
          console.error("Error initializing useScroll:", e);
          isReady.value = true;
          return;
        }

        // Wait a tick before storing to ensure reactivity is set up
        await nextTick();

        // Store references to the reactive values only after they're initialized
        if (scrollResult && scrollResult.scrollYProgress) {
          scrollYProgress.value = scrollResult.scrollYProgress;

          // Wait another tick before initializing transform
          await nextTick();

          // Initialize transform after scroll is set up
          // Use the stored scrollYProgress.value instead of scrollResult directly
          // to avoid accessing $r before initialization
          if (scrollYProgress.value) {
            try {
              opacityTransformRef.value = useTransform(
                scrollYProgress.value,
                [0, 0.1],
                [0, 1]
              );
            } catch (e) {
              console.error("Error initializing useTransform:", e);
              // Continue without transform - component will still work
            }
          }
        }

        // Calculate height after a brief delay to ensure layout is stable
        await nextTick();
        const rect = timelineRef.value.getBoundingClientRect();
        height.value = rect.height;

        // Set ready flag after everything is initialized
        await nextTick();
        isReady.value = true;

        // Start the animation loop only after everything is ready
        // This prevents $r errors by ensuring we only access reactive refs after initialization
        if (process.client && isReady.value) {
          animationFrameId = requestAnimationFrame(updateTransforms);
        }
      } catch (e) {
        console.error("Error initializing timeline scroll:", e);
        // Set ready anyway to prevent UI blocking
        isReady.value = true;
      }
    }, 150); // Small delay to ensure Vue reactivity is fully initialized
  });
});

onBeforeUnmount(() => {
  // Clean up animation frame
  if (animationFrameId !== null && process.client) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script>
