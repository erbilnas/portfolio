<template>
  <Card>
    <template #title>
      <div v-if="store.recentPosts.title">{{ success ? store.recentPosts.title : "Error" }}</div>

      <Skeleton height="2rem" width="80%" v-else />
    </template>

    <template #subtitle>
      <div v-if="store.recentPosts.status">
        {{ success ? "Recent Post" : '500' }}
      </div>
    </template>

    <template #content>
      <div v-if="store.recentPosts.description">
        <p v-if="success">
        <div class="content">
          <p>{{ store.recentPosts.description }}</p>

          <small>Published on {{ dayjs(store.recentPosts.publishedDate).format("LLLL") }}</small>
        </div>
        </p>
      </div>

      <Skeleton height="1rem" width="40%" v-else />
    </template>

    <template #footer class="footer">
      <div v-if="store.recentPosts.link">
        <div v-if="success" class="button-container">
          <NuxtLink :to="store.recentPosts.link" target="_blank" rel="noopener">
            <Button label="Read Now" />
          </NuxtLink>

          <NuxtLink :to="store.recentPosts.feed" target="_blank" rel="noopener">
            <Button label="More Posts" outlined />
          </NuxtLink>
        </div>

        <div v-else>Please attempt again at a later time.</div>
      </div>

      <Skeleton height="12rem" v-else />
    </template>
  </Card>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

const store = useDefaultStore();

const success = computed(() => store.recentPosts.status === "success");
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  gap: 1rem;
  justify-content: space-between;

  a,
  button {
    width: 100%;
  }

  @media (max-width: 1920px) {
    flex-direction: column;
  }
}

.p-card {
  cursor: default !important;

  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
