<template>
  <Card>
    <template #title>Recent Post</template>

    <template #subtitle>{{ title }}</template>

    <template #footer>
      <div class="button-container">
        <NuxtLink :to="link" target="_blank" rel="noopener">
          <Button label="Read Now" />
        </NuxtLink>

        <NuxtLink :to="feed" target="_blank" rel="noopener">
          <Button label="More Posts" outlined />
        </NuxtLink>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
type Medium = {
  title: string;
  link: string;
  feed: string;
}

const { data } = await useFetch('/api/medium')

const { title, link, feed } = data.value as Medium
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  gap: 1rem;
}
</style>