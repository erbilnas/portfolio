<script lang="ts" setup>
import NavbarDesktop from "./NavbarDesktop.vue";
import NavbarMobile from "./NavbarMobile.vue";
import NavbarSettingsDrawer from "./NavbarSettingsDrawer.vue";
import ResumeDrawer from "@/components/ResumeDrawer.vue";
import {
  useNavbarNavigation,
  useNavbarScroll,
  useNavbarMobile,
  useNavbarSettings,
} from "@/composables/navbar";

const { navigationItems } = useNavbarNavigation();
const { navbarVisible, isMobile, setupScrollListeners } = useNavbarScroll();
const {
  mobileMenuOpen,
  toggleMobileMenu,
  closeMobileMenu,
  handleNavItemClick,
} = useNavbarMobile();
const {
  settingsDrawerOpen,
  cursorDisabled,
  theme,
  reducedMotion,
  fontSize,
  fontFamily,
  highContrast,
  languageSwitchToastEnabled,
  initializeSettings,
  openSettingsDrawer,
  setLightTheme,
  setDarkTheme,
  setSystemTheme,
  handleToggleCursor,
  handleToggleReducedMotion,
  handleSetFontSize,
  handleSetFontFamily,
  handleToggleHighContrast,
  handleToggleLanguageSwitchToast,
  handleResetToDefaults,
} = useNavbarSettings();

const navigationItemsWithSettings = computed(() => {
  return navigationItems.value.map((item) => {
    if (item.id === "settings") {
      return {
        ...item,
        action: openSettingsDrawer,
      };
    }
    return item;
  });
});

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
  <NavbarDesktop
    v-if="!isMobile"
    :navigation-items="navigationItemsWithSettings"
  />

  <NavbarMobile
    v-if="isMobile"
    :navigation-items="navigationItemsWithSettings"
    :navbar-visible="navbarVisible"
    :mobile-menu-open="mobileMenuOpen"
    @toggle-menu="toggleMobileMenu"
    @nav-item-click="handleNavItemClick"
    @overlay-click="closeMobileMenu"
  />

  <NavbarSettingsDrawer
    v-model:open="settingsDrawerOpen"
    :cursor-disabled="cursorDisabled"
    :theme="theme"
    :reduced-motion="reducedMotion"
    :font-size="fontSize"
    :font-family="fontFamily"
    :high-contrast="highContrast"
    :language-switch-toast-enabled="languageSwitchToastEnabled"
    :on-toggle-cursor="handleToggleCursor"
    :on-set-light-theme="setLightTheme"
    :on-set-dark-theme="setDarkTheme"
    :on-set-system-theme="setSystemTheme"
    :on-toggle-reduced-motion="handleToggleReducedMotion"
    :on-set-font-size="handleSetFontSize"
    :on-set-font-family="handleSetFontFamily"
    :on-toggle-high-contrast="handleToggleHighContrast"
    :on-toggle-language-switch-toast="handleToggleLanguageSwitchToast"
    :on-reset-to-defaults="handleResetToDefaults"
  />

  <ResumeDrawer />
</template>
