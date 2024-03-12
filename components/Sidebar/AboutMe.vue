<template>
  <Sidebar
    :visible="store.sidebarVisible"
    :position="isMobile ? 'full' : 'left'"
    :pt="sidebarPt"
    :draggable="false"
  >
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button
        icon="pi pi-times"
        text
        rounded
        aria-label="Cancel"
        @click="store.sidebarVisible = false"
      />
    </template>

    <div class="panel">
      <Panel header="About Me" toggleable>
        <AboutMeWriting />
      </Panel>

      <Panel header="Workplaces" toggleable collapsed>
        <TimelineWorkplaces />
      </Panel>

      <Panel header="Statistics" toggleable collapsed>
        <KnobCollection />
      </Panel>
    </div>
  </Sidebar>
</template>

<script lang="ts" setup>
const store = useDefaultStore();

const isMobile = ref(false);

const sidebarPt = { root: { style: { width: "50vw" } } };

onNuxtReady(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
});
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
