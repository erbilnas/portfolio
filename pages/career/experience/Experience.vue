<script setup lang="ts">
import { useNavigation } from "#build/imports";
import { ref } from "vue";
import { experiences } from "~/constants/career";
import ExperienceCard from "./experience-card";

const currentIndex = ref(0);
const maxIndex = experiences.length - 1;

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
      <CommonNavigation
        :index="{ current: currentIndex, max: maxIndex }"
        :navigation="{
          previous: goToPrevious,
          next: goToNext,
        }"
        :items="experiences"
      />

      <CardContainer>
        <TransitionGroup name="card">
          <div
            v-for="(experience, index) in experiences"
            :key="experience.company"
            v-show="index === currentIndex"
            class="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm shadow-2xl transition-all duration-500 border border-slate-800/50 hover:border-violet-500/30 animate-card-move [&.card-enter-active]:animate-card-enter [&.card-leave-active]:animate-card-leave [&.card-leave-active]:absolute [&.card-leave-active]:w-full"
          >
            <ExperienceCard
              :key="experience.company"
              :experience="experience"
            />
          </div>
        </TransitionGroup>
      </CardContainer>
    </div>
  </div>
</template>
