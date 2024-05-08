<template>
  <Card>
    <template #title>{{ title }}</template>

    <template #subtitle>{{ success ? "Recent Post" : "Warning" }}</template>

    <template #content>
      <p v-if="success">
        <div class="content">
          <p>{{ description }}</p>
      
          <small>Published on {{ dayjs(publishedDate).format("LLLL") }}</small>
        </div>
      </p>
    </template>

    <template #footer class="footer">
      <div v-if="success" class="button-container">
        <NuxtLink :to="link" target="_blank" rel="noopener">
          <Button label="Read Now" />
        </NuxtLink>

        <NuxtLink :to="feed" target="_blank" rel="noopener">
          <Button label="More Posts" outlined />
        </NuxtLink>
      </div>

      <div v-else>Please attempt again at a later time.</div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(localizedFormat);

type Medium = {
  title: string;
  link: string;
  feed: string;
  status: string;
  publishedDate: string;
  description: string;
};

const { data } = await useFetch("/api/medium");

const { title, link, feed, status, publishedDate, description } =
  data.value as Medium;

const success = computed(() => status === "success");
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
