<template>
  <div class="flex justify-center gap-2">
    <Button
      variant="ghost"
      size="icon"
      class="p-3 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 hover:scale-110 transition-all duration-300 text-white/80 hover:text-white border border-white/10 hover:border-white/20 shadow-lg hidden md:flex items-center justify-center"
      @click="emit('prev')"
    >
      <Icon name="ph:arrow-left-bold" />
    </Button>

    <div class="flex items-center gap-2">
      <Button
        v-for="(_, index) in totalCards"
        :key="index"
        variant="ghost"
        size="icon"
        class="rounded-full w-3 h-3"
        :class="index === currentIndex ? 'bg-primary' : 'bg-white'"
        @click="emit('navigate', index)"
      />
    </div>

    <Button
      variant="ghost"
      size="icon"
      class="p-3 rounded-full bg-black/30 backdrop-blur-md hover:bg-black/50 hover:scale-110 transition-all duration-300 text-white/80 hover:text-white border border-white/10 hover:border-white/20 shadow-lg hidden md:flex items-center justify-center"
      @click="emit('next')"
    >
      <Icon name="ph:arrow-right-bold" />
    </Button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentIndex: number;
  totalCards: number;
}>();

const emit = defineEmits<{
  (e: "prev"): void;
  (e: "next"): void;
  (e: "navigate", index: number): void;
}>();
</script>
