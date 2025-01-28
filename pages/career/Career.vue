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
      class="bg-gradient-to-b from-violet-950 to-red-950 flex flex-col h-screen py-16 gap-8"
    >
      <!-- Mobile Tabs -->
      <div v-if="isMobile" class="flex justify-center items-center">
        <div class="relative w-full max-w-sm px-4">
          <div
            class="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-3 py-2"
            @touchstart.prevent="handleTouchStart"
            @touchmove.prevent="handleTouchMove"
            @touchend.prevent="handleTouchEnd"
            @touchcancel.prevent="handleTouchEnd"
          >
            <Button
              v-for="tab in careerTabs"
              :key="tab"
              @click="activeTab = tab"
              class="snap-center min-w-[140px] flex-shrink-0 transition-all duration-300"
              :class="[
                'relative overflow-hidden rounded-xl border border-white/10',
                activeTab === tab
                  ? 'bg-gradient-to-br from-violet-500/80 to-violet-700/80 text-white shadow-glow'
                  : 'bg-background/30 text-muted-foreground hover:text-primary hover:bg-accent/20',
              ]"
            >
              <div
                class="relative z-10 px-4 py-3 flex flex-col items-center gap-1"
              >
                <span class="text-sm font-medium">{{ tab }}</span>
              </div>

              <!-- Active tab indicator -->
              <div
                v-if="activeTab === tab"
                class="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-violet-600/20 animate-pulse-subtle blur-sm"
              />
            </Button>
          </div>

          <!-- Scroll indicator -->
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            <div
              v-for="tab in careerTabs"
              :key="tab"
              class="w-1 h-1 rounded-full transition-all duration-300"
              :class="[
                activeTab === tab ? 'bg-primary w-2' : 'bg-muted-foreground/30',
              ]"
            />
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
