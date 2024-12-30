<template>
  <Card @click="useOpenUrl(linkedin)">
    <template #content>
      <div class="card-content">
        <div class="card-content--text">
          <Knob v-model="age" :strokeWidth="5" readonly />

          <p>Age</p>
        </div>

        <div class="card-content--text">
          <Knob v-model="experience" :strokeWidth="5" readonly :max="35" />

          <p>Experience</p>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

type Stats = {
  age: number;
  experience: number;
};

const {
  profiles: { linkedin },
} = useAppConfig();
const store = useDefaultStore();

const { data } = await useFetch("/api/stats");
const { age: targetAge, experience: targetExperience } = data.value as Stats;

const age = ref(0);
const experience = ref(0);
const currentStep = ref(0);

const animateValues = () => {
  const duration = 1500;
  const steps = 60;
  const interval = duration / steps;

  const ageIncrement = targetAge / steps;
  const experienceIncrement = targetExperience / steps;

  const timer = setInterval(() => {
    currentStep.value++;
    age.value = Math.min(
      Math.round(ageIncrement * currentStep.value),
      targetAge
    );
    experience.value = Math.min(
      Math.round(experienceIncrement * currentStep.value),
      targetExperience
    );

    if (currentStep.value >= steps) {
      clearInterval(timer);
      store.age = targetAge;
    }
  }, interval);

  return timer;
};

onMounted(() => {
  const timer = animateValues();

  onUnmounted(() => clearInterval(timer));
});
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &--text {
    flex-direction: column;
    align-items: center;
    display: flex;
  }
}
</style>
