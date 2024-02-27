<template>
  <Sidebar :visible="store.sidebarVisible" :position="isMobile ? 'full' : 'left'" :pt="sidebarPt" :draggable="false">
    <template #header>
      <div />
    </template>

    <template #closeicon>
      <Button icon="pi pi-times" text rounded aria-label="Cancel" @click="store.sidebarVisible = false" />
    </template>

    <div class="panel">
      <Panel header="About Me" toggleable>
        <span>
          Introducing myself is always a challenge, but here's a brief glimpse
          into who I am: I'm a software engineer, constantly learning and
          passionate about building my future with zeros and ones. I'm
          {{ store.age }}
          years old, born and raised in Turkey.
        </span>

        <p>
          In terms of appearance, I'm of average height and slightly leaner than
          most. You'll usually find me sporting short hair and a beard, and on
          sunny days, I'll have sunglasses on due to an eye issue—those sun rays
          are no friend of mine.
        </p>

        <p>
          My love for computer technologies, software, and video games dates back
          to my childhood, which ultimately led me to pursue a career in software
          engineering. While I may not be the most social person, those close to
          me know that I can be quite chatty when discussing topics I'm passionate
          about. ^_^
        </p>

        <p>
          As for my inner world, others have described me as intelligent,
          sophisticated, cultured, dignified, gentle, calm, and humble. While I
          appreciate these positive qualities, I'm more focused on doing what's
          right rather than being perceived as good or bad.
        </p>

        <span>
          I hope this brief introduction gives you a glimpse into who I am. Thank
          you for taking the time to get to know me. Take care and stay safe!
        </span>
      </Panel>

      <Panel header="Statistics" toggleable collapsed>
        <KnobCollection />
      </Panel>
    </div>
  </Sidebar>
</template>

<script lang="ts" setup>
const store = useDefaultStore();

const isMobile = ref(false);

const sidebarPt = { root: { style: { width: "50vw" } } };

onMounted(() => {
  if (window.innerWidth <= 768) {
    isMobile.value = true;
  }
});
</script>

<style lang="scss" scoped>
.panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
