<template>
  <Card v-if="!isLoading" @click="useOpenUrl(config.public.githubProfileUrl)">
    <template #content>
      <i v-badge="'GO'" class="pi pi-github p-overlay-badge" style="font-size: 8rem" />
    </template>
  </Card>

  <Card v-else>
    <template #content>
      <Skeleton shape="circle" size="8rem"></Skeleton>
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
@media (max-width: 768px) {
  .p-card {
    align-items: center;
  }
}
</style>
