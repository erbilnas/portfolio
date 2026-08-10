<script lang="ts" setup>
import { useI18n } from "#imports";
import LiquidGlass from "@/components/ui/liquid-glass/LiquidGlass.vue";
import { useNavbarVibesPreview } from "@/composables/navbar";
import { useSettings } from "@/composables/settings";
import NavbarVibesDockMark from "./NavbarVibesDockMark.vue";
import NavbarVibesPreviewBlock from "./NavbarVibesPreviewBlock.vue";
import type { NavigationItem } from "./navbar.types";

interface Props {
  navigationItems: NavigationItem[];
  navbarVisible: boolean;
  mobileMenuOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  toggleMenu: [];
  navItemClick: [action: () => void];
  overlayClick: [];
}>();

const { t } = useI18n();
const { preview: vibesPreview } = useNavbarVibesPreview();
const { reducedMotion } = useSettings();

const getAriaLabel = (item: NavigationItem) => {
  if (item.id === "current-vibes" && vibesPreview.value) {
    const live = vibesPreview.value.isLive ? `${t("nav.vibesLive")}: ` : "";
    return `${item.label}: ${live}${vibesPreview.value.category} ${vibesPreview.value.title}`;
  }
  return item.label;
};
</script>

<template>
  <!-- Mobile Hamburger Button -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="translate-y-[calc(100%+2rem)] opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-[calc(100%+2rem)] opacity-0"
  >
    <LiquidGlass
      v-if="navbarVisible || mobileMenuOpen"
      :radius="20"
      container-class="fixed bottom-4 right-4 z-[60]"
      class="flex items-center justify-center rounded-2xl p-3 transition-all backdrop-blur-xl bg-white/80 dark:bg-black/80 border border-gray-200/50 dark:border-gray-800/50"
    >
      <button
        @click.stop="emit('toggleMenu')"
        class="relative flex flex-col items-center justify-center w-6 h-6 gap-1.5 focus:outline-none text-foreground"
        aria-label="Toggle menu"
      >
        <span
          :class="[
            'block h-0.5 w-6 bg-current transition-all duration-300 origin-center',
            mobileMenuOpen ? 'rotate-45 translate-y-2' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.5 w-6 bg-current transition-all duration-300',
            mobileMenuOpen ? 'opacity-0' : '',
          ]"
        />
        <span
          :class="[
            'block h-0.5 w-6 bg-current transition-all duration-300 origin-center',
            mobileMenuOpen ? '-rotate-45 -translate-y-2' : '',
          ]"
        />
        <NavbarVibesDockMark
          v-if="vibesPreview && !mobileMenuOpen"
          :preview="vibesPreview"
          size="md"
        />
      </button>
    </LiquidGlass>
  </Transition>

  <!-- Mobile Menu Overlay -->
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click.stop="emit('overlayClick')"
    />
  </Transition>

  <!-- Mobile Menu Drawer -->
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    leave-active-class="transition-transform duration-300 ease-in"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <LiquidGlass
      v-if="mobileMenuOpen"
      :radius="20"
      container-class="fixed bottom-0 left-0 right-0 z-50"
      class="rounded-t-3xl rounded-b-none p-6 pb-8 backdrop-blur-xl bg-white/90 dark:bg-black/90 border-t border-x border-gray-200/50 dark:border-gray-800/50"
      @click.stop
    >
      <nav class="flex flex-col gap-4">
        <button
          v-for="item in navigationItems"
          :key="item.label"
          type="button"
          @click.stop="emit('navItemClick', item.action)"
          :aria-label="getAriaLabel(item)"
          class="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-left active:scale-[0.96]"
        >
          <div class="relative flex-shrink-0">
            <component :is="item.icon" class="size-6" />
            <span
              v-if="item.badge"
              class="absolute -top-0.5 -right-0.5 flex h-3 w-3 rounded-full bg-primary border-2 border-background animate-pulse shadow-lg"
            />
            <NavbarVibesDockMark
              v-else-if="item.id === 'current-vibes' && vibesPreview"
              :preview="vibesPreview"
            />
          </div>
          <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <span class="text-base font-medium">{{ item.label }}</span>
            <span
              v-if="item.id === 'settings'"
              class="text-xs text-muted-foreground"
            >
              {{ t("nav.multipleLanguagesSupported") }}
            </span>
            <Transition
              mode="out-in"
              :enter-active-class="
                reducedMotion ? '' : 'transition duration-200 ease-out'
              "
              :enter-from-class="
                reducedMotion ? '' : 'opacity-0 translate-y-1'
              "
              :enter-to-class="
                reducedMotion ? '' : 'opacity-100 translate-y-0'
              "
              :leave-active-class="
                reducedMotion ? '' : 'transition duration-150 ease-in'
              "
              :leave-from-class="
                reducedMotion ? '' : 'opacity-100 translate-y-0'
              "
              :leave-to-class="
                reducedMotion ? '' : 'opacity-0 -translate-y-0.5'
              "
            >
              <NavbarVibesPreviewBlock
                v-if="item.id === 'current-vibes' && vibesPreview"
                :key="`${vibesPreview.kind}-${vibesPreview.title}`"
                :preview="vibesPreview"
                compact
              />
            </Transition>
          </div>
        </button>
      </nav>
    </LiquidGlass>
  </Transition>
</template>
