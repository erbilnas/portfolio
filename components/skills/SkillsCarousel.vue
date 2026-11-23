<script setup lang="ts">
import { watch, nextTick } from "vue";
import SkillsCard from "./SkillsCard.vue";
import type { SkillWithCategory } from "~/composables/skills";

interface Props {
  skills: SkillWithCategory[];
  activeTab: string;
  onScrollabilityChange?: () => void;
}

const props = defineProps<Props>();
const carouselRef = ref<HTMLDivElement | null>(null);

defineExpose({
  carouselRef,
});

watch(
  () => props.skills,
  () => {
    nextTick(() => {
      setTimeout(() => {
        props.onScrollabilityChange?.();
      }, 100);
    });
  },
);
</script>

<template>
  <div
    :id="`skills-panel-${activeTab}`"
    ref="carouselRef"
    role="tabpanel"
    :aria-labelledby="`skills-tab-${activeTab}`"
    class="flex overflow-x-auto overscroll-x-auto scroll-smooth pb-1 scrollbar-hide snap-x snap-mandatory md:snap-none"
  >
    <div :key="activeTab" class="flex min-w-max gap-4 md:gap-5">
      <SkillsCard
        v-for="skill in skills"
        :key="`${skill.category}-${skill.name}`"
        :skill="skill"
      />
    </div>
  </div>
</template>
