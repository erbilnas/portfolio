<template>
  <footer>
    <Toolbar>
      <template #start>
        <div>
          {{ getYear }} © Made with <NuxtLink :to="profiles.luv" rel="noopener" target="__blank">
            🤍
          </NuxtLink>
        </div>
      </template>

      <template #center>
        <Button v-tooltip.top="versionMessage" label="Changelog" link @click="store.changelogVisible = true" />
      </template>

      <template #end>
        <Button icon="pi pi-twitter" aria-label="Twitter" text @click="useOpenUrl(profiles.twitter)" />
        <Button icon="pi pi-instagram" aria-label="Instagram" text @click="useOpenUrl(profiles.instagram)" />
        <Button icon="pi pi-linkedin" aria-label="LinkedIn" text @click="useOpenUrl(profiles.linkedin)" />
      </template>
    </Toolbar>
  </footer>
</template>

<script lang="ts" setup>
import { version } from '@@/package.json';

const store = useDefaultStore()
const dayjs = useDayjs()
const { profiles } = useAppConfig()

const versionMessage = computed(() => `Version ${version}`);
const getYear = computed(() => dayjs().year());
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