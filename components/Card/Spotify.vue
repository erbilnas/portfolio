<template>
  <Card @click="useOpenUrl(spotify)">
    <template #subtitle> Listening Now </template>

    <template #content>
      <div class="card-content">
        <div class="equalizer"><span /><span /><span /></div>

        <span>{{ currentlyPlaying }}</span>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const {
  profiles: { spotify },
} = useAppConfig();

const { data: currentlyPlaying, refresh } = useFetch(
  "/api/spotify?player=currently-playing"
);

onNuxtReady(() => {
  setInterval(async () => {
    await refresh();
  }, 60_000);
});
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.equalizer {
  display: flex;
  justify-content: space-between;
  width: 1rem;
  height: 1rem;

  span {
    width: 0.2rem;
    background-color: var(--primary-color);
    border-radius: var(--border-radius);
    animation: bounce 2.2s ease infinite alternate;
    content: "";

    &:nth-of-type(2) {
      animation-delay: -2.2s;
    }

    &:nth-of-type(3) {
      animation-delay: -3.7s;
    }
  }
}

@keyframes bounce {
  10% {
    transform: scaleY(0.3);
  }

  30% {
    transform: scaleY(1);
  }

  60% {
    transform: scaleY(0.5);
  }

  80% {
    transform: scaleY(0.75);
  }

  100% {
    transform: scaleY(0.6);
  }
}
</style>
