<template>
  <Card v-if="!isLoading" @click="useOpenUrl(config.public.placesBeenMapUrl)">
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

  <Card v-else>
    <template #header>
      <div class="card-header">
        <Skeleton shape="circle" size="10rem" />
      </div>
    </template>

    <template #title>
      <Skeleton width="16rem" />
    </template>

    <template #subtitle>
      <Skeleton width="8rem" />
    </template>
  </Card>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})
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