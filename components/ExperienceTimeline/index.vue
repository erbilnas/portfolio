<template>
  <div>
    <div v-if="isMobile">
      <Card
        v-for="({ name, title, range, description }, index) in workplaces"
        :key="index"
      >
        <template #title>
          {{ name }}
        </template>

        <template #subtitle>
          {{ title }}
        </template>

        <template #content>
          {{ range }}

          <p>
            <small>
              {{ description }}
            </small>
          </p>
        </template>
      </Card>
    </div>

    <TreeTimeline v-else :workplaces />

    <ScrollTop />
  </div>
</template>

<script lang="ts" setup>
import { WORKPLACES as workplaces } from "~/constants";

import TreeTimeline from "./TreeTimeline.vue";

const isMobile = useResize(1080);
</script>

<style lang="scss" scoped>
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

  @media (max-width: 1080px) {
    margin-bottom: 1rem;
  }
}
</style>
