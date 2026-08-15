<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

await navigateTo("/admin/guestbook", { replace: true });
</script>

<template>
  <div />
</template>
