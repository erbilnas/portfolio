<script lang="ts" setup>
import {
  BriefcaseBusinessIcon,
  DoorOpenIcon,
  HandIcon,
  PartyPopperIcon,
  UserIcon,
} from "lucide-vue-next";

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
    icon: PartyPopperIcon,
    label: "Current Vibes",
    action: () => scrollToSection("current-vibes"),
  },
  {
    icon: BriefcaseBusinessIcon,
    label: "Career",
    action: () => scrollToSection("career"),
  },
  {
    icon: DoorOpenIcon,
    label: "The End",
    action: () => scrollToSection("the-end"),
  },
  // {
  //   icon: SunIcon,
  //   label: "Change Theme",
  //   soon: true,
  // },
]);

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
</script>

<template>
  <div class="fixed bottom-8 left-0 right-0">
    <Dock :magnification="20" :distance="20">
      <TooltipProvider>
        <Tooltip v-for="item in menuItems" :key="item.label">
          <TooltipTrigger>
            <DockIcon @click="item.action">
              <div class="relative">
                <component :is="item.icon" class="size-6" />
              </div>
            </DockIcon>
          </TooltipTrigger>
          <TooltipContent>
            <div class="flex items-center gap-2">
              <p>{{ item.label }}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Dock>
  </div>
</template>
