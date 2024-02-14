<template>
  <Card @click="useOpenUrl(maps.placesBeen)">
    <template #header>
      <div class="card-header">
        <i class="pi pi-compass" />
      </div>
    </template>

    <template #title>
      The Hitchhiker's Guide
    </template>

    <template #subtitle>
      Veni, vidi, vici!
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { maps } = useAppConfig()
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5vh 0;
}

.pi-compass {
  font-size: 10rem;
}
</style>