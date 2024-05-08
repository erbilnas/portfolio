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
type Stats = {
  age: number;
  experience: number;
};

const {
  profiles: { linkedin },
} = useAppConfig();
const store = useDefaultStore();

const { data } = await useFetch("/api/stats");

const { age, experience } = data.value as Stats;

store.age = age;
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
