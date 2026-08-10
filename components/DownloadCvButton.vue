<script lang="ts" setup>
import { useResumeDrawer } from "~/composables/use-resume-drawer";

const props = withDefaults(
  defineProps<{
    variant?: "default" | "spotlight";
  }>(),
  {
    variant: "default",
  },
);

const { openResumeDrawer } = useResumeDrawer();
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <ShimmerButton
      v-if="props.variant === 'default'"
      @click="openResumeDrawer"
    >
      <Icon name="ph:read-cv-logo" :size="20" />
      {{ $t("common.showResume") }}
    </ShimmerButton>
    <Button
      v-else
      type="button"
      variant="outline"
      size="lg"
      class="group gap-2 border-foreground/25 bg-foreground/[0.03] text-foreground shadow-none transition-colors duration-150 ease-out hover:border-foreground/40 hover:bg-foreground/10 hover:text-foreground dark:border-foreground/35 dark:hover:border-foreground/55"
      @click="openResumeDrawer"
    >
      <Icon
        name="ph:read-cv-logo"
        :size="20"
        class="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
      />
      {{ $t("common.showResume") }}
    </Button>
  </div>
</template>
