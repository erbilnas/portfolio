<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { Primitive, type PrimitiveProps } from "radix-vue";
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { type ButtonVariants, buttonVariants } from ".";

defineOptions({ inheritAttrs: false });

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  class?: HTMLAttributes["class"];
  /** Force liquid glass on/off. Default: on for solid variants, off for ghost/link. */
  glass?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
  // Keep absent `glass` as undefined (Vue Boolean props otherwise cast to false).
  glass: undefined,
});

const attrs = useAttrs();

const shouldUseGlass = computed(() => {
  if (props.glass === false) return false;
  if (props.glass === true) return true;
  const variant = props.variant ?? "default";
  return variant !== "ghost" && variant !== "link";
});

const radiusBySize: Record<NonNullable<ButtonVariants["size"]>, number> = {
  default: 12,
  sm: 10,
  lg: 14,
  icon: 999,
};

const glassRadius = computed(
  () => radiusBySize[props.size ?? "default"] ?? 12,
);

const resolvedVariant = computed(() => props.variant ?? "default");
const resolvedSize = computed(() => props.size ?? "default");
const isIconGlass = computed(
  () => shouldUseGlass.value && resolvedSize.value === "icon",
);

const glassRadiusClass = computed(() => {
  if (!shouldUseGlass.value) return "";
  if (resolvedSize.value === "icon") return "rounded-full";
  if (resolvedSize.value === "sm") return "rounded-[10px]";
  if (resolvedSize.value === "lg") return "rounded-[14px]";
  return "rounded-[12px]";
});

const primitiveClass = computed(() =>
  cn(
    buttonVariants({ variant: props.variant, size: props.size }),
    shouldUseGlass.value &&
      cn(
        "border-0 bg-transparent shadow-none text-foreground",
        "transition-[background-color,opacity] duration-150 ease-out",
        glassRadiusClass.value,
        // Icon circles: quiet opacity shift (no square wash inside the glass).
        isIconGlass.value
          ? "hover:bg-transparent hover:opacity-75"
          : "hover:bg-neutral-950/[0.06] hover:text-foreground dark:hover:bg-white/[0.1]",
      ),
    shouldUseGlass.value &&
      resolvedVariant.value === "destructive" &&
      "text-destructive hover:bg-destructive/10 hover:text-destructive",
    isIconGlass.value && "rounded-full",
    props.class,
  ),
);
</script>

<template>
  <LiquidGlass
    v-if="shouldUseGlass"
    layout="inline"
    :radius="glassRadius"
    :frost="0.14"
    :border="0.04"
    :blur="8"
    :scale="-120"
    :container-class="
      cn('inline-flex align-middle', isIconGlass && 'rounded-full')
    "
    :class="cn('inline-flex', isIconGlass && 'rounded-full')"
  >
    <Primitive
      v-bind="attrs"
      :as="as"
      :as-child="asChild"
      :class="primitiveClass"
    >
      <slot />
    </Primitive>
  </LiquidGlass>

  <Primitive
    v-else
    v-bind="attrs"
    :as="as"
    :as-child="asChild"
    :class="primitiveClass"
  >
    <slot />
  </Primitive>
</template>
