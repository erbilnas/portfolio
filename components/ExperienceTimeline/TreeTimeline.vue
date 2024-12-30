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

<style lang="scss" scoped></style>
