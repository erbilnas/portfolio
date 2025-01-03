<script setup lang="ts">
import { cn } from "@/lib/utils";
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps,
} from "radix-vue";
import { computed, type HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<
    ProgressRootProps & {
      class?: HTMLAttributes["class"];
      height?: string;
    }
  >(),
  {
    modelValue: 0,
    height: "0.25rem", // default to h-1 equivalent
  }
);

const delegatedProps = computed(() => {
  const { class: _, height: __, ...delegated } = props;
  return delegated;
});
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="
      cn(
        'relative w-full overflow-hidden rounded-full bg-secondary',
        props.class
      )
    "
    :style="{ height: props.height }"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-all"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
