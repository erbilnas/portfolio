<template>
  <footer>
    <Toolbar>
      <template #start>{{ dayjs().year() }} © Made with 🤍</template>

      <template #center>
        <Button v-tooltip.top="versionMessage" label="Changelog" link />
      </template>

      <template #end>
        <Button icon="pi pi-twitter" aria-label="Twitter" text @click="useOpenUrl(config.public.twitterProfileUrl)" />
        <Button icon="pi pi-instagram" aria-label="Instagram" text
          @click="useOpenUrl(config.public.instagramProfileUrl)" />
        <Button icon="pi pi-linkedin" aria-label="LinkedIn" text @click="useOpenUrl(config.public.linkedinProfileUrl)" />
      </template>
    </Toolbar>
  </footer>
</template>

<script lang="ts" setup>
import { version } from '@@/package.json';

const dayjs = useDayjs()
const config = useRuntimeConfig()

const versionMessage = computed(() => `Version ${version}`);
</script>

<style lang="scss" scoped>
footer {
  padding: 5vh 25vw;

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
  }
}
</style>