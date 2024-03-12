<template>
  <footer>
    <Toolbar>
      <template #start>
        <div>
          {{ getYear }} © Made with
          <NuxtLink :to="profiles.luv" rel="noopener" target="__blank">
            {{ store.theme == themes.dark ? "🤍" : "🖤" }}
          </NuxtLink>
        </div>
      </template>

      <template #center>
        <Button
          v-tooltip.top="versionMessage"
          label="Changelog"
          link
          @click="store.changelogVisible = true"
        />
        <Button
          :label="
            store.theme == themes.dark ? 'Be a Jedi' : 'Come to the Dark Side'
          "
          link
          @click="toggleTheme"
        />
      </template>

      <template #end>
        <Button
          icon="pi pi-twitter"
          aria-label="Twitter"
          text
          @click="useOpenUrl(profiles.twitter)"
        />
        <Button
          icon="pi pi-instagram"
          aria-label="Instagram"
          text
          @click="useOpenUrl(profiles.instagram)"
        />
        <Button
          icon="pi pi-linkedin"
          aria-label="LinkedIn"
          text
          @click="useOpenUrl(profiles.linkedin)"
        />
      </template>
    </Toolbar>
  </footer>
</template>

<script lang="ts" setup>
import { version } from "@@/package.json";

const store = useDefaultStore();
const dayjs = useDayjs();
const { profiles, themes } = useAppConfig();

const versionMessage = computed(() => `Version ${version}`);
const getYear = computed(() => dayjs().year());

const currentTheme = ref(themes.dark);

const toggleTheme = () => {
  const newTheme =
    currentTheme.value === themes.dark ? themes.light : themes.dark;

  currentTheme.value = newTheme;
  store.theme = newTheme;

  const themeLink = document.getElementById("theme-link");

  if (themeLink) {
    themeLink.setAttribute("href", newTheme);
  }
};
</script>

<style lang="scss" scoped>
footer {
  padding: 5vh 0;

  @media (max-width: 768px) {
    padding: 5vh 0;
  }

  .p-toolbar {
    border: none;
    background: none;

    @media (max-width: 1100px) {
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
