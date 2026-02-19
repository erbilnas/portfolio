<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const AboutMe = defineAsyncComponent(() => import("./about-me"));
const CurrentVibes = defineAsyncComponent(() => import("./current-vibes"));
const Experience = defineAsyncComponent(() => import("./experience"));
const FooterComponent = defineAsyncComponent(() => import("./footer"));
const Projects = defineAsyncComponent(() => import("./projects"));
const Skills = defineAsyncComponent(() => import("./skills"));
const Welcome = defineAsyncComponent(() => import("./welcome"));

useSeoMeta({
  title: "Erbil Nas",
  description:
    "Welcome to my personal website. I am a Software Engineer passionate about creating innovative solutions and sharing knowledge.",
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
  <Skills />
  <Experience />
  <Projects />
  <CurrentVibes />
  <FooterComponent />
</template>
