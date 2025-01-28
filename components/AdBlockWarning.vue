<script lang="ts" setup>
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { onMounted, ref } from "vue";

const isAdBlockerDetected = ref(false);

const detectAdBlocker = async () => {
  let testElements: HTMLElement[] = [];
  let testScripts: HTMLScriptElement[] = [];

  try {
    // Create multiple test elements with different ad-related classes
    testElements = [
      { class: "adsbygoogle" },
      { class: "ad-unit" },
      { class: "ad-zone" },
      { class: "ad-placement" },
      { class: "banner-ads" },
      { class: "adsbox" },
      { class: "ad-banner" },
      { class: "ad-sidebar" },
    ].map(({ class: className }) => {
      const elem = document.createElement("div");
      elem.className = className;
      elem.style.cssText =
        "position: absolute; left: -999px; top: -999px; width: 1px; height: 1px;";
      document.body.appendChild(elem);
      return elem;
    });

    // Create test scripts for different ad networks
    testScripts = [
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
      "https://securepubads.g.doubleclick.net/tag/js/gpt.js",
    ].map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
      return script;
    });

    // First wait to let ad blockers react
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check for blocking
    const isElementBlocked = testElements.some((elem) => {
      const style = window.getComputedStyle(elem);
      return (
        !elem.offsetParent ||
        elem.offsetHeight === 0 ||
        style.display === "none" ||
        style.visibility === "hidden"
      );
    });

    const isScriptBlocked = testScripts.some(
      (script) => !script.getAttribute("src") || !document.head.contains(script)
    );

    isAdBlockerDetected.value = isElementBlocked || isScriptBlocked;
  } catch (e) {
    console.error("Error during ad blocker detection:", e);
    isAdBlockerDetected.value = true;
  } finally {
    // Clean up in finally block to ensure it always happens
    testElements.forEach((elem) => {
      if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
      }
    });

    testScripts.forEach((script) => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
  }
};

onMounted(() => {
  // Add a small delay before starting detection
  setTimeout(detectAdBlocker, 100);
});
</script>

<template>
  <Dialog :open="isAdBlockerDetected">
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
