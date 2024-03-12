<template>
  <div class="workplaces" v-if="!isLoading">
    <div v-if="isMobile" class="workplaces__mobile-timeline">
      <Card v-for="(workplace, index) in workplaces" :key="index">
        <template #title>
          {{ workplace.name }}
        </template>
        <template #subtitle>
          {{ workplace.title }}
        </template>
        <template #content>
          {{ workplace.range }}

          <p>
            <small>
              {{ workplace.description }}
            </small>
          </p>
        </template>
      </Card>
    </div>

    <Timeline v-else :value="workplaces" align="alternate">
      <template #marker="slotProps">
        {{ slotProps.index % 2 === 0 ? ">" : "<" }}
      </template>

      <template #content="slotProps">
        <Card>
          <template #title>
            {{ slotProps.item.name }}
          </template>
          <template #subtitle>
            {{ slotProps.item.title }}
          </template>
          <template #content>
            {{ slotProps.item.range }}

            <p>
              <small>
                {{ slotProps.item.description }}
              </small>
            </p>
          </template>
        </Card>
      </template>
    </Timeline>

    <ScrollTop />
  </div>

  <Skeleton v-else height="60vh" />
</template>

<script lang="ts" setup>
const workplaces = ref([
  {
    name: "Trendyol Group",
    title: "Software Engineer",
    range: "Jul 2022 - Present",
    description:
      "We were founded in 2010 with a dynamic and agile start-up spirit. Since then, we have grown into a decacorn, backed by Alibaba, General Atlantic, Softbank, Princeville Capital, and several sovereign wealth funds. We believe that technology is the driver; e- commerce is the outcome. Thanks to our dedicated team, we are one of the top five e - commerce companies in EMEA and one of the fastest - growing e - commerce companies in the world! We deliver more than 1.5 million packages every day across 27 countries.",
  },
  {
    name: "Trendyol Group",
    title: "Associate Software Engineer",
    range: "Jul 2021 - Jul 2022",
    description:
      "We were founded in 2010 with a dynamic and agile start-up spirit. Since then, we have grown into a decacorn, backed by Alibaba, General Atlantic, Softbank, Princeville Capital, and several sovereign wealth funds. We believe that technology is the driver; e- commerce is the outcome. Thanks to our dedicated team, we are one of the top five e - commerce companies in EMEA and one of the fastest - growing e - commerce companies in the world! We deliver more than 1.5 million packages every day across 27 countries.",
  },
  {
    name: "MindBehind (acquired by Insider)",
    title: "Junior Software Engineer",
    range: "Oct 2019 - Jul 2021",
    description:
      "Our company first began its journey in 2014, under the name of Sor’un Information Technologies. As a business messaging platform striving to elevate the communication between customers and businesses all over the world, we set out to follow a global path and rebranded our company as MindBehind Information Technologies in 2016. Today, we’re thrilled to work with over 80 enterprises as an international conversation management company. With the aid of our interactive conversational solutions rooted in world-class AI technology, we now aspire to make MindBehind the common thread in facilitating high-quality customer service. In this path of achieving operational excellence, we are more than proud to have a dynamic team of over 70 talented and passionate members willing to take MindBehind to great heights.",
  },
  {
    name: "Yuxek Internet Technologies",
    title: "Web Application Developer",
    range: "Jun 2019 - Aug 2019",
    description:
      "Yuxek is a new generation design and software company that provides fast and reliable software solutions for your businesses, creates aesthetic and effective graphics.",
  },
  {
    name: "Freelancer",
    title: "Frontend Developer & UI/UX Designer",
    range: "Dec 2017 - Oct 2018",
    description: "",
  },
  {
    name: "Mikrodev Automation",
    title: "Internship",
    range: "Aug 2018 - Sep 2018",
    description:
      "Mikrodev has been developing and manufacturing industrial control products under its own brand since its establishment in 2006. We produce hardware and software products used in automation, telemetry, and SCADA systems, offering them to customers worldwide.",
  },
  {
    name: "Otokar",
    title: "Internship",
    range: "Jul 2017 - Aug 2017",
    description:
      "Otokar, one of the Koç Group companies, has been providing custom solutions tailored to the needs of its customers with its own technology, design, and applications since 1963. It operates with over 2000 employees in its factory located on a 552,000 m² area in Sakarya.",
  },
]);

const isMobile = ref(false);
const isLoading = ref(true);

onNuxtReady(() => {
  if (window.innerWidth <= 1366) {
    isMobile.value = true;
  }

  isLoading.value = false;
});
</script>

<style lang="scss" scoped>
.workplaces {
  &__mobile-timeline {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.p-card {
  cursor: default;
  transition: box-shadow 0.3s ease;
  border-color: var(--primary-color);
  border-style: solid;
  border-width: 0.1rem;
  flex: auto;

  &:hover {
    box-shadow: 0 0 0.5rem var(--primary-color);
    background: linear-gradient(
      45deg,
      var(--primary-color),
      var(--secondary-color)
    );
    transition: box-shadow 0.3s ease;
  }
}
</style>
