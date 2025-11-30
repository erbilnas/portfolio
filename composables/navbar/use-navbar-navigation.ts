import type { NavigationItem, NavbarSection } from "@/components/navbar/navbar.types";

export const useNavbarNavigation = () => {
  const scrollToSection = (sectionId: NavbarSection) => {
    // Function to perform the scroll
    const performScroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        // Get the element's position
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 20; // 20px offset for spacing

        // Smooth scroll to the element
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        return true;
      }
      return false;
    };

    // Try immediately
    if (performScroll()) {
      return;
    }

    // If not found, wait for next tick (for Vue reactivity)
    nextTick(() => {
      if (performScroll()) {
        return;
      }

      // If still not found, retry with increasing delays (for async components)
      let retryCount = 0;
      const maxRetries = 10;
      const retryInterval = 100;

      const retryScroll = setInterval(() => {
        if (performScroll() || retryCount >= maxRetries) {
          clearInterval(retryScroll);
        }
        retryCount++;
      }, retryInterval);
    });
  };

  const navigationItems = computed<NavigationItem[]>(() => [
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.HandIcon)
      ),
      label: "Welcome",
      action: () => scrollToSection("welcome"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.UserIcon)
      ),
      label: "About Me",
      action: () => scrollToSection("about-me"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.CodeIcon)
      ),
      label: "Skills",
      action: () => scrollToSection("skills"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.BriefcaseIcon)
      ),
      label: "Experience",
      action: () => scrollToSection("experience"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.FolderKanbanIcon)
      ),
      label: "Projects",
      action: () => scrollToSection("projects"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.FerrisWheelIcon)
      ),
      label: "Current Vibes",
      action: () => scrollToSection("current-vibes"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.SettingsIcon)
      ),
      label: "Settings",
      action: () => {
        // This will be handled by parent component
      },
    },
  ]);

  return {
    navigationItems,
    scrollToSection,
  };
};

