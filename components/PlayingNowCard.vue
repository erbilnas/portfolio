<template>
  <Card @click="useOpenUrl(config.public.hltbProfileUrl)">
    <template #header>
      <div class="image">
        <div class="image--blurred" />

        <img alt="playing-now" :src="hltb?.image" />
      </div>
    </template>

    <template #title>Playing Now</template>

    <template #subtitle>
      <div class="flex-centered-row">
        {{ hltb?.title }}

        <Divider :layout="'vertical'" />

        <Tag :value="hltb?.platform" />
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { data: hltb } = await useFetch('/api/hltb?status=playing')

const config = useRuntimeConfig()

onMounted(() => {
  if (!hltb.value) return

  const blurredImage = document?.querySelector('.image--blurred') as HTMLElement;

  blurredImage?.style.setProperty('background-image', `url(${hltb.value.image})`);
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
    background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
    filter: blur(5px);
    z-index: -1;
  }

  img {
    width: 30%;
    box-shadow: 0 0 1rem var(--highlight-bg);
    border-radius: var(--border-radius);
    transition: transform 1s ease;
  }
}

.image:hover img {
  transform: scale(1.1);
  box-shadow: 0 0 1rem var(--highlight-bg);
}

.flex-centered-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>