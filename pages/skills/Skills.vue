<script setup lang="ts">
import { computed } from "vue";
import { BentoGridItem } from "~/components/ui/bento-grid";
import { Button } from "~/components/ui/button";
import { MorphingTabs } from "~/components/ui/morphing-tabs";
import { useMediaQuery } from "~/composables/use-media-query-client";
import { skillCategories } from "~/constants/career";
import type { Skill } from "~/types/career";

interface SkillWithCategory extends Skill {
  category: string;
  originalCategory: string;
}

const sectionRef = ref<HTMLElement | null>(null);
const carouselRef = ref<HTMLDivElement | null>(null);

const { observeSectionChange } = useObserver("Skills", sectionRef);
observeSectionChange();

const isMobile = useMediaQuery("(max-width: 768px)");

const normalizeCategoryName = (categoryName: string): string => {
  const mapping: Record<string, string> = {
    Favorites: "Favorites",
    "Frontend Development": "Frontend",
    "Backend Development": "Backend",
    DevOps: "DevOps",
    AI: "AI",
    Design: "Design",
    Languages: "Language",
  };
  return mapping[categoryName] || categoryName;
};

const allSkills = computed<SkillWithCategory[]>(() => {
  const skills: SkillWithCategory[] = [];

  skillCategories.forEach((category) => {
    category.skills.forEach((skill) => {
      skills.push({
        ...skill,
        category: normalizeCategoryName(category.name),
        originalCategory: category.name,
      });
    });
  });

  return skills;
});

const tabs = computed(() => {
  const categoryNames = skillCategories.map((cat) =>
    normalizeCategoryName(cat.name)
  );
  return categoryNames;
});

const activeTab = ref("Favorites");

const filteredSkills = computed<SkillWithCategory[]>(() => {
  return allSkills.value.filter((skill) => skill.category === activeTab.value);
});

// Carousel scroll functions
const scrollLeft = () => {
  if (carouselRef.value) {
    const scrollAmount = isMobile.value
      ? carouselRef.value.clientWidth * 0.8
      : 600;
    carouselRef.value.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (carouselRef.value) {
    const scrollAmount = isMobile.value
      ? carouselRef.value.clientWidth * 0.8
      : 600;
    carouselRef.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

const canScrollLeft = ref(false);
const canScrollRight = ref(true);

const checkScrollability = () => {
  if (carouselRef.value) {
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value;
    canScrollLeft.value = scrollLeft > 0;
    canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10;
  }
};

onMounted(() => {
  if (carouselRef.value) {
    carouselRef.value.addEventListener("scroll", checkScrollability);
    checkScrollability();
  }
});

onUnmounted(() => {
  if (carouselRef.value) {
    carouselRef.value.removeEventListener("scroll", checkScrollability);
  }
});

watch(activeTab, () => {
  if (carouselRef.value) {
    carouselRef.value.scrollTo({ left: 0, behavior: "smooth" });
    setTimeout(checkScrollability, 300);
  }
});
</script>

<template>
  <section id="skills" ref="sectionRef">
    <div
      class="overflow-hidden min-h-screen flex flex-col gap-12 py-20 items-center bg-white dark:bg-black px-6"
    >
      <div class="text-center mb-16">
        <h2 class="text-5xl md:text-7xl font-semibold tracking-tight">
          <span class="inline-block text-gray-900 dark:text-white">
            Skills
          </span>
        </h2>
        <p
          class="text-gray-600 dark:text-gray-400 mt-4 text-lg md:text-xl font-light animate-title-fade"
        >
          Technologies and tools I work with
        </p>
      </div>

      <!-- Mobile Tabs -->
      <div v-if="isMobile" class="flex justify-center items-center w-full">
        <div class="w-full max-w-2xl px-4">
          <div class="flex overflow-x-auto scrollbar-hide gap-2 py-2">
            <Button
              v-for="tab in tabs"
              :key="tab"
              @click="activeTab = tab"
              :class="[
                activeTab === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-background/30 text-muted-foreground hover:text-primary',
              ]"
            >
              {{ tab }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Desktop Tabs -->
      <div v-else class="flex justify-center items-center">
        <MorphingTabs
          :tabs="tabs"
          :active-tab="activeTab"
          @update:active-tab="activeTab = $event"
        />
      </div>

      <div class="w-full px-4 sm:px-6 lg:px-8 relative">
        <!-- Navigation Buttons -->
        <div class="hidden md:flex justify-end gap-2 mb-4">
          <button
            class="flex size-12 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            :disabled="!canScrollLeft"
            @click="scrollLeft"
          >
            <Icon
              name="tabler:arrow-narrow-left"
              class="size-5 text-gray-900 dark:text-gray-100"
            />
          </button>
          <button
            class="flex size-12 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md"
            :disabled="!canScrollRight"
            @click="scrollRight"
          >
            <Icon
              name="tabler:arrow-narrow-right"
              class="size-5 text-gray-900 dark:text-gray-100"
            />
          </button>
        </div>

        <!-- Carousel Container -->
        <div
          ref="carouselRef"
          class="flex overflow-x-auto overscroll-x-auto scroll-smooth snap-x snap-mandatory md:snap-none pb-4 scrollbar-hide"
        >
          <Transition
            mode="out-in"
            enter-active-class="transition ease-out duration-500"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-300"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <div :key="activeTab" class="flex gap-6 min-w-max">
              <BentoGridItem
                v-for="skill in filteredSkills"
                :key="`${skill.category}-${skill.name}`"
                class="p-6 space-y-3 w-[280px] md:w-[280px] flex-shrink-0 snap-start bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <template #icon>
                  <Icon
                    v-if="skill.icon"
                    :name="skill.icon"
                    class="size-6 text-primary"
                  />
                </template>
                <template #title>
                  {{ skill.name }}
                </template>
                <template #description>
                  {{ skill.description }}
                </template>
              </BentoGridItem>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>
