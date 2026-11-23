<template>
  <div ref="timelineContainerRef" class="relative w-full font-sans md:px-6">
    <div
      v-if="title || description"
      class="mx-auto max-w-7xl px-4 py-12 lg:px-10 md:px-8"
    >
      <h2 class="mb-3 max-w-4xl text-lg text-black md:text-3xl dark:text-white">
        {{ title }}
      </h2>
      <p
        class="max-w-sm text-sm text-neutral-700 md:text-base dark:text-neutral-300"
      >
        {{ description }}
      </p>
    </div>

    <div ref="timelineRef" class="relative z-0 mx-auto max-w-7xl pb-12">
      <div
        v-for="(item, index) in props.items"
        :key="item.id + index"
        class="relative flex justify-start pt-8 md:gap-10 md:pt-12"
      >
        <div
          class="absolute left-4 top-8 z-40 flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-white md:left-9 md:top-12 dark:bg-black"
        >
          <div
            class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600"
          />
        </div>

        <div
          class="hidden w-full max-w-xs flex-row items-start self-start md:sticky md:top-32 md:flex lg:max-w-sm"
        >
          <h3
            class="pl-16 text-base font-medium leading-snug text-gray-500 md:text-lg dark:text-gray-400"
          >
            {{ item.label }}
          </h3>
        </div>

        <div class="w-full pl-12 md:pl-0">
          <slot :name="item.id"></slot>
        </div>
      </div>

      <div
        :style="{
          height: height + 'px',
        }"
        class="absolute left-4 top-0 w-px overflow-hidden bg-neutral-200 [mask-image:linear-gradient(to_bottom,transparent_0%,black_8%,black_92%,transparent_100%)] md:left-9 dark:bg-neutral-800"
      >
        <Motion
          v-if="isReady && scrollYProgress !== null"
          as="div"
          :style="{
            height: heightTransform + 'px',
            opacity: opacityTransform,
          }"
          class="absolute inset-x-0 top-0 w-px bg-gray-900 dark:bg-white"
        />
        <div
          v-else
          class="absolute inset-x-0 top-0 w-px bg-gray-900 opacity-0 dark:bg-white"
          :style="{ height: '0px' }"
        />
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

const scrollYProgress = shallowRef<
  ReturnType<typeof useScroll>["scrollYProgress"] | null
>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opacityTransformRef = shallowRef<any>(null);

const opacityTransform = ref(0);
const heightTransform = ref(0);

let animationFrameId: number | null = null;

const updateTransforms = () => {
  if (!process.client || typeof window === "undefined") {
    return;
  }

  if (!isReady.value) {
    return;
  }

  if (opacityTransformRef.value) {
    try {
      const value = unref(opacityTransformRef.value);
      if (typeof value === "number" && !isNaN(value)) {
        opacityTransform.value = value;
      } else {
        opacityTransform.value = 0;
      }
    } catch {
      opacityTransform.value = 0;
    }
  } else {
    opacityTransform.value = 0;
  }

  if (scrollYProgress.value && height.value > 0) {
    try {
      const progress = unref(scrollYProgress.value);
      if (typeof progress === "number" && !isNaN(progress)) {
        heightTransform.value = progress * height.value;
      } else {
        heightTransform.value = 0;
      }
    } catch {
      heightTransform.value = 0;
    }
  } else {
    heightTransform.value = 0;
  }

  if (isReady.value && process.client) {
    animationFrameId = requestAnimationFrame(updateTransforms);
  }
};

onMounted(async () => {
  if (!process.client || typeof window === "undefined") {
    isReady.value = true;
    return;
  }

  await nextTick();
  await nextTick();

  if (!timelineRef.value) {
    isReady.value = true;
    return;
  }

  requestAnimationFrame(async () => {
    setTimeout(async () => {
      try {
        if (
          !timelineRef.value ||
          !process.client ||
          typeof window === "undefined"
        ) {
          isReady.value = true;
          return;
        }

        if (!timelineRef.value.isConnected) {
          isReady.value = true;
          return;
        }

        const targetElement = unref(timelineRef);
        if (!targetElement) {
          isReady.value = true;
          return;
        }

        let scrollResult: ReturnType<typeof useScroll> | null = null;
        try {
          scrollResult = useScroll({
            target: targetElement,
            offset: ["start 10%", "end 50%"],
          });
        } catch (e) {
          console.error("Error initializing useScroll:", e);
          isReady.value = true;
          return;
        }

        await nextTick();

        if (scrollResult && scrollResult.scrollYProgress) {
          scrollYProgress.value = scrollResult.scrollYProgress;

          await nextTick();

          if (scrollYProgress.value) {
            try {
              opacityTransformRef.value = useTransform(
                scrollYProgress.value,
                [0, 0.1],
                [0, 1],
              );
            } catch (e) {
              console.error("Error initializing useTransform:", e);
            }
          }
        }

        await nextTick();
        const rect = timelineRef.value.getBoundingClientRect();
        height.value = rect.height;

        await nextTick();
        isReady.value = true;

        if (process.client && isReady.value) {
          animationFrameId = requestAnimationFrame(updateTransforms);
        }
      } catch (e) {
        console.error("Error initializing timeline scroll:", e);
        isReady.value = true;
      }
    }, 150);
  });
});

onBeforeUnmount(() => {
  if (animationFrameId !== null && process.client) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script>
