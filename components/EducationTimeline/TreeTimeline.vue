<template>
  <Timeline :value="educations" align="alternate">
    <template #content="{ item }">
      <Card>
        <template #title>
          {{ item.name }}
        </template>

        <template #subtitle>
          {{ item.degree }}
        </template>

        <template #content>
          {{ item.range }}

          <p>
            <small>
              {{ item.studyField }}
            </small>
          </p>
        </template>
      </Card>
    </template>
  </Timeline>
</template>

<script lang="ts" setup>
type Education = {
  name: string;
  degree: string;
  range: string;
  studyField: string;
};

defineProps<{
  educations: Education[];
}>();
</script>

<style lang="scss" scoped>
@import "/assets/animation.scss";

.p-card {
  &:hover {
    cursor: default;
    transition: box-shadow 0.5s ease;
    box-shadow: 0 0 0.5rem var(--primary-color);
    background: linear-gradient(
      45deg,
      var(--primary-color),
      var(--secondary-color)
    );
  }

  animation: fadeIn 0.5s;
}
</style>
