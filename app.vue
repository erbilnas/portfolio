<template>
  <Cursor v-if="isClient" />

  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Use a ref to ensure reactivity and avoid initialization order issues
const isClient = ref(false);

// Initialize on client side only, after all components are mounted
onMounted(() => {
  isClient.value = true;
});
</script>
