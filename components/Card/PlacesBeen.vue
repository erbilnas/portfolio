<template>
  <Card>
    <template #header>
      <div class="card-header">
        <i class="pi pi-compass" />
      </div>
    </template>

    <template #title> The Hitchhiker's Guide </template>

    <template #subtitle> Veni, vidi, vici! </template>

    <template #footer>
      <Button label="View on Google Maps" size="small" icon="fa-solid fa-map-location-dot"
        @click="useOpenUrl(placesBeen)" />
    </template>
  </Card>
</template>

<script lang="ts" setup>
const {
  maps: { placesBeen },
} = useAppConfig();
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5vh 0;
}

.p-card {
  &:hover {
    i {
      animation: rotate 1s linear none;
    }
  }
}

.pi-compass {
  font-size: 8rem;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(15deg);
  }

  100% {
    transform: rotate(-15deg);
  }
}
</style>
