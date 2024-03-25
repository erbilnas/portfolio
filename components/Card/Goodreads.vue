<template>
  <Card @click="useOpenUrl(profiles.goodreads)">
    <template #header>
      <div class="card-header">
        <i class="pi pi-book" />
      </div>
    </template>

    <template #title> Bookshelf </template>

    <template #subtitle> Look at what I'm reading now! </template>
  </Card>
</template>

<script lang="ts" setup>
const { profiles } = useAppConfig();
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5vh 0;
}

.pi-book {
  font-size: 8rem;
}
</style>
