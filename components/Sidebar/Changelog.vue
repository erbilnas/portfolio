<template>
  <Sidebar :visible="store.changelogVisible" :position="isMobile ? 'full' : 'bottom'" :pt="sidebarPt" :draggable="false">
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button icon="pi pi-times" text rounded aria-label="Cancel" @click="store.changelogVisible = false" />
    </template>

    <Timeline :value="logs" align="alternate">
      <template #opposite="{ item }">
        <small class="p-text-secondary">{{ item.date }}</small>
      </template>

      <template #content="{ item }">
        {{ item.status }}
      </template>
    </Timeline>
  </Sidebar>
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const isMobile = ref(false)

const logs = ref([
  { status: 'Version 5.1 introduces the Spotify integration. You can see what I am listening now ^-^', date: 'Feb 14, 2024' },
  { status: 'Version 5, built with Nuxt and deployed on Vercel, has been released.', date: 'Feb 13, 2024' },
  { status: 'Version 4.3 introduces the Medium integration. The blog is now live!', date: '2022' },
  { status: 'Version 4.2 introduces the live stats.', date: '2020' },
  { status: 'Version 4 now utilizes a custom WordPress theme.', date: '2018' },
  { status: 'In Version 3, the theme and the context have been changed completely.', date: '2017' },
  { status: 'Version 2 has been released using WordPress. Hello PHP!', date: '2016' },
  { status: 'The initial release of the application utilizing Blogger.', date: '2013' }
]);

const sidebarPt = { root: { style: { height: "50vh" } } };


onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }
})
</script>

<style></style>