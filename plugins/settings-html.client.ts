export default defineNuxtPlugin(() => {
  const settings = useSettings();

  const applyHtmlClasses = () => {
    if (typeof document === "undefined") return;

    const html = document.documentElement;

    // Font size
    html.classList.remove("font-size-default", "font-size-large", "font-size-xlarge");
    html.classList.add(`font-size-${settings.fontSize.value}`);

    // Font family
    html.classList.remove("font-family-sans", "font-family-serif", "font-family-mono");
    html.classList.add(`font-family-${settings.fontFamily.value}`);

    // High contrast
    if (settings.highContrast.value) {
      html.classList.add("high-contrast");
    } else {
      html.classList.remove("high-contrast");
    }

    // Reduced motion
    if (settings.reducedMotion.value) {
      html.classList.add("reduce-motion");
    } else {
      html.classList.remove("reduce-motion");
    }
  };

  // Initial apply
  applyHtmlClasses();

  // Watch for changes
  watch(
    [settings.fontSize, settings.fontFamily, settings.highContrast, settings.reducedMotion],
    applyHtmlClasses,
    { deep: true }
  );
});
