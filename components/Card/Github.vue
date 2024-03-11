<template>
  <Card @click="useOpenUrl(profiles.github)">
    <template #content>
      <div class="card-content">
        <i class="pi pi-github" />
      </div>
    </template>

    <template #footer>
      <p>Talk is cheap. Show me the code.</p>
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
    font-size: 6rem;
  }
}

.p-card {
  @media (max-width: 768px) {
    align-items: center;
  }

  p {
    text-align: center;
  }
}
</style>
