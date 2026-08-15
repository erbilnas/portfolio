<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const AboutMe = defineAsyncComponent(() => import("./about-me"));
const CurrentVibes = defineAsyncComponent(() => import("./current-vibes"));
const Guestbook = defineAsyncComponent(() => import("./guestbook"));
const Experience = defineAsyncComponent(() => import("./experience"));
const FooterComponent = defineAsyncComponent(() => import("./footer"));
const Projects = defineAsyncComponent(() => import("./projects"));
const Skills = defineAsyncComponent(() => import("./skills"));
const Welcome = defineAsyncComponent(() => import("./welcome"));

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
  <Projects />
  <Skills />
  <Experience />
  <CurrentVibes />
  <Guestbook />
  <FooterComponent />
</template>
