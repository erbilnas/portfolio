import type { NavigationItem, NavbarSection } from "@/components/navbar/navbar.types";
import { useNavbarVibesPreview } from "./use-navbar-vibes-preview";
import { isVibeType, useVibeQuery } from "~/composables/current-vibes/vibe-query";

export const useNavbarNavigation = () => {
  const { preview } = useNavbarVibesPreview();
  const { setVibe } = useVibeQuery();

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

  const { t } = useI18n();
  
  const navigationItems = computed<NavigationItem[]>(() => [
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.House)
      ),
      label: t("nav.welcome"),
      action: () => scrollToSection("welcome"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.UserRound)
      ),
      label: t("nav.aboutMe"),
      action: () => scrollToSection("about-me"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.AppWindow)
      ),
      label: t("nav.projects"),
      action: () => scrollToSection("projects"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.Layers)
      ),
      label: t("nav.skills"),
      action: () => scrollToSection("skills"),
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.BriefcaseBusiness)
      ),
      label: t("nav.experience"),
      action: () => scrollToSection("experience"),
    },
    {
      id: "current-vibes",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.AudioLines)
      ),
      label: t("nav.currentVibes"),
      action: () => {
        const kind = preview.value?.kind;
        if (isVibeType(kind)) {
          setVibe(kind, { withHash: true });
        }
        scrollToSection("current-vibes");
      },
    },
    {
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.BookOpen)
      ),
      label: t("nav.guestbook"),
      action: () => scrollToSection("guestbook"),
    },
    {
      id: "resume",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.FileUser)
      ),
      label: t("nav.resume"),
      action: () => useResumeDrawer().openResumeDrawer(),
    },
    {
      id: "settings",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.SlidersHorizontal)
      ),
      label: t("nav.settings"),
      badge: false,
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

