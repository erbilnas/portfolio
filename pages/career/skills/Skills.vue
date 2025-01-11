<script setup lang="ts">
import { useNavigation } from "#build/imports";
import { ref } from "vue";
import { skillCategories } from "~/constants/skills";
import NavigationButtons from "../NavigationButtons.vue";
import SwipeIndicator from "../SwipeIndicator.vue";
import SkillCard from "./skill-card";

const currentIndex = ref(0);
const maxIndex = skillCategories.length - 1;

const {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  goToPrevious,
  goToNext,
} = useNavigation(currentIndex, maxIndex);
</script>

<template>
  <div>
    <div
      class="relative mx-auto max-w-screen-lg px-4 sm:px-8 md:px-16 overflow-hidden"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <CardContainer>
        <TransitionGroup name="card">
          <div
            v-for="(category, index) in skillCategories"
            :key="category.name"
            v-show="index === currentIndex"
            class="group relative overflow-hidden rounded bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm shadow-2xl transition-all duration-500 border border-slate-800/50 hover:border-violet-500/30"
          >
            <SkillCard :category />
          </div>
        </TransitionGroup>
      </CardContainer>

      <NavigationButtons
        :index="{ current: currentIndex, max: maxIndex }"
        :navigation="{
          previous: goToPrevious,
          next: goToNext,
        }"
      />
    </div>

    <SwipeIndicator
      :index="{ current: currentIndex, max: maxIndex }"
      :data="skillCategories"
    />
  </div>
</template>

<style scoped>
.card-move {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-enter-active,
.card-leave-active {
  transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.card-enter-from {
  opacity: 0;
  transform: perspective(2000px) translateX(100px) translateY(10px)
    translateZ(-100px) rotateY(-20deg) scale(0.8);
  filter: blur(4px);
}

.card-leave-to {
  opacity: 0;
  transform: perspective(2000px) translateX(-100px) translateY(10px)
    translateZ(-100px) rotateY(20deg) scale(0.8);
  filter: blur(4px);
}

.card-leave-active {
  position: absolute;
  width: 100%;
}
</style>
