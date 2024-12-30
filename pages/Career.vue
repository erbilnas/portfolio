<template>
  <div class="career">
    <SelectButton
      class="career__switch-type"
      v-model="careerType"
      :options="careerTypes"
      :allow-empty="false"
      @change="
        (e) => {
          careerType = e.value;
        }
      "
    />

    <ExperienceTimeline v-if="isCareerTypeExperience" />

    <EducationTimeline v-else />
  </div>
</template>

<script lang="ts" setup>
const CAREER_TYPE = {
  EXPERIENCE: "Experience",
  EDUCATION: "Education",
};

const careerTypes = ref(["Experience", "Education"]);
const careerType = ref(CAREER_TYPE.EXPERIENCE);

const isCareerTypeExperience = computed(
  () => careerType.value === CAREER_TYPE.EXPERIENCE
);

function handleMouseMove(e: MouseEvent) {
  const cards = document.querySelectorAll(".p-card");

  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
    (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
  });
}

onMounted(() => {
  document.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove);
});

useHead({
  title: "Career | It's me, Erbil",
});
</script>

<style lang="scss" scoped>
@import "/assets/animation.scss";

.career {
  display: flex;
  flex-direction: column;
  gap: 4rem;

  &__switch-type {
    display: flex;
    justify-content: center;
  }

  :deep(.p-card) {
    transition: all 0.3s ease;
    position: relative;
    border: 1px solid transparent;
    background-clip: padding-box;

    &::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      padding: 1px;
      background: radial-gradient(
        800px circle at var(--mouse-x) var(--mouse-y),
        var(--primary-color),
        transparent 40%
      );
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }
  }

  animation: fadeIn 0.5s;
}
</style>
