<script setup lang="ts">
import { useNavigation } from "#build/imports";
import { ref } from "vue";
import { skillCategories } from "~/constants/career";
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
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
    >
      <CommonNavigation
        :index="{ current: currentIndex, max: maxIndex }"
        :navigation="{
          previous: goToPrevious,
          next: goToNext,
        }"
        :items="skillCategories"
      />

      <CardContainer>
        <TransitionGroup name="card">
          <div
            v-for="(category, index) in skillCategories"
            :key="category.name"
            v-show="index === currentIndex"
            class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm shadow-2xl transition-all duration-500 border border-slate-800/50 hover:border-violet-500/30 animate-card-move [&.card-enter-active]:animate-card-enter [&.card-leave-active]:animate-card-leave [&.card-leave-active]:absolute [&.card-leave-active]:w-full"
          >
            <SkillCard :category />
          </div>
        </TransitionGroup>
      </CardContainer>
    </div>
  </div>
</template>
