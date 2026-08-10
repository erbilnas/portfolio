<template>
  <div class="relative inline-block px-2">
    <div
      :class="[
        'relative z-10 inline-block text-left',
        props.class,
      ]"
    >
      <template v-if="motionAllowed">
        <Transition
          @after-enter="$emit('animationStart')"
          @after-leave="$emit('animationComplete')"
        >
          <div v-show="isVisible" class="inline-block">
            <template
              v-for="(wordObj, wordIndex) in splitWords"
              :key="wordObj.word + wordIndex"
            >
              <span
                class="flip-words__word inline-block whitespace-nowrap"
                :style="{
                  animation: `fadeInWord 0.3s ease forwards`,
                  animationDelay: `${wordIndex * 0.3}s`,
                }"
              >
                <span
                  v-for="(letter, letterIndex) in wordObj.letters"
                  :key="wordObj.word + letterIndex"
                  class="flip-words__letter inline-block"
                  :style="{
                    animation: `fadeInLetter 0.2s ease forwards`,
                    animationDelay: `${wordIndex * 0.3 + letterIndex * 0.05}s`,
                  }"
                >
                  {{ letter }}
                </span>
                <span class="inline-block">&nbsp;</span>
              </span>
            </template>
          </div>
        </Transition>
      </template>
      <span v-else class="inline-block">{{ currentWord }}</span>
    </div>
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
const isVisible = ref(true);
const timeoutId = ref<number | null>(null);

function startAnimation() {
  if (!motionAllowed.value || !props.words || props.words.length === 0) return;

  isVisible.value = false;

  setTimeout(() => {
    const currentIndex = props.words.indexOf(currentWord.value);
    const nextWord = props.words[currentIndex + 1] || props.words[0];
    currentWord.value = nextWord || "";
    isVisible.value = true;
  }, 600);
}

const splitWords = computed(() => {
  if (!currentWord.value || typeof currentWord.value !== "string") {
    return [];
  }
  return currentWord.value.split(" ").map((word) => ({
    word,
    letters: word.split(""),
  }));
});

function clearFlipTimeout() {
  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
    timeoutId.value = null;
  }
}

function startTimeout() {
  clearFlipTimeout();
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
  clearFlipTimeout();
});

watch(isVisible, (newValue) => {
  if (newValue) {
    startTimeout();
  }
});

watch(motionAllowed, (allowed) => {
  if (!allowed) {
    clearFlipTimeout();
    isVisible.value = true;
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

<style>
.flip-words__word,
.flip-words__letter {
  opacity: 1;
}

@keyframes fadeInWord {
  0% {
    opacity: 1;
    transform: translateY(8px);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes fadeInLetter {
  0% {
    opacity: 1;
    transform: translateY(8px);
    filter: blur(6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.v-enter-active {
  animation: enterWord 0.6s ease-in-out forwards;
}

.v-leave-active {
  animation: leaveWord 0.6s ease-in-out forwards;
}

@keyframes enterWord {
  0% {
    opacity: 1;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes leaveWord {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(2);
    filter: blur(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .flip-words__word,
  .flip-words__letter {
    opacity: 1 !important;
    animation: none !important;
    filter: none !important;
    transform: none !important;
  }

  .v-enter-active,
  .v-leave-active {
    animation: none !important;
  }
}
</style>