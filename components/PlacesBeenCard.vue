<template>
  <Card @click="useOpenUrl(config.public.placesBeenMapUrl)">
    <template #header>
      <div class="card-header">
        <i class="pi pi-compass icon" />
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
const config = useRuntimeConfig()
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5vh 0;
}

.icon {
  font-size: 10rem;
}
</style>