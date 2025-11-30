import { useConfetti } from "@/composables/confetti";
import { useMediaQuery } from "@/composables/use-media-query-client";

export const useNavbarScroll = () => {
  const { fireConfetti } = useConfetti();
  const hasTriggeredConfetti = ref(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navbarVisible = ref(true);
  const lastScrollY = ref(0);

  const checkScrollPosition = () => {
    // Only check if confetti hasn't been triggered yet
    if (hasTriggeredConfetti.value) return;

    const footerElement = document.getElementById("footer");
    if (!footerElement) return;

    // Check if user has scrolled to the very bottom of the page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Only trigger when user is at the absolute bottom (within 5px tolerance)
    const isAtBottom = scrollTop + windowHeight >= documentHeight - 5;

    // Also verify footer is visible in viewport
    const footerRect = footerElement.getBoundingClientRect();
    const isFooterVisible =
      footerRect.top < windowHeight && footerRect.bottom > 0;

    // Only trigger when footer is visible AND user has reached the absolute bottom
    if (isAtBottom && isFooterVisible) {
      hasTriggeredConfetti.value = true;
      fireConfetti();
    }
  };

  const handleScrollDirection = () => {
    // Only apply scroll-based visibility on mobile
    if (!isMobile.value) {
      navbarVisible.value = true;
      return;
    }

    const currentScrollY =
      window.pageYOffset || document.documentElement.scrollTop;

    // Show navbar when scrolling up, hide when scrolling down
    // Also show at the top of the page
    if (currentScrollY < lastScrollY.value || currentScrollY < 10) {
      navbarVisible.value = true;
    } else if (currentScrollY > lastScrollY.value) {
      navbarVisible.value = false;
    }

    lastScrollY.value = currentScrollY;
  };

  const setupScrollListeners = () => {
    lastScrollY.value = window.pageYOffset || document.documentElement.scrollTop;

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkScrollPosition();
          handleScrollDirection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  };

  return {
    navbarVisible,
    isMobile,
    setupScrollListeners,
  };
};

