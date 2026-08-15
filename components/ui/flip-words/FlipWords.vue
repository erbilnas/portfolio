<template>
  <div class="relative inline-block px-2">
    <span
      :class="[
        'inline-block text-left',
        props.class,
        motionAllowed ? 'transition-opacity duration-200 ease-out' : '',
        fading ? 'opacity-0' : 'opacity-100',
      ]"
    >
      {{ currentWord }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useSettings } from "~/composables/settings";

interface Props {
  words: string[];
  duration?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  class: "",
});

defineEmits(["animationStart", "animationComplete"]);

const { reducedMotion } = useSettings();
const prefersReduced = ref(false);

const motionAllowed = computed(
  () => !reducedMotion.value && !prefersReduced.value,
);

const currentWord = ref(props.words?.[0] || "");
const fading = ref(false);
const timeoutId = ref<number | null>(null);
const fadeId = ref<number | null>(null);

function clearTimers() {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
  if (fadeId.value) {
    clearTimeout(fadeId.value);
    fadeId.value = null;
  }
}

function nextWord() {
  const list = props.words;
  if (!list?.length) return;
  const currentIndex = list.indexOf(currentWord.value);
  currentWord.value = list[currentIndex + 1] || list[0];
}

function startAnimation() {
  if (!motionAllowed.value || !props.words || props.words.length < 2) return;

  fading.value = true;
  fadeId.value = window.setTimeout(() => {
    nextWord();
    fading.value = false;
    startTimeout();
  }, 200);
}

function startTimeout() {
  clearTimers();
  if (!motionAllowed.value) return;
  timeoutId.value = window.setTimeout(() => {
    startAnimation();
  }, props.duration);
}

onMounted(() => {
  if (typeof window !== "undefined" && window.matchMedia) {
    prefersReduced.value = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }
  startTimeout();
});

onBeforeUnmount(() => {
  clearTimers();
});

watch(motionAllowed, (allowed) => {
  if (!allowed) {
    clearTimers();
    fading.value = false;
    return;
  }
  startTimeout();
});

watch(
  () => props.words,
  (newWords) => {
    if (newWords && newWords.length > 0 && !currentWord.value) {
      currentWord.value = newWords[0];
    }
  },
  { immediate: true },
);
</script>
