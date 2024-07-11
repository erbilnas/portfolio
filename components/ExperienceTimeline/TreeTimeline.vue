<template>
  <Timeline :value="workplaces" align="alternate">
    <template #content="{ item }">
      <Card>
        <template #title>
          {{ item.name }}
        </template>

        <template #subtitle>
          {{ item.title }}
        </template>

        <template #content>
          {{ item.range }}

          <p>
            <small>
              {{ item.description }}
            </small>
          </p>
        </template>
      </Card>
    </template>
  </Timeline>
</template>

<script lang="ts" setup>
type Workplace = {
  name: string;
  title: string;
  range: string;
  description: string;
};

defineProps<{
  workplaces: Workplace[];
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
