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

// Expose ref to parent via defineExpose
defineExpose({
  carouselRef,
});

// Watch for filtered skills changes and trigger scrollability check
watch(
  () => props.skills,
  () => {
    nextTick(() => {
      setTimeout(() => {
        props.onScrollabilityChange?.();
      }, 100);
    });
  }
);
</script>

<template>
  <div
    ref="carouselRef"
    class="flex overflow-x-auto overscroll-x-auto scroll-smooth snap-x snap-mandatory md:snap-none pb-4 scrollbar-hide"
  >
    <Transition
      mode="out-in"
      enter-active-class="transition ease-out duration-500"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div :key="activeTab" class="flex gap-6 min-w-max">
        <SkillsCard
          v-for="skill in skills"
          :key="`${skill.category}-${skill.name}`"
          :skill="skill"
        />
      </div>
    </Transition>
  </div>
</template>

