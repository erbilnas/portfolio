<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const AboutMe = defineAsyncComponent(() => import("./about-me"));
const Career = defineAsyncComponent(() => import("./career"));
const CurrentVibes = defineAsyncComponent(() => import("./current-vibes"));
const FooterComponent = defineAsyncComponent(() => import("./footer"));
const Welcome = defineAsyncComponent(() => import("./welcome"));

useHead({
  title: "Erbil Nas",
  meta: [
    {
      name: "description",
      content:
        "Welcome to my personal website. I am a Software Engineer passionate about creating innovative solutions and sharing knowledge.",
    },
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
  <Career />
  <CurrentVibes />
  <FooterComponent />
</template>
