<template>
  <Sidebar :visible="store.sidebarVisible" :position="isMobile ? 'full' : 'right'"
    :pt="{ root: { style: { 'width': '35vw' } } }" :draggable="false">
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button icon="pi pi-times" text rounded aria-label="Cancel" @click="store.sidebarVisible = false" />
    </template>

    <Fieldset legend="About Me">
      <span>
        I don’t know how to start introducing myself. I can briefly say that I’m an always-learner software engineer
        who
        wants to build his future with zeros and ones. I’m 27 years old and I’ve been living in Turkey since I was born,
        which makes me a Turk naturally. Anyway, let me tell you a little bit of my physical appearance. I’ve got a
        normal
        height and slightly weaker weight than usual. Usually, I’m getting around with short hair and a beard. If it’s a
        sunny day, you’ll see me wearing sunglasses because I’ve got an issue in my eyes. Those damn sun rays, I hate
        them.
      </span>

      <p class="m-0">
        I have loved computer technologies, softwares, and of course, video games since my childhood. Perhaps, this is
        the
        biggest reason I chose the profession in software engineering today. (Yeah, definitely it is 🙂) There is no
        doubt, I’m not an extremely social person because in general I’m not a talkative fellow. But there is an
        exception. If there are people I love or is something I can talk about, I can be a chatty guy ^_^
      </p>

      <p class="m-0">
        Well, what’s happening in my inner world? Let’s take a quick look at what’s going on over there. Intelligent,
        sophisticated, cultured, dignified, gentle, calm, and humble. These are some words that other people say about
        me.
        Mostly they’re saying positive based words about me. I think I’m a good fellow 😅. But I don’t care so much
        about
        whether I’m good or bad. I’m just trying to do the right thing, not the good one. That’s my lifelong goal and
        source of my motivation. I tried to introduce myself to you because I wanted that. It’s a little selfish, isn’t
        it? I hope I succeeded. Take safe care of yourself and have fun. Farewell!
      </p>
    </Fieldset>
  </Sidebar>
</template>

<script lang="ts" setup>
const store = useDefaultStore()

const isMobile = ref(false)

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true
  }
})
</script>

<style></style>