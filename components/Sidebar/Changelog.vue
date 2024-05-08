<template>
  <Sidebar :visible="changelogVisible" :position :pt :draggable="false">
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button
        icon="pi pi-times"
        text
        rounded
        aria-label="Cancel"
        @click="changelogVisible = false"
      />
    </template>

    <Timeline :value="changelogs" align="alternate">
      <template #opposite="{ item }">
        <small class="p-text-secondary">{{ item.date }}</small>
      </template>

      <template #content="{ item }">
        {{ item.status }}
      </template>
    </Timeline>
  </Sidebar>
</template>

<script lang="ts" setup>
import { CHANGELOGS as changelogs } from "~/constants";

const store = useDefaultStore();

const { changelogVisible } = toRefs(store);

const isMobile = useResize(768);

const position = computed(() => (isMobile.value ? "full" : "bottom"));

const pt = { root: { style: { height: "50vh" } } };
</script>
