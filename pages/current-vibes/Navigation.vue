<script setup lang="ts">
defineProps<{
  currentIndex: number;
  totalCards: number;
}>();

const emit = defineEmits<{
  (e: "previous"): void;
  (e: "next"): void;
}>();
</script>

<template>
  <!-- Navigation buttons at sides - visible on desktop -->
  <div
    class="flex justify-center gap-4"
    role="navigation"
    aria-label="Experience navigation"
  >
    <Button
      variant="ghost"
      size="icon"
      class="rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 border border-slate-800/50 hover:border-violet-500/50"
      @click="emit('previous')"
      aria-label="Previous experience"
    >
      <Icon
        name="ph:arrow-left-bold"
        class="text-slate-400 group-hover:text-violet-400 transition-colors"
      />
    </Button>

    <!-- Progress indicator at bottom -->
    <div class="flex justify-center items-center gap-2" role="tablist">
      <button
        v-for="index in totalCards"
        :key="index - 1"
        :aria-selected="index - 1 === currentIndex"
        :aria-label="'View experience ' + index"
        role="tab"
      >
        <div
          class="w-6 h-1 sm:h-1.5 rounded-full transition-all duration-300 focus:outline-none group-hover:scale-110"
          :class="[
            index - 1 === currentIndex
              ? 'bg-gradient-to-r from-violet-500 to-violet-700 scale-110'
              : 'bg-violet-100 scale-100 group-hover:bg-slate-600/50',
          ]"
        />
        <div
          v-if="index - 1 === currentIndex"
          class="blur-lg bg-violet-500/20 rounded-full"
        />
      </button>
    </div>

    <Button
      variant="ghost"
      size="icon"
      class="rounded-full bg-slate-950/30 backdrop-blur-md hover:bg-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-all duration-300 border border-slate-800/50 hover:border-violet-500/50"
      @click="emit('next')"
      aria-label="Next experience"
    >
      <Icon
        name="ph:arrow-right-bold"
        class="text-slate-400 group-hover:text-violet-400 transition-colors"
      />
    </Button>
  </div>
</template>
