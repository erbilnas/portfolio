<template>
  <main>
    <div class="flex-column">
      <CardSummary class="summary-card" />
      <CardSpotify />

      <div class="flex-row">
        <KnobCollection />
        <CardGithub />
      </div>
    </div>

    <div class="flex-column">
      <CardHLTB />

      <CardWorkingCompany />
    </div>

    <div class="flex-column">
      <CardRecentPosts />

      <div class="flex-row">
        <CardPlacesBeen />
        <CardGoodreads />
      </div>
    </div>

    <ScrollTop />
  </main>
</template>

<script lang="ts" setup>
type Medium = {
  title: string;
  link: string;
  feed: string;
  status: string;
  publishedDate: string;
  description: string;
};

type HLTB = {
  title: string;
  platform: string;
  image: string;
  progress: number;
  status: string;
  storefront: string;
  description: string;
};

const store = useDefaultStore();

const ONE_MINUTE = 60_000;
const HLTB_API = "/api/hltb?status=currently-playing";
const SPOTIFY_API = "/api/spotify?player=currently-playing";
const MEDIUM_API = "/api/medium";

onNuxtReady(async () => {
  const { data: currentlyPlaying, refresh } = await useFetch(SPOTIFY_API);
  const { data: hltb } = await useFetch(HLTB_API);
  const { data: recentPosts } = await useFetch(MEDIUM_API);

  setInterval(async () => {
    await refresh();
  }, ONE_MINUTE);

  store.currentlyPlaying = currentlyPlaying.value as string;
  store.hltb = hltb.value as HLTB;
  store.recentPosts = recentPosts.value as Medium;
});
</script>

<style lang="scss" scoped>
@import "/assets/animation.scss";

main {
  display: flex;
  justify-content: center;
  gap: 1rem;

  .p-card {
    cursor: pointer;
    transition: box-shadow 0.3s ease;
    flex: auto;

    &:hover {
      box-shadow: 0 0 0.5rem var(--primary-color);
      background: linear-gradient(
        45deg,
        var(--primary-color),
        var(--secondary-color)
      );
      transition: box-shadow 0.3s ease;
    }

    animation: fadeIn 0.5s;
  }

  .summary-card {
    cursor: default;
  }

  .flex-row {
    display: flex;
    flex: 1;
    gap: 1rem;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .flex-column {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 1366px) {
    flex-direction: column;
  }
}
</style>
