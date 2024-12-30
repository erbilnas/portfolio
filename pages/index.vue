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
  progress: string;
  status: string;
  storefront: string;
  description: string;
};

const store = useDefaultStore();

const ONE_MINUTE = 60_000;
const HLTB_API = "/api/hltb?status=currently-playing";
const SPOTIFY_API = "/api/spotify?player=currently-playing";
const MEDIUM_API = "/api/medium";

function handleMouseMove(e: MouseEvent) {
  const cards = document.querySelectorAll(".p-card");

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
    (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
  });
}

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

  document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
});
</script>

<style lang="scss" scoped>
@import "/assets/animation.scss";

main {
  display: flex;
  justify-content: center;
  gap: 1rem;

  .p-card {
    transition: all 0.3s ease;
    flex: auto;
    position: relative;
    border: 1px solid transparent;
    background-clip: padding-box;

    &::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: radial-gradient(
        800px circle at var(--mouse-x) var(--mouse-y),
        var(--primary-color),
        transparent 40%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
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
