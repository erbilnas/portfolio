<template>
  <footer>
    <Toolbar v-if="!isLoading">
      <template #start>
        <div>
          {{ dayjs().year() }} © Made with <NuxtLink :to="config.public.luvProfileUrl" rel="noopener" target="__blank">
            🤍
          </NuxtLink>
        </div>
      </template>

      <template #center>
        <Button v-tooltip.top="versionMessage" label="Changelog" link @click="store.changelogVisible = true" />
      </template>

      <template #end>
        <Button icon="pi pi-twitter" aria-label="Twitter" text @click="useOpenUrl(config.public.twitterProfileUrl)" />
        <Button icon="pi pi-instagram" aria-label="Instagram" text
          @click="useOpenUrl(config.public.instagramProfileUrl)" />
        <Button icon="pi pi-linkedin" aria-label="LinkedIn" text @click="useOpenUrl(config.public.linkedinProfileUrl)" />
      </template>
    </Toolbar>

    <Toolbar v-else>
      <template #center>
        <Skeleton height="2rem" width="50vw" />
      </template>
    </Toolbar>
  </footer>
</template>

<script lang="ts" setup>
import { version } from '@@/package.json';

const store = useDefaultStore()
const dayjs = useDayjs()
const config = useRuntimeConfig()

const versionMessage = computed(() => `Version ${version}`);

const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})
</script>

<style lang="scss" scoped>
footer {
  padding: 5vh 15vw;

  @media (max-width: 768px) {
    padding: 5vh 0;
  }

  .p-toolbar {
    border: none;
    background: none;

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    a {
      text-decoration: none;
    }
  }
}
</style>