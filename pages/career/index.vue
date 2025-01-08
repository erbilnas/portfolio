<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@vueuse/core";
import EducationTab from "./EducationTab.vue";
import ExperienceTab from "./ExperienceTab.vue";
import ProjectsTab from "./ProjectsTab.vue";
import SkillsTab from "./SkillsTab.vue";

const sectionRef = ref<HTMLElement | null>(null);

const { updateTitle } = usePageMeta();

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      updateTitle("Career");
    }
  });
};

onMounted(() => {
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
  });

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }

  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });
});

const tabs = ["Skills", "Experience", "Education", "Projects"];
const activeTab = ref(tabs[0]);
const isMobile = useMediaQuery("(max-width: 768px)");

const nextTab = () => {
  activeTab.value = tabs[(tabs.indexOf(activeTab.value) + 1) % tabs.length];
};

const previousTab = () => {
  activeTab.value =
    tabs[(tabs.indexOf(activeTab.value) - 1 + tabs.length) % tabs.length];
};
</script>

<template>
  <section id="career" ref="sectionRef">
    <div
      class="bg-gradient-to-b from-violet-950 to-red-950 flex flex-col h-screen p-4 gap-8"
    >
      <!-- Mobile View -->
      <div v-if="isMobile" class="mb-8">
        <div
          class="flex items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl backdrop-blur-sm"
        >
          <Button
            variant="ghost"
            size="icon"
            class="rounded-full hover:bg-background/80 hover:backdrop-blur-sm disabled:opacity-50 transition-opacity"
            @click="previousTab"
          >
            <Icon name="ph:caret-left-bold" class="w-6 h-6" />
          </Button>

          <div class="flex-1 text-center">
            <h3 class="text-lg font-medium">{{ activeTab }}</h3>
          </div>

          <Button
            variant="ghost"
            size="icon"
            class="rounded-full hover:bg-background/80 hover:backdrop-blur-sm disabled:opacity-50 transition-opacity"
            @click="nextTab"
          >
            <Icon name="ph:caret-right-bold" class="w-6 h-6" />
          </Button>
        </div>
      </div>

      <!-- Desktop View -->
      <div v-else class="flex justify-center items-center">
        <MorphingTabs
          :tabs="tabs"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
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
          <div v-if="activeTab === 'Skills'" class="h-full">
            <SkillsTab :is-mobile="isMobile" />
          </div>
          <div v-else-if="activeTab === 'Experience'" class="h-full">
            <ExperienceTab />
          </div>
          <div v-else-if="activeTab === 'Education'" class="h-full">
            <EducationTab />
          </div>
          <div v-else-if="activeTab === 'Projects'" class="h-full">
            <ProjectsTab />
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>
