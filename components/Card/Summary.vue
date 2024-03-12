<template>
  <Card @click="store.sidebarVisible = true">
    <template #header>
      <div class="profile-image">
        <NuxtImg :src="profilePicture" alt="profile-picture" />
      </div>
    </template>

    <template #title>Erbil Nas</template>

    <template #subtitle>Software Engineer</template>

    <template #content> An ever-learning technology enthusiast. </template>
  </Card>
</template>

<script lang="ts" setup>
const store = useDefaultStore();

const { profilePicture } = useAppConfig();
</script>

<style lang="scss" scoped>
.p-card {
  display: flex;
  flex-direction: row;

  border-radius: var(--border-radius);

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.profile-image {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 10vh;
    height: 10vh;
    border-radius: 50%;
    margin: 2vh;
    transition: all 1s ease-in;

    &:hover {
      border-radius: var(--border-radius);
      transform: scale(4);
    }
  }
}
</style>
