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
      An ever-learning software engineer
    </template>
  </Card>

  <Card v-else>
    <template #header>
      <div class="skeleton__header">
        <Skeleton shape="circle" size="8rem" />
      </div>
    </template>

    <template #title>
      <Skeleton height="1.5rem" width="6rem" />
    </template>

    <template #subtitle>
      <Skeleton height="1rem" width="10rem" />
    </template>

    <template #content>
      <Skeleton height="1rem" width="18rem" />
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

.skeleton {
  &__header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2.5vh;
  }
}
</style>