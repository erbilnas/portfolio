<template>
  <Card v-if="!isLoading" @click="openSidebar">
    <template #header>
      <div class="profile-image">
        <img :src="profileImageUrl" />
      </div>
    </template>

    <template #title>Erbil Nas</template>

    <template #subtitle>Software Engineer</template>

    <template #content>
      An always-learner software engineer
    </template>
  </Card>

  <Card v-else>
    <template #content>
      <div class="flex-row">
        <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
        <Skeleton width="10rem" height="4rem"></Skeleton>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const config = useRuntimeConfig()

const isLoading = ref(true)

const profileImageUrl = computed(() => {
  return config.public.profilePicture
})

const openSidebar = () => {
  store.sidebarVisible = true
}

onMounted(() => {
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.p-card {
  display: flex;
  flex-direction: row;
}

.profile-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 10vh;
    height: 10vh;
    border-radius: 50%;
    margin: 2vh;
    box-shadow: 0 0 1rem var(--highlight-bg);
    transition: transform 1s ease;
  }
}

.profile-image:hover img {
  transform: scale(1.1);
}

.flex-row {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>