<script lang="ts" setup>
import { Button } from "@/components/ui/button";
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
    <Button
      type="button"
      :variant="props.variant === 'spotlight' ? 'outline' : 'default'"
      size="lg"
      class="group gap-2 px-6 text-foreground"
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
