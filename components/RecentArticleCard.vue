<template>
  <Card>
    <template #title>Recent Post</template>

    <template #subtitle>{{ title }}</template>

    <template #footer>
      <div class="button-container">
        <NuxtLink :to="link" target="_blank" rel="noopener">
          <Button label="Read Now" />
        </NuxtLink>

        <NuxtLink :to="config.public.mediumProfileUrl" target="_blank" rel="noopener">
          <Button label="More" outlined />
        </NuxtLink>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
type MediumResponse = {
  items: {
    title: string;
    link: string;
  }[];
}

const config = useRuntimeConfig()

const { data } = await useFetch(config.public.mediumRssFeed)

const { title, link } = (data.value as MediumResponse)?.items[0]
</script>

<style lang="scss" scoped>
.p-card {
  min-width: 25vw;
}

.button-container {
  display: flex;
  gap: 1rem;

  a {
    text-decoration: none;
  }
}
</style>