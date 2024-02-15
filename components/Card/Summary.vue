<template>
  <Card @click="store.sidebarVisible = true">
    <template #header>
      <div class="profile-image">
        <NuxtImg :src="profilePicture" alt="profile-picture" />
      </div>
    </template>

    <template #title>Erbil Nas</template>

    <template #subtitle>Software Engineer</template>

    <template #content>
      An ever-learning software engineer
    </template>
  </Card>
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const { profilePicture } = useAppConfig()
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

    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>