<script lang="ts" setup>
import {
  BriefcaseBusinessIcon,
  DoorOpenIcon,
  HandIcon,
  JoystickIcon,
  PartyPopperIcon,
  UserIcon,
} from "lucide-vue-next";

import confetti from "canvas-confetti";

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
  {
    icon: PartyPopperIcon,
    label: "Confetti",
    action: () => handleConfetti(),
    badge: true,
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

const handleConfetti = () => {
  const duration = 5 * 1000; // 5 seconds
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  // Helper function to get a random value between a range
  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * (timeLeft / duration);

    // Confetti from left side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });

    // Confetti from right side
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
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
                <span
                  v-if="item.badge"
                  class="absolute -top-1 -right-1 flex h-2 min-w-2 items-center justify-center rounded-full bg-primary font-medium text-primary-foreground animate-pulse-ring"
                >
                  <span
                    class="absolute inset-0 rounded-full bg-primary animate-pulse"
                  ></span>
                </span>
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

<style scoped>
@keyframes pulse-ring {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(var(--primary) / 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgb(var(--primary) / 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgb(var(--primary) / 0);
  }
}

.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
