import type {
  NavigationItem,
  NavbarSection,
} from "@/components/navbar/navbar.types";
import { useNavbarVibesPreview } from "./use-navbar-vibes-preview";
import {
  isVibeType,
  useVibeQuery,
} from "~/composables/current-vibes/vibe-query";

const INSTANT_SCROLL_CLASS = "navbar-instant-scroll";
/** How close to scroll-margin counts as aligned (px). */
const ALIGN_TOLERANCE_PX = 12;
/** Keep correcting while lazy sections expand after a long hop. */
const SETTLE_MAX_MS = 1200;
const SETTLE_STABLE_MS = 120;

/**
 * `html { scroll-behavior: smooth }` makes JS `behavior: "auto"` still animate.
 * Toggle a class with `scroll-behavior: auto !important` for real instant jumps.
 */
function setInstantScrollMode(on: boolean) {
  document.documentElement.classList.toggle(INSTANT_SCROLL_CLASS, on);
}

function scrollMarginTopPx(element: HTMLElement) {
  const raw = getComputedStyle(element).scrollMarginTop;
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : 0;
}

function scrollToElement(element: HTMLElement, instant: boolean) {
  if (!instant) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  setInstantScrollMode(true);
  const top =
    element.getBoundingClientRect().top +
    window.scrollY -
    scrollMarginTopPx(element);
  window.scrollTo({ top, behavior: "instant" });
}

function isAligned(element: HTMLElement) {
  const expected = scrollMarginTopPx(element);
  return Math.abs(element.getBoundingClientRect().top - expected) <= ALIGN_TOLERANCE_PX;
}

/**
 * Re-scroll until the target stops drifting (lazy hydration grows sections above).
 */
function settleOnElement(element: HTMLElement, onSettled: () => void) {
  const startedAt = performance.now();
  let stableSince: number | null = null;

  const tick = () => {
    if (!document.documentElement.contains(element)) {
      setInstantScrollMode(false);
      onSettled();
      return;
    }

    if (!isAligned(element)) {
      stableSince = null;
      scrollToElement(element, true);
    } else if (stableSince === null) {
      stableSince = performance.now();
    }

    const now = performance.now();
    const stableLongEnough =
      stableSince !== null && now - stableSince >= SETTLE_STABLE_MS;
    const timedOut = now - startedAt >= SETTLE_MAX_MS;

    if (stableLongEnough || timedOut) {
      if (!isAligned(element)) {
        scrollToElement(element, true);
      }
      setInstantScrollMode(false);
      onSettled();
      return;
    }

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

export const useNavbarNavigation = () => {
  const { preview } = useNavbarVibesPreview();
  const { setVibe } = useVibeQuery();

  const scrollToSection = (
    sectionId: NavbarSection,
    onDone?: () => void,
  ) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      onDone?.();
    };

    const performScroll = () => {
      const element = document.getElementById(sectionId);
      if (!element) {
        return false;
      }

      const distance = Math.abs(element.getBoundingClientRect().top);
      const instant = distance > window.innerHeight * 0.75;

      if (!instant && "onscrollend" in window) {
        const onScrollEnd = () => {
          window.clearTimeout(safetyTimer);
          finish();
        };
        window.addEventListener("scrollend", onScrollEnd, { once: true });
        const safetyTimer = window.setTimeout(() => {
          window.removeEventListener("scrollend", onScrollEnd);
          finish();
        }, 1200);
        scrollToElement(element, false);
        return true;
      }

      if (!instant) {
        scrollToElement(element, false);
        requestAnimationFrame(() => requestAnimationFrame(finish));
        return true;
      }

      scrollToElement(element, true);
      settleOnElement(element, finish);
      return true;
    };

    if (performScroll()) {
      return;
    }

    nextTick(() => {
      if (performScroll()) {
        return;
      }

      let retryCount = 0;
      const maxRetries = 20;
      const retryScroll = window.setInterval(() => {
        retryCount++;
        if (performScroll() || retryCount >= maxRetries) {
          window.clearInterval(retryScroll);
          if (retryCount >= maxRetries) {
            finish();
          }
        }
      }, 100);
    });
  };

  const { t } = useI18n();

  const navigationItems = computed<NavigationItem[]>(() => [
    {
      id: "welcome",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.House),
      ),
      label: t("nav.welcome"),
      action: () => scrollToSection("welcome"),
    },
    {
      id: "about-me",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.UserRound),
      ),
      label: t("nav.aboutMe"),
      action: () => scrollToSection("about-me"),
    },
    {
      id: "projects",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.AppWindow),
      ),
      label: t("nav.projects"),
      action: () => scrollToSection("projects"),
    },
    {
      id: "skills",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.Layers),
      ),
      label: t("nav.skills"),
      action: () => scrollToSection("skills"),
    },
    {
      id: "experience",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.BriefcaseBusiness),
      ),
      label: t("nav.experience"),
      action: () => scrollToSection("experience"),
    },
    {
      id: "current-vibes",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.AudioLines),
      ),
      label: t("nav.currentVibes"),
      action: () => {
        const kind = preview.value?.kind;
        // Scroll first; only then write ?vibe= so router.replace cannot
        // cancel the jump. Settle waits for lazy sections above to finish growing.
        scrollToSection("current-vibes", () => {
          if (isVibeType(kind)) {
            void setVibe(kind);
          }
        });
      },
    },
    {
      id: "guestbook",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.BookOpen),
      ),
      label: t("nav.guestbook"),
      action: () => scrollToSection("guestbook"),
    },
    {
      id: "resume",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.FileUser),
      ),
      label: t("nav.resume"),
      action: () => useResumeDrawer().openResumeDrawer(),
    },
    {
      id: "settings",
      icon: defineAsyncComponent(() =>
        import("lucide-vue-next").then((m) => m.SlidersHorizontal),
      ),
      label: t("nav.settings"),
      badge: false,
      action: () => {
        // Handled by parent
      },
    },
  ]);

  return {
    navigationItems,
    scrollToSection,
  };
};
