export const useNavbarMobile = () => {
  const mobileMenuOpen = ref(false);

  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen.value = false;
  };

  const handleNavItemClick = (action: () => void) => {
    action();
    closeMobileMenu();
  };

  // Prevent body scroll when mobile menu is open
  watch(mobileMenuOpen, (isOpen) => {
    if (process.client) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  });

  // Reset body overflow on unmount
  onUnmounted(() => {
    if (process.client) {
      document.body.style.overflow = "";
    }
  });

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    handleNavItemClick,
  };
};

