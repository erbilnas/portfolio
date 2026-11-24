<script lang="ts" setup>
import Welcome from "./welcome";

const AboutMe = defineAsyncComponent(() => import("./about-me"));

const Projects = defineLazyHydrationComponent(
  "visible",
  () => import("./projects"),
);
const Skills = defineLazyHydrationComponent(
  "visible",
  () => import("./skills"),
);
const Experience = defineLazyHydrationComponent(
  "visible",
  () => import("./experience"),
);
const CurrentVibes = defineLazyHydrationComponent(
  "visible",
  () => import("./current-vibes"),
);
const Guestbook = defineLazyHydrationComponent(
  "visible",
  () => import("./guestbook"),
);
const FooterComponent = defineLazyHydrationComponent(
  "visible",
  () => import("./footer"),
);

const { title, description } = useSectionSeo();

useSeoMeta({
  title: () => title.value,
  description: () => description.value,
});
useHead({
  meta: [
    {
      name: "keywords",
      content:
        "Erbil Nas, Software Engineer, Web Development, Full Stack Developer, Portfolio, Video Games, Technology, Writing, Frontend Developer, Digital Showcase, Personal Website",
    },
  ],
});
</script>

<template>
  <Welcome />
  <AboutMe />
  <!-- rootMargin: hydrate before scroll so section CSS/JS are ready near fold -->
  <Projects :hydrate-on-visible="{ rootMargin: '320px 0px' }" />
  <Skills :hydrate-on-visible="{ rootMargin: '240px 0px' }" />
  <Experience :hydrate-on-visible="{ rootMargin: '240px 0px' }" />
  <CurrentVibes :hydrate-on-visible="{ rootMargin: '480px 0px' }" />
  <Guestbook :hydrate-on-visible="{ rootMargin: '160px 0px' }" />
  <FooterComponent :hydrate-on-visible="{ rootMargin: '120px 0px' }" />
</template>
