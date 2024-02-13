<template>
  <Sidebar :visible="store.changelogVisible" position="bottom" :pt="{ root: { style: { 'height': '35vh' } } }"
    :draggable="false">
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button icon="pi pi-times" text rounded aria-label="Cancel" @click="store.changelogVisible = false" />
    </template>

    <Timeline :value="logs" align="alternate">
      <template #opposite="props">
        <small class="p-text-secondary">{{ props.item.date }}</small>
      </template>

      <template #content="props">
        {{ props.item.status }}
      </template>
    </Timeline>
  </Sidebar>
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const logs = ref([
  { status: 'The initial preview of Version 5, built with Nuxt and deployed on Vercel, has been released.', date: 'Feb 13, 2024' },
  { status: 'Version 4.3 introduces the Medium integration. The blog is now live!', date: '2022' },
  { status: 'Version 4.2 introduces the live stats.', date: '2020' },
  { status: 'Version 4 now utilizes a custom WordPress theme.', date: '2018' },
  { status: 'In Version 3, the theme and the context have been changed completely.', date: '2017' },
  { status: 'Version 2 has been released using WordPress. Hello PHP!', date: '2016' },
  { status: 'The initial release of the application utilizing Blogger.', date: '2013' }
]);
</script>

<style></style>