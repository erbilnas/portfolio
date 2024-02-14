<template>
  <Card @click="useOpenUrl(profiles.hltb)">
    <template #header>
      <div class="image">
        <div class="image--blurred" />

        <NuxtImg alt="playing-now" v-if="!isLoading" :src="image" />

        <Skeleton v-else width="8rem" height="10rem" />
      </div>
    </template>

    <template #title v-if="!isLoading">{{ isPlayingGameExist ? "Playing Now" : "Most Recently Finished" }}</template>

    <template #title v-else>
      <Skeleton height="1rem" width="12rem" />
    </template>

    <template #subtitle v-if="!isLoading">
      {{ title }}
    </template>

    <template #subtitle v-else>
      <Skeleton height="1rem" width="8rem" />
    </template>

    <template #content v-if="!isLoading">
      <div class="flex-centered-column">
        <Tag :value="platform" severity="contrast" />

        <Tag v-if="isPlayingGameExist" :value="progressionMessage" severity="secondary" />
      </div>
    </template>

    <template #content v-else>
      <div class="flex-centered-column">
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
type HLTB = {
  title: string;
  platform: string;
  image: string;
  progress: number;
  status: string;
}

const { data } = await useFetch('/api/hltb?status=currently-playing')
const { profiles } = useAppConfig()

const { title, platform, image, progress, status } = data.value as HLTB

const progressionMessage = computed(() => {
  if (!progress) return

  return "Playing for " + progress + " hours."
})

const isLoading = ref(true)

const isPlayingGameExist = computed(() => status !== 'no-playing-games')

onNuxtReady(() => {
  if (!image) return

  const blurredImage = document?.querySelector('.image--blurred') as HTMLElement;

  blurredImage?.style.setProperty('background-image', `url(${image})`);

  isLoading.value = false
})
</script>

<style lang="scss" scoped>
.p-card {
  min-width: 20vw;
}

.image {
  padding: 2vh 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 1;


  &--blurred {
    width: 95%;
    height: 95%;
    background-size: cover;
    position: absolute;
    background-image: url('');
    filter: blur(5px);
    z-index: -1;
  }

  img {
    width: 30%;
    box-shadow: 0 0 1rem var(--highlight-bg);
    border-radius: var(--border-radius);
    transition: transform 1s ease;

    &:hover {
      transform: scale(1.05);
      box-shadow: 0 0 1rem var(--highlight-bg);
    }
  }
}

.flex-centered-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>