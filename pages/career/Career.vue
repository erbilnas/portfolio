<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";
import { useNavigation } from "~/composables/navigation";
import { careerTabs } from "~/constants/career";
import type { CareerTabs } from "~/types/career";

const sectionRef = ref<HTMLElement | null>(null);
const activeTab = ref<CareerTabs>(careerTabs[0]);

const isMobile = useMediaQuery("(max-width: 768px)");

const tabComponents = {
  Skills: defineAsyncComponent(() => import("./skills")),
  Experience: defineAsyncComponent(() => import("./experience")),
  Education: defineAsyncComponent(() => import("./education")),
  Projects: defineAsyncComponent(() => import("./projects")),
} as const;

const { observeSectionChange } = useObserver("Career", sectionRef);

observeSectionChange();

const currentTabIndex = computed(() => careerTabs.indexOf(activeTab.value));

const { handleTouchStart, handleTouchMove, handleTouchEnd } = useNavigation(
  currentTabIndex,
  careerTabs.length - 1
);

// Add watcher to sync index back to activeTab
watch(currentTabIndex, (newIndex) => {
  activeTab.value = careerTabs[newIndex];
});
</script>

<template>
  <section id="career" ref="sectionRef">
    <div
      class="bg-white dark:bg-gradient-to-b dark:from-violet-950 dark:to-red-950 flex flex-col h-screen py-16 gap-8"
    >
      <!-- Mobile Tabs -->
      <div v-if="isMobile" class="flex justify-center items-center">
        <div class="w-full max-w-sm px-4">
          <div class="flex overflow-x-auto scrollbar-hide gap-2 py-2">
            <Button
              v-for="tab in careerTabs"
              :key="tab"
              @click="activeTab = tab"
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
        <MorphingTabs
          :tabs="careerTabs"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event as CareerTabs"
        />
      </div>

      <div class="flex-1 overflow-auto scrollbar-hide">
        <Transition
          mode="out-in"
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <component
            :is="tabComponents[activeTab as keyof typeof tabComponents]"
            class="h-full"
          />
        </Transition>
      </div>
    </div>
  </section>
</template>
