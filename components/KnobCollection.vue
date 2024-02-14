<template>
  <Card @click="useOpenUrl(profiles.linkedin)">
    <template #content>
      <div class="card-content">
        <div class="card-content--column">
          <Knob v-model="age" :strokeWidth="5" readonly />
          <p>Age</p>
        </div>

        <div class="card-content--column">
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

const { data } = await useFetch("/api/stats");
const { profiles } = useAppConfig();
const store = useDefaultStore();

const { age, experience } = data.value as Stats;

store.age = age;
</script>

<style lang="scss" scoped>
.p-card {
  @media (max-width: 768px) {
    align-items: center;
  }
}

.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  &--column {
    flex-direction: column;
    align-items: center;
    display: flex;
  }
}
</style>
