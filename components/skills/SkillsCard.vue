<script setup lang="ts">
import type { SkillWithCategory } from "~/composables/skills";

interface Props {
  skill: SkillWithCategory;
}

defineProps<Props>();
</script>

<template>
  <article
    class="flex w-[260px] shrink-0 snap-start flex-col gap-3 border-l border-neutral-200/70 pl-5 dark:border-white/10 md:w-[280px] md:pl-6"
  >
    <div class="flex items-center gap-2.5">
      <Icon
        v-if="skill.icon"
        :name="skill.icon"
        class="size-5 shrink-0 text-neutral-950 dark:text-white"
        aria-hidden="true"
      />
      <h3
        class="min-w-0 truncate text-[15px] font-semibold tracking-tight text-neutral-950 dark:text-white"
      >
        {{ skill.name }}
      </h3>
    </div>
    <p
      class="text-pretty text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400"
    >
      {{ skill.description }}
    </p>
  </article>
</template>
