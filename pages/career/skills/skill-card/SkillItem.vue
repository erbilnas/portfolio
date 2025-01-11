<script lang="ts" setup>
import type { Skill } from "~/types/skills";

defineProps<{
  skill: Skill;
}>();
</script>

<template>
  <div
    class="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-[1.02]"
    :class="[
      'bg-slate-900/50 hover:bg-violet-500/10',
      'border border-slate-800/50 hover:border-violet-500/50',
      'hover:shadow-lg hover:-translate-y-0.5',
    ]"
  >
    <div
      class="p-2 sm:p-2.5 rounded-lg sm:rounded-xl shrink-0 shadow-inner transition-colors"
      :class="[
        'bg-primary/5 text-primary-foreground',
        'group-hover:bg-primary/10',
      ]"
    >
      <Icon :name="skill.icon" class="w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div class="flex flex-col min-w-0">
      <span
        class="text-sm sm:text-base font-medium truncate transition-colors"
        :class="['text-gray-300', 'group-hover:text-violet-400']"
      >
        {{ skill.name }}
      </span>
      <span v-if="skill.description" class="text-xs text-gray-500 truncate">
        {{ skill.description }}
      </span>
    </div>
  </div>
</template>
