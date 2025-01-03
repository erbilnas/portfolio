<script lang="ts" setup>
import {
  BriefcaseBusinessIcon,
  DoorOpenIcon,
  HandIcon,
  JoystickIcon,
  UserIcon,
} from "lucide-vue-next";

// const colorMode = useColorMode();

const menuItems = computed(() => [
  {
    icon: HandIcon,
    label: "Welcome",
    action: () => scrollToSection("welcome"),
  },
  {
    icon: UserIcon,
    label: "About Me",
    action: () => scrollToSection("about-me"),
  },
  {
    icon: JoystickIcon,
    label: "Fun Facts",
    action: () => scrollToSection("fun-facts"),
  },
  {
    icon: BriefcaseBusinessIcon,
    label: "Career",
    action: () => scrollToSection("career"),
  },
  {
    icon: DoorOpenIcon,
    label: "Leave",
    action: () => scrollToSection("footer"),
  },
  // {
  //   icon: colorMode.preference === "dark" ? SunIcon : MoonIcon,
  //   label: "Change Theme",
  //   action: changeColorMode,
  // },
]);

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

// const changeColorMode = () => {
//   colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
// };
</script>

<template>
  <div class="fixed bottom-8 left-0 right-0">
    <Dock :magnification="20" :distance="20">
      <TooltipProvider>
        <Tooltip v-for="item in menuItems" :key="item.label">
          <TooltipTrigger>
            <DockIcon @click="item.action">
              <component :is="item.icon" class="size-6" />
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent>
            <p>{{ item.label }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dock>
  </div>
</template>
