<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="space-y-4 sm:space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0"
      >
        <div>
          <h3
            class="text-xl sm:text-2xl font-bold text-white flex items-center gap-3 mb-2"
          >
            {{ project.name }}
            <a
              v-if="project.github"
              :href="project.github"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
            >
              <Icon name="mdi:github" class="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </h3>
          <p class="text-xs sm:text-sm font-medium text-gray-400">
            {{ project.tech.join(" • ") }}
          </p>
        </div>
        <span
          class="text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-300 self-start"
          :class="{
            'bg-green-500/20 text-green-300 ring-1 ring-green-500/30':
              project.status === 'Active',
            'bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30':
              project.status === 'Completed',
            'bg-gray-500/20 text-gray-300 ring-1 ring-gray-500/30':
              project.status === 'Archived',
            'bg-red-500/20 text-red-300 ring-1 ring-red-500/30':
              project.status === 'Dropped',
          }"
        >
          {{ project.status }}
        </span>
      </div>

      <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
        {{ project.description }}
      </p>

      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <span
          v-for="feature in project.features"
          :key="feature"
          class="rounded-full bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-white transition-all duration-300 hover:bg-white/20"
        >
          {{ feature }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from "~/types/career";

defineProps<{
  project: Project;
}>();
</script>
