<template>
  <Card @click="openSidebar">
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
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const config = useAppConfig()

const profileImageUrl = computed(() => {
  return config.profilePicture
})

const openSidebar = () => {
  store.sidebarVisible = true
}
</script>

<style lang="scss" scoped>
.p-card {
  display: flex;
  flex-direction: row;
}

.profile-image {
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
</style>