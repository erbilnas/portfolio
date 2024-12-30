<template>
  <Card>
    <template #title>Erbil Nas</template>

    <template #subtitle>Senior Software Engineer</template>

    <template #content>
      <div class="content">
        <div>An ever-learning technology enthusiast.</div>
        <div>
          <Button
            v-for="({ icon, onClick, ariaLabel }, index) in socialMediaButtons"
            :key="index"
            :icon
            @click="onClick"
            :ariaLabel
            class="p-button-rounded p-button-text"
          />
        </div>
        <div>
          <small> {{ aboutMeWritingSummary }}</small>
        </div>
      </div>
    </template>

    <template #footer>
      <Panel header="Read More" toggleable collapsed>
        <small>{{ aboutMeWritingMoreContent }}</small>
      </Panel>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const store = useDefaultStore();
const { age } = toRefs(store);

const {
  profiles: {
    twitter,
    linkedin,
    github,
    instagram,
    steam,
    goodreads,
    medium,
    twitch,
    youtube,
  },
} = useAppConfig();

const aboutMeWriting = ref(
  `Introducing myself is always a challenge, but here's a brief glimpse into who I am: I'm a software engineer, constantly learning and passionate about building my future with zeros and ones. I'm ${age.value} years old, born and raised in Turkey. In terms of appearance, I'm of average height and slightly leaner than
    most. You'll usually find me sporting short hair and a beard, and on
    sunny days, I'll have sunglasses on due to an eye issue—those sun rays
    are no friend of mine. My love for computer technologies, software, and video games dates
    back to my childhood, which ultimately led me to pursue a career in
    software engineering. While I may not be the most social person, those
    close to me know that I can be quite chatty when discussing topics I'm
    passionate about. ^_^ As for my inner world, others have described me as intelligent,
    sophisticated, cultured, dignified, gentle, calm, and humble. While I
    appreciate these positive qualities, I'm more focused on doing what's
    right rather than being perceived as good or bad. I hope this brief introduction gives you a glimpse into who I am. Thank you for taking the time to get to know me. Take care and stay safe!`
);

const aboutMeWritingParagraphs = aboutMeWriting.value.split(".");

const aboutMeWritingSummary =
  aboutMeWritingParagraphs[0] + "." + aboutMeWritingParagraphs[1] + ".";

const aboutMeWritingMoreContent = aboutMeWritingParagraphs.slice(2).join("\n");

const socialMediaButtons = [
  {
    icon: "pi pi-twitter",
    ariaLabel: "Twitter",
    onClick: () => useOpenUrl(twitter),
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
    icon: "pi pi-github",
    ariaLabel: "GitHub",
    onClick: () => useOpenUrl(github),
  },
  {
    icon: "fa-brands fa-steam",
    ariaLabel: "Steam",
    onClick: () => useOpenUrl(steam),
  },
  {
    icon: "fa-brands fa-goodreads",
    ariaLabel: "Goodreads",
    onClick: () => useOpenUrl(goodreads),
  },
  {
    icon: "pi pi-twitch",
    ariaLabel: "Twitch",
    onClick: () => useOpenUrl(twitch),
  },
  {
    icon: "pi pi-youtube",
    ariaLabel: "YouTube",
    onClick: () => useOpenUrl(youtube),
  },
  {
    icon: "fa-brands fa-medium",
    ariaLabel: "Medium",
    onClick: () => useOpenUrl(medium),
  },
];
</script>

<style lang="scss" scoped>
.p-card {
  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .p-card-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
