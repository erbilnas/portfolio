<template>
  <Card @click="useOpenUrl(hltb)">
    <template #header>
      <div class="image">
        <NuxtImg alt="playing-now" :src="image" />
      </div>

      <div class="tag-collection">
        <Tag :value="platform" severity="contrast" :icon="platformIcon" />

        <Tag
          v-if="storefront"
          :value="storefront"
          severity="info"
          :icon="storefrontIcon"
        />

        <Tag
          v-if="isPlayingGameExist"
          :value="progressionText"
          icon="fa-regular fa-clock"
        />
      </div>
    </template>

    <template #title>
      {{ title }}
    </template>

    <template #subtitle>
      {{ isPlayingGameExist ? "Playing Now" : "Recently Finished" }}
    </template>

    <template #content>
      {{ descriptionText }}
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
  description: string;
};

// const { data } = await useFetch("/api/hltb?status=currently-playing");
const { data } = await useAsyncData("hltb", async () => {
  const response = await $fetch("/api/hltb?status=currently-playing");

  return response;
});

const {
  profiles: { hltb },
} = useAppConfig();

const { title, platform, image, progress, status, storefront, description } =
  data.value as HLTB;

const progressionText = computed(() => {
  if (!progress) return;

  return progress + " hours";
});

const descriptionText = computed(() => {
  return description.split("How long")[0];
});

const isPlayingGameExist = computed(() => status !== "no-playing-games");

const platformIcon = computed(() => {
  switch (platform) {
    case "PC":
      return "fa-brands fa-microsoft";
    case "PlayStation 4":
      return "fa-brands fa-playstation";
    case "PlayStation 5":
      return "fa-brands fa-playstation";
    case "Xbox One":
      return "fa-brands fa-xbox";
    case "Xbox Series X/S":
      return "fa-brands fa-xbox";
    case "Meta Quest":
      return "fa-solid fa-vr-cardboard";
    case "iOS":
      return "fa-brands fa-apple";
    default:
      return "fa-solid fa-gamepad";
  }
});

const storefrontIcon = computed(() => {
  switch (storefront) {
    case "Steam":
      return "fa-brands fa-steam";
    case "Xbox Game Pass":
      return "fa-brands fa-xbox";
    case "Microsoft Store":
      return "fa-brands fa-microsoft";
    case "PlayStation Store":
      return "fa-brands fa-playstation";
    case "PlayStation Plus":
      return "fa-brands fa-playstation";
    case "Battle.net":
      return "fa-brands fa-battle-net";
    case "itch.io":
      return "fa-brands fa-itch-io";
    default:
      return "fa-solid fa-store";
  }
});
</script>

<style lang="scss" scoped>
.image {
  padding: 1.2rem;

  img {
    border-radius: var(--border-radius);
  }
}

.tag-collection {
  display: flex;
  gap: 0.5rem;
  padding: 0 1.2rem;

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
  }
}
</style>
