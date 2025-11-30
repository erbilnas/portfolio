<template>
  <div
    :class="
      cn(
        'row-span-1 rounded-2xl group/bento hover:shadow-lg transition-all duration-300 p-6 dark:bg-gray-900 dark:border-gray-800 bg-white border border-gray-100 justify-between flex flex-col space-y-3',
        props.class,
      )
    "
  >
    <slot name="header" />
    <div class="transition-all duration-300 group-hover/bento:translate-y-[-2px]">
      <slot name="icon" />
      <div class="my-2 font-semibold text-lg text-gray-900 dark:text-gray-100 tracking-tight">
        <slot name="title" />
      </div>
      <div class="font-light text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        <slot name="description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>
