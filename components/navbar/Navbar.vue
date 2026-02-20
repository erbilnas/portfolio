<script lang="ts" setup>
import NavbarDesktop from "./NavbarDesktop.vue";
import NavbarMobile from "./NavbarMobile.vue";
import NavbarSettingsDialog from "./NavbarSettingsDialog.vue";
import {
  useNavbarNavigation,
  useNavbarScroll,
  useNavbarMobile,
  useNavbarSettings,
} from "@/composables/navbar";

const { navigationItems, scrollToSection } = useNavbarNavigation();
const { navbarVisible, isMobile, setupScrollListeners } = useNavbarScroll();
const {
  mobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
  handleNavItemClick,
} = useNavbarMobile();
const {
  settingsDialogOpen,
  cursorDisabled,
  theme,
  reducedMotion,
  fontSize,
  fontFamily,
  disableCardHoverEffects,
  analyticsEnabled,
  highContrast,
  languageSwitchToastEnabled,
  initializeSettings,
  openSettingsDialog,
  setLightTheme,
  setDarkTheme,
  setSystemTheme,
  handleToggleCursor,
  handleToggleReducedMotion,
  handleSetFontSize,
  handleSetFontFamily,
  handleToggleCardHoverEffects,
  handleToggleAnalytics,
  handleToggleHighContrast,
  handleToggleLanguageSwitchToast,
  handleResetToDefaults,
} = useNavbarSettings();

// Update navigation items to include settings action
const navigationItemsWithSettings = computed(() => {
  return navigationItems.value.map((item) => {
    if (item.id === "settings") {
      return {
        ...item,
        action: openSettingsDialog,
      };
    }
    return item;
  });
});

// Setup scroll listeners on mount
let cleanupScrollListeners: (() => void) | null = null;

onMounted(() => {
  initializeSettings();
  cleanupScrollListeners = setupScrollListeners();
});

onUnmounted(() => {
  if (cleanupScrollListeners) {
    cleanupScrollListeners();
  }
});
</script>

<template>
  <!-- Desktop Navigation -->
  <NavbarDesktop
    v-if="!isMobile"
    :navigation-items="navigationItemsWithSettings"
  />

  <!-- Mobile Navigation -->
  <NavbarMobile
    v-if="isMobile"
    :navigation-items="navigationItemsWithSettings"
    :navbar-visible="navbarVisible"
    :mobile-menu-open="mobileMenuOpen"
    @toggle-menu="toggleMobileMenu"
    @nav-item-click="handleNavItemClick"
    @overlay-click="closeMobileMenu"
  />

  <!-- Settings Dialog -->
  <NavbarSettingsDialog
    v-model:open="settingsDialogOpen"
    :cursor-disabled="cursorDisabled"
    :theme="theme"
    :reduced-motion="reducedMotion"
    :font-size="fontSize"
    :font-family="fontFamily"
    :disable-card-hover-effects="disableCardHoverEffects"
    :analytics-enabled="analyticsEnabled"
    :high-contrast="highContrast"
    :language-switch-toast-enabled="languageSwitchToastEnabled"
    :on-toggle-cursor="handleToggleCursor"
    :on-set-light-theme="setLightTheme"
    :on-set-dark-theme="setDarkTheme"
    :on-set-system-theme="setSystemTheme"
    :on-toggle-reduced-motion="handleToggleReducedMotion"
    :on-set-font-size="handleSetFontSize"
    :on-set-font-family="handleSetFontFamily"
    :on-toggle-card-hover-effects="handleToggleCardHoverEffects"
    :on-toggle-analytics="handleToggleAnalytics"
    :on-toggle-high-contrast="handleToggleHighContrast"
    :on-toggle-language-switch-toast="handleToggleLanguageSwitchToast"
    :on-reset-to-defaults="handleResetToDefaults"
  />
</template>

