<template>
  <Card @click="useOpenUrl(hltb)">
    <template #header>
      <div class="image">
        <NuxtImg
          alt="playing-now"
          :src="store.hltb.image"
          v-if="store.hltb.image"
        />

        <Skeleton height="18rem" width="50%" v-else />
      </div>

      <div
        class="tag-collection"
        v-if="store.hltb.platform && isPlayingGameExist"
      >
        <Tag
          :value="store.hltb.platform"
          severity="contrast"
          :icon="platformIcon"
        />

        <Tag
          v-if="store.hltb.storefront"
          :value="store.hltb.storefront"
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
      <div v-if="store.hltb.title">{{ store.hltb.title }}</div>

      <Skeleton height="2rem" width="80%" v-else />
    </template>

    <template #subtitle>
      <div v-if="store.hltb.title">
        {{ isPlayingGameExist ? "Playing Now" : "Recently Finished" }}
      </div>
    </template>

    <template #content>
      <div v-if="descriptionText">{{ descriptionText }}</div>

      <Skeleton height="4rem" v-else />
    </template>
  </Card>
</template>

<script lang="ts" setup>
const {
  profiles: { hltb },
} = useAppConfig();

const store = useDefaultStore();

const progressionText = computed(() => {
  if (!store.hltb.progress) return;

  return store.hltb.progress + " hours";
});

const descriptionText = computed(() => {
  return store.hltb.description.split("How long")[0];
});

const isPlayingGameExist = computed(
  () => store.hltb.status !== "no-playing-games"
);

const platformIcon = computed(() => {
  switch (store.hltb.platform) {
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
  switch (store.hltb.storefront) {
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
    width: 50%;

    @media screen and (max-width: 768px) {
      width: 100%;
    }
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
