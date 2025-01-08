import { useMediaQuery } from "@vueuse/core";
import { ref } from "vue";

export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
  icon?: string;
  positions?: {
    title: string;
    duration: string;
  }[];
}

export function useExperience() {
  const experiences: WorkExperience[] = [
    {
      company: "Company A",
      position: "Senior Frontend Developer",
      period: "2022 - Present",
      location: "Remote",
      description: [
        "Led development of mission-critical web applications using Vue 3 and Nuxt 3",
        "Implemented robust state management solutions with Pinia",
        "Mentored junior developers and conducted code reviews",
      ],
      technologies: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS"],
      icon: "simple-icons:vuedotjs",
      positions: [
        {
          title: "Lead Frontend Developer",
          duration: "Jan 2023 - Present",
        },
        {
          title: "Senior Frontend Developer",
          duration: "Jun 2022 - Dec 2022",
        },
      ],
    },
    {
      company: "Company B",
      position: "Full Stack Developer",
      period: "2020 - 2022",
      location: "Berlin, Germany",
      description: [
        "Developed and maintained multiple client projects",
        "Implemented RESTful APIs using Node.js and Express",
        "Optimized application performance and reduced load times by 40%",
      ],
      technologies: ["Node.js", "Express.js", "MongoDB", "Vue.js"],
      icon: "simple-icons:nodedotjs",
    },
    {
      company: "Company C",
      position: "Frontend Developer",
      period: "2018 - 2020",
      location: "Remote",
      description: ["Developed and maintained multiple client projects"],
      technologies: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS"],
      icon: "simple-icons:vuedotjs",
    },
    {
      company: "Company D",
      position: "Frontend Developer",
      period: "2018 - 2020",
      location: "Remote",
      description: ["Developed and maintained multiple client projects"],
      technologies: ["Vue.js", "Nuxt.js", "TypeScript", "Tailwind CSS"],
      icon: "simple-icons:vuedotjs",
    },
  ];

  const currentIndex = ref(0);
  const maxIndex = experiences.length - 1;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const goToPrevious = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };

  const goToNext = () => {
    if (currentIndex.value < maxIndex) {
      currentIndex.value++;
    }
  };

  const setIndex = (index: number) => {
    if (index >= 0 && index <= maxIndex) {
      currentIndex.value = index;
    }
  };

  // Calculate transform styles for each card
  const getCardStyle = (index: number) => {
    const diff = index - currentIndex.value;
    const scale =
      index === currentIndex.value ? 1 : 0.95 - Math.abs(diff) * 0.05;
    const opacity =
      index === currentIndex.value ? 1 : 0.7 - Math.abs(diff) * 0.2;
    const zIndex = maxIndex - Math.abs(diff);
    const translateX = diff * 60; // Main offset for horizontal stacking
    const translateY = Math.abs(diff) * 10; // Slight vertical offset for depth
    const rotateY = diff * -5; // Rotation for perspective
    const rotateZ = diff * -2; // Slight rotation for depth
    const perspective = 2000;

    return {
      transform: `perspective(${perspective}px) translateX(${translateX}px) translateY(${translateY}px) scale(${scale}) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
      opacity,
      zIndex,
      filter:
        index === currentIndex.value ? "none" : "brightness(0.7) blur(1px)",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  };

  return {
    experiences,
    currentIndex,
    maxIndex,
    isMobile,
    goToPrevious,
    goToNext,
    setIndex,
    getCardStyle,
  };
}
