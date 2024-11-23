<template>
  <Card>
    <template #header>
      <div class="card-header">
        <i class="pi pi-book" />
      </div>
    </template>

    <template #title> Bookshelf </template>

    <template #subtitle> Look at what I'm reading now! </template>

    <template #footer>
      <Button label="View on Goodreads" size="small" icon="fa-solid fa-book" @click="useOpenUrl(goodreads)" />
    </template>
  </Card>
</template>

<script lang="ts" setup>
const {
  profiles: { goodreads },
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

.pi-book {
  font-size: 8rem;
}

@keyframes rotate {
  0% {
    transform: perspective(1000px) rotateY(0deg);
  }

  50% {
    transform: perspective(1000px) rotateY(30deg);
  }

  100% {
    transform: perspective(1000px) rotateY(-30deg);
  }
}
</style>
