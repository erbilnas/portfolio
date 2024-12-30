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

<style lang="scss" scoped></style>
