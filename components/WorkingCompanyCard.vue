<template>
  <Card v-if="!isLoading" @click="useOpenUrl(config.public.trendyolProfileUrl)">
    <template #title>
      Trendyol
    </template>

    <template #subtitle>
      Works here
    </template>
  </Card>

  <Card v-else>
    <template #title>
      <Skeleton width="6rem"></Skeleton>
    </template>

    <template #subtitle>
      <Skeleton height="1rem"></Skeleton>
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

<style></style>