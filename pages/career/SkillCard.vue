<script setup lang="ts">
import type { SkillItem } from "~/types/skills";

interface Props {
  skill: SkillItem;
}

const props = defineProps<Props>();

const isLearning = computed(() => props.skill.mastery === "learning");
</script>

<template>
  <div
    class="p-3 md:p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br from-background/80 to-background hover:-translate-y-1 transition-all duration-300 group"
    :class="[
      isLearning
        ? 'border border-red-800/60 hover:shadow-red-glow'
        : 'hover:shadow-glow',
    ]"
  >
    <div class="flex items-start gap-3 md:gap-4">
      <div
        class="p-2 md:p-3 rounded-lg transition-colors"
        :class="[
          isLearning
            ? 'bg-red-800/10 text-red-800 group-hover:bg-red-800/20'
            : 'bg-primary/10 text-primary group-hover:bg-primary/20',
        ]"
      >
        <Icon
          v-if="skill.icon"
          :name="skill.icon"
          class="w-5 h-5 md:w-6 md:h-6"
        />
      </div>
      <div class="space-y-1">
        <h4
          class="font-medium transition-colors"
          :class="[
            isLearning
              ? 'group-hover:text-red-800'
              : 'group-hover:text-primary',
          ]"
        >
          {{ skill.name }}
        </h4>
        <p v-if="skill.description" class="text-sm text-muted-foreground mt-2">
          {{ skill.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow-glow {
  box-shadow: 0 8px 16px -2px rgb(var(--primary) / 0.2),
    0 2px 8px -2px rgb(var(--primary) / 0.1);
}

.shadow-red-glow {
  box-shadow: 0 8px 16px -2px rgb(153 27 27 / 0.2),
    0 2px 8px -2px rgb(153 27 27 / 0.1);
  animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-subtle {
  0%,
  100% {
    box-shadow: 0 8px 16px -2px rgb(153 27 27 / 0.2),
      0 2px 8px -2px rgb(153 27 27 / 0.1);
  }
  50% {
    box-shadow: 0 8px 20px -2px rgb(153 27 27 / 0.3),
      0 2px 12px -2px rgb(153 27 27 / 0.2);
  }
}
</style>
