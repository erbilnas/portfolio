<script setup lang="ts">
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { onMounted, ref } from "vue";

const { t } = useI18n();

const AD_DETECTION_DELAY = 100;
const AD_BLOCKER_CHECK_DELAY = 1000;

const AD_TEST_CLASSES = [
  "adsbygoogle",
  "ad-unit",
  "ad-zone",
  "ad-placement",
  "banner-ads",
  "adsbox",
  "ad-banner",
  "ad-sidebar",
];

const AD_TEST_SCRIPTS = [
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
  "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
];

const isDialogOpen = ref(false);

const createTestElement = (className: string): HTMLElement | null => {
  if (typeof document === "undefined") return null;
  const elem = document.createElement("div");
  elem.className = className;
  elem.style.cssText =
    "position: absolute; left: -999px; top: -999px; width: 1px; height: 1px;";
  document.body.appendChild(elem);
  return elem;
};

const createTestScript = (src: string): HTMLScriptElement | null => {
  if (typeof document === "undefined") return null;
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
  return script;
};

const cleanupElements = (elements: (HTMLElement | null)[]) => {
  elements.forEach((elem) => {
    if (elem?.parentNode) {
      elem.parentNode.removeChild(elem);
    }
  });
};

const isElementBlocked = (elem: HTMLElement | null): boolean => {
  if (!elem || typeof window === "undefined") return false;
  const style = window.getComputedStyle(elem);
  return (
    !elem.offsetParent ||
    elem.offsetHeight === 0 ||
    style.display === "none" ||
    style.visibility === "hidden"
  );
};

const isScriptBlocked = (script: HTMLScriptElement | null): boolean => {
  if (!script || typeof document === "undefined") return false;
  return !script.getAttribute("src") || !document.head.contains(script);
};

const detectAdBlocker = async () => {
  // Guard against SSR
  if (
    process.server ||
    typeof document === "undefined" ||
    typeof window === "undefined"
  ) {
    return;
  }

  const testElements: (HTMLElement | null)[] = [];
  const testScripts: (HTMLScriptElement | null)[] = [];

  try {
    // Create test elements
    testElements.push(
      ...AD_TEST_CLASSES.map(createTestElement).filter(
        (el): el is HTMLElement => el !== null
      )
    );
    testScripts.push(
      ...AD_TEST_SCRIPTS.map(createTestScript).filter(
        (el): el is HTMLScriptElement => el !== null
      )
    );

    // Wait for ad blockers to react
    await new Promise((resolve) => setTimeout(resolve, AD_BLOCKER_CHECK_DELAY));

    // Check for blocking
    const hasBlockedElement = testElements.some(isElementBlocked);
    const hasBlockedScript = testScripts.some(isScriptBlocked);

    if (hasBlockedElement || hasBlockedScript) {
      isDialogOpen.value = true;
    }
  } catch (e) {
    console.error("Error during ad blocker detection:", e);
    isDialogOpen.value = true;
  } finally {
    cleanupElements([...testElements, ...testScripts]);
  }
};

onMounted(() => {
  setTimeout(detectAdBlocker, AD_DETECTION_DELAY);
});
</script>

<template>
  <Dialog v-model:open="isDialogOpen">
    <DialogContent class="sm:max-w-md">
      <div class="flex flex-col gap-4">
        <h2 class="text-lg font-semibold">{{ t("adBlockWarning.title") }}</h2>
        <p class="text-sm text-gray-500">
          {{ t("adBlockWarning.description") }}
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
