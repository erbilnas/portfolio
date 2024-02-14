<template>
  <Card @click="useOpenUrl(profiles.github)">
    <template #content>
      <div class="card-content">
        <i class="pi pi-github" />
      </div>
    </template>

    <template #footer>
      Talk is cheap. Show me the code.
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { profiles } = useAppConfig();
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 8rem;
  }
}

.p-card {
  @media (max-width: 768px) {
    align-items: center;
  }
}
</style>
