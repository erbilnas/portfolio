<template>
  <Card>
    <template #title>{{ success ? 'Recent Post' : 'Warning' }}</template>

    <template #subtitle>{{ title }}</template>

    <template #footer>
      <div v-if="success" class="button-container">
        <NuxtLink :to="link" target="_blank" rel="noopener">
          <Button label="Read Now" />
        </NuxtLink>

        <NuxtLink :to="feed" target="_blank" rel="noopener">
          <Button label="More Posts" outlined />
        </NuxtLink>
      </div>

      <div v-else>
        Please attempt again at a later time.
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
type Medium = {
  title: string;
  link: string;
  feed: string;
  status: string;
}

const { data } = await useFetch('/api/medium')

const { title, link, feed, status } = data.value as Medium

const success = computed(() => status === 'success')
</script>

<style lang="scss" scoped>
.button-container {
  display: flex;
  gap: 1rem;
}

.p-card {
  cursor: default !important;
}
</style>