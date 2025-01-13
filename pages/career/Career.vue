<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core";

const sectionRef = ref<HTMLElement | null>(null);

const { observeSectionChange } = useObserver("Career", sectionRef);

observeSectionChange();

type TabName = "Skills" | "Experience" | "Education" | "Projects";
const tabs = computed<TabName[]>(() => [
  "Skills",
  "Experience",
  "Education",
  "Projects",
]);
const activeTab = ref<TabName>(tabs.value[0]);
const isMobile = useMediaQuery("(max-width: 768px)");

const tabComponents = {
  Skills: defineAsyncComponent(() => import("./skills")),
  Experience: defineAsyncComponent(() => import("./experience")),
  Education: defineAsyncComponent(() => import("./education")),
  Projects: defineAsyncComponent(() => import("./projects")),
} as const;
</script>

<template>
  <section id="career" ref="sectionRef">
    <div
      class="bg-gradient-to-b from-violet-950 to-red-950 flex flex-col h-screen p-4 gap-8"
    >
      <!-- Mobile Tabs -->
      <div v-if="isMobile" class="flex justify-center items-center">
        <div class="flex gap-2 overflow-x-auto scrollbar-hide p-2">
          <Button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            class="px-4 py-2 rounded-full transition-all duration-300 whitespace-nowrap"
            :class="[
              activeTab === tab
                ? 'bg-primary text-white shadow-glow'
                : 'bg-background/50 text-muted-foreground hover:text-primary hover:bg-accent/50',
              'backdrop-blur-md border border-white/10',
            ]"
          >
            {{ tab }}
          </Button>
        </div>
      </div>

      <!-- Desktop Tabs -->
      <div v-else class="flex justify-center items-center">
        <MorphingTabs
          :tabs="tabs"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event as TabName"
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
