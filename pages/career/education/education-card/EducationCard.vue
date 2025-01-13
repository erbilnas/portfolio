<script setup lang="ts">
interface Education {
  school: string;
  degree: string;
  year: string;
  description: string;
  achievements: string[];
}

defineProps<{
  education: Education;
}>();
</script>

<template>
  <div class="p-4 sm:p-8">
    <div class="space-y-4 sm:space-y-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
      >
        <div>
          <h3
            class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            {{ education.school }}
          </h3>
          <p class="text-sm sm:text-base text-gray-400 mt-1">
            {{ education.degree }}
          </p>
        </div>
        <div
          class="self-start sm:self-auto px-3 sm:px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 backdrop-blur-md"
        >
          <span
            class="text-xs sm:text-sm font-medium text-white whitespace-nowrap"
          >
            {{ education.year }}
          </span>
        </div>
      </div>

      <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
        {{ education.description }}
      </p>

      <div class="flex flex-wrap gap-1.5 sm:gap-2">
        <span
          v-for="achievement in education.achievements"
          :key="achievement"
          class="rounded-full bg-white/5 border border-white/10 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors duration-200"
        >
          {{ achievement }}
        </span>
      </div>
    </div>
  </div>
</template>
