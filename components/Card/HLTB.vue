<template>
  <Card @click="useOpenUrl(profiles.hltb)">
    <template #header>
      <div class="image">

        <NuxtImg alt="playing-now" :src="image" />
      </div>
    </template>

    <template #title>{{ isPlayingGameExist ? "Playing Now" : "Most Recently Finished" }}</template>


    <template #subtitle>
      {{ title }}
    </template>


    <template #content>
      <div class="flex-centered-column">
        <Tag :value="isPlatformPC ? customPlatform : platform" severity="contrast" />

        <Tag v-if="isPlayingGameExist" :value="progressionMessage" severity="secondary" />
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
  storefront: string;
}

const { data } = await useFetch('/api/hltb?status=currently-playing')
const { profiles } = useAppConfig()

const { title, platform, image, progress, status, storefront } = data.value as HLTB

const progressionMessage = computed(() => {
  if (!progress) return

  return "Playing for " + progress + " hours."
})

const isPlayingGameExist = computed(() => status !== 'no-playing-games')

const customPlatform = computed(() => (platform + ' | ' + storefront))

const isPlatformPC = computed(() => platform === 'PC')
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

  img {
    width: 45%;
    box-shadow: 0 0 2rem var(--highlight-bg);
    border-radius: var(--border-radius);
    transition: all 1s ease-in-out;

    &:hover {
      transform: scale(1.2);
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