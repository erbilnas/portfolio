<template>
  <div>
    <div
      class="relative mx-auto max-w-screen-lg px-3 sm:px-4 md:px-8 lg:px-16 overflow-hidden"
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
        :items="projectsList"
      />

      <CardContainer>
        <TransitionGroup name="card">
          <div
            v-for="(project, index) in projectsList"
            :key="project.name"
            v-show="index === currentIndex"
            class="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-950 to-slate-900 backdrop-blur-sm shadow-2xl transition-all duration-500 border border-slate-800/50 hover:border-violet-500/30 animate-card-move [&.card-enter-active]:animate-card-enter [&.card-leave-active]:animate-card-leave [&.card-leave-active]:absolute [&.card-leave-active]:w-full"
          >
            <ProjectCard :project="project" />
          </div>
        </TransitionGroup>
      </CardContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { projectsList } from "~/constants/career";
import ProjectCard from "./project-card";

const currentIndex = ref(0);
const maxIndex = projectsList.length - 1;

const {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  goToPrevious,
  goToNext,
} = useNavigation(currentIndex, maxIndex);
</script>
