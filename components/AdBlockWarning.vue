<script setup lang="ts">
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { onMounted, ref } from "vue";

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

const createTestElement = (className: string): HTMLElement => {
  const elem = document.createElement("div");
  elem.className = className;
  elem.style.cssText =
    "position: absolute; left: -999px; top: -999px; width: 1px; height: 1px;";
  document.body.appendChild(elem);
  return elem;
};

const createTestScript = (src: string): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
  return script;
};

const cleanupElements = (elements: HTMLElement[]) => {
  elements.forEach((elem) => {
    elem.parentNode?.removeChild(elem);
  });
};

const isElementBlocked = (elem: HTMLElement): boolean => {
  const style = window.getComputedStyle(elem);
  return (
    !elem.offsetParent ||
    elem.offsetHeight === 0 ||
    style.display === "none" ||
    style.visibility === "hidden"
  );
};

const isScriptBlocked = (script: HTMLScriptElement): boolean => {
  return !script.getAttribute("src") || !document.head.contains(script);
};

const detectAdBlocker = async () => {
  const testElements: HTMLElement[] = [];
  const testScripts: HTMLScriptElement[] = [];

  try {
    // Create test elements
    testElements.push(...AD_TEST_CLASSES.map(createTestElement));
    testScripts.push(...AD_TEST_SCRIPTS.map(createTestScript));

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
        <h2 class="text-lg font-semibold">AdBlocker Detected</h2>
        <p class="text-sm text-gray-500">
          It looks like you're using an ad blocker (such as AdGuard or uBlock
          Origin). While I respect your choice, please note that ad blockers
          might break some functionality on this site. Consider disabling it for
          the best experience.
        </p>
      </div>
    </DialogContent>
  </Dialog>
</template>
