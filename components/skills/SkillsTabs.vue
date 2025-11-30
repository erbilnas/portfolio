<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { TabGroup } from "~/components/ui/tab-group";
import { useMediaQuery } from "~/composables/use-media-query-client";

interface Props {
  tabs: string[];
  activeTab: string;
}

interface Emits {
  (e: "update:activeTab", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isMobile = useMediaQuery("(max-width: 768px)");

const updateActiveTab = (tab: string) => {
  emit("update:activeTab", tab);
};
</script>

<template>
  <!-- Mobile Tabs -->
  <div v-if="isMobile" class="flex justify-center items-center w-full">
    <div class="w-full max-w-2xl px-4">
      <div class="flex overflow-x-auto scrollbar-hide gap-2 py-2">
        <Button
          v-for="tab in tabs"
          :key="tab"
          @click="updateActiveTab(tab)"
          :class="[
            activeTab === tab
              ? 'bg-primary text-primary-foreground'
              : 'bg-background/30 text-muted-foreground hover:text-primary',
          ]"
        >
          {{ tab }}
        </Button>
      </div>
    </div>
  </div>

  <!-- Desktop Tabs -->
  <div v-else class="flex justify-center items-center">
    <TabGroup
      :tabs="tabs"
      :active-tab="activeTab"
      @update:active-tab="updateActiveTab"
    />
  </div>
</template>

