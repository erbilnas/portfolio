<template>
  <Sidebar
    :visible="store.changelogVisible"
    :position="isMobile ? 'full' : 'bottom'"
    :pt="sidebarPt"
    :draggable="false"
  >
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button
        icon="pi pi-times"
        text
        rounded
        aria-label="Cancel"
        @click="store.changelogVisible = false"
      />
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
const store = useDefaultStore();

const isMobile = ref(false);

const logs = ref([
  {
    status:
      "Version 5, built with Nuxt and deployed on Vercel, has been released.",
    date: "2024",
  },
  {
    status: "Version 4 now utilizes a custom WordPress theme. Hello PHP!",
    date: "2018",
  },
  {
    status:
      "Version 3 has been released with changes to both the theme and the content.",
    date: "2017",
  },
  {
    status:
      "Version 2 has been released using a pre-configured WordPress setup.",
    date: "2016",
  },
  {
    status: "The initial release of the application utilizing Blogger.",
    date: "2013",
  },
]);

const sidebarPt = { root: { style: { height: "50vh" } } };

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
});
</script>

<style></style>
