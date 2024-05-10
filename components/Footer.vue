<template>
  <footer>
    <Toolbar>
      <template #start>
        <div>
          {{ copyrightText }}

          <NuxtLink :to="luv" rel="noopener" target="__blank">
            {{ theme == themes.dark ? "🤍" : "🖤" }}
          </NuxtLink>
        </div>
      </template>

      <template #center>
        <div class="center">
          <Button
            v-tooltip.top="versionText"
            label="Changelog"
            text
            @click="changelogVisible = true"
          />

          <Button
            :label="
              theme == themes.dark ? 'Be a Jedi' : 'Come to the Dark Side'
            "
            text
            @click="toggleTheme"
          />
        </div>
      </template>

      <template #end>
        <Button
          v-for="({ ariaLabel, icon, onClick }, index) in socialMediaButtons"
          :key="index"
          :icon
          :aria-label
          @click="onClick"
          text
        />
      </template>
    </Toolbar>
  </footer>
</template>

<script lang="ts" setup>
import { version } from "@@/package.json";

const store = useDefaultStore();
const dayjs = useDayjs();
const {
  profiles: { twitter, instagram, linkedin, luv, github, youtube },
  themes,
} = useAppConfig();

const { changelogVisible, theme } = toRefs(store);

const versionText = computed(() => `Version ${version}`);
const copyrightText = computed(() => `${dayjs().year()} © Made with`);

const currentTheme = ref(themes.dark);

const toggleTheme = () => {
  const newTheme =
    currentTheme.value === themes.dark ? themes.light : themes.dark;

  currentTheme.value = newTheme;
  store.theme = newTheme;

  // Find the existing theme link element or create a new one
  let themeLink = document.getElementById("theme-link");
  if (!themeLink) {
    themeLink = document.createElement("link");
    themeLink.setAttribute("rel", "stylesheet");
    themeLink.setAttribute("id", "theme-link");
    document.head.appendChild(themeLink);
  }

  // Update the href attribute of the theme link
  themeLink.setAttribute("href", newTheme);
};

const socialMediaButtons = [
  {
    icon: "pi pi-twitter",
    ariaLabel: "Twitter",
    onClick: () => useOpenUrl(twitter),
  },
  {
    icon: "pi pi-github",
    ariaLabel: "GitHub",
    onClick: () => useOpenUrl(github),
  },
  {
    icon: "pi pi-instagram",
    ariaLabel: "Instagram",
    onClick: () => useOpenUrl(instagram),
  },
  {
    icon: "pi pi-linkedin",
    ariaLabel: "LinkedIn",
    onClick: () => useOpenUrl(linkedin),
  },
  {
    icon: "pi pi-youtube",
    ariaLabel: "YouTube",
    onClick: () => useOpenUrl(youtube),
  },
];
</script>

<style lang="scss" scoped>
.p-toolbar {
  padding: 5vh;
  border: none;
  background: none;

  @media (max-width: 1080px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .center {
    display: flex;
    gap: 1rem;
  }

  a {
    text-decoration: none;
  }
}
</style>
