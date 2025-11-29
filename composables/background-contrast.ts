import { ref, onMounted, onUnmounted, type Ref } from "vue";

interface ContrastResult {
  isLight: boolean;
  textColorClass: string;
  iconColorClass: string;
}

/**
 * Composable to detect background brightness behind an element
 * and adjust text/icon colors for better readability
 */
export const useBackgroundContrast = (elementRef: Ref<HTMLElement | null>) => {
  const contrast = ref<ContrastResult>({
    isLight: false,
    textColorClass: "text-white",
    iconColorClass: "text-white",
  });

  let rafId: number | null = null;
  let checkInterval: ReturnType<typeof setInterval> | null = null;

  const parseColor = (colorString: string): { r: number; g: number; b: number; a: number } | null => {
    // Handle rgb/rgba format: rgb(255, 255, 255) or rgba(255, 255, 255, 0.5)
    const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
      };
    }

    // Handle hex format: #ffffff or #fff
    const hexMatch = colorString.match(/#([0-9a-f]{3}|[0-9a-f]{6})/i);
    if (hexMatch) {
      const hex = hexMatch[1];
      const r = hex.length === 3
        ? parseInt(hex[0] + hex[0], 16)
        : parseInt(hex.substring(0, 2), 16);
      const g = hex.length === 3
        ? parseInt(hex[1] + hex[1], 16)
        : parseInt(hex.substring(2, 4), 16);
      const b = hex.length === 3
        ? parseInt(hex[2] + hex[2], 16)
        : parseInt(hex.substring(4, 6), 16);
      return { r, g, b, a: 1 };
    }

    return null;
  };

  const getElementBrightness = (element: Element): number | null => {
    const computedStyle = window.getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;

    // Skip transparent backgrounds
    if (bgColor === "transparent" || bgColor === "rgba(0, 0, 0, 0)") {
      return null;
    }

    const color = parseColor(bgColor);
    if (!color) return null;

    // If background is semi-transparent, we need to consider what's behind it
    // For simplicity, we'll use the color as-is and adjust threshold
    const brightness = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255;
    
    // Adjust for transparency (more transparent = less reliable)
    return brightness * color.a + 0.5 * (1 - color.a);
  };

  const sampleBackgroundBrightness = (): number => {
    if (!elementRef.value) return 0.5;

    try {
      const rect = elementRef.value.getBoundingClientRect();
      
      // Sample multiple points for better accuracy
      const samplePoints = [
        { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, // Center
        { x: rect.left + rect.width * 0.25, y: rect.top + rect.height / 2 }, // Left
        { x: rect.left + rect.width * 0.75, y: rect.top + rect.height / 2 }, // Right
      ];

      const brightnesses: number[] = [];

      for (const point of samplePoints) {
        const elements = document.elementsFromPoint(point.x, point.y);
        
        // Find the element that's actually behind the navbar
        const backgroundElement = elements.find(
          (el) => !elementRef.value?.contains(el) && el !== elementRef.value
        );

        if (backgroundElement) {
          // Try to get brightness from this element
          let brightness = getElementBrightness(backgroundElement);
          
          // If transparent or not found, check parent elements
          if (brightness === null) {
            let current: Element | null = backgroundElement.parentElement;
            let depth = 0;
            while (current && depth < 5) {
              brightness = getElementBrightness(current);
              if (brightness !== null) break;
              current = current.parentElement;
              depth++;
            }
          }

          if (brightness !== null) {
            brightnesses.push(brightness);
          }
        }
      }

      // If we have samples, return average
      if (brightnesses.length > 0) {
        const avg = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
        return avg;
      }

      // Fallback: check if we're in dark mode or use default
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return isDarkMode ? 0.3 : 0.7;
    } catch (error) {
      console.warn("Error sampling background brightness:", error);
      return 0.5;
    }
  };

  const updateContrast = () => {
    if (!elementRef.value) return;

    rafId = requestAnimationFrame(() => {
      const brightness = sampleBackgroundBrightness();
      const isLight = brightness > 0.5;

      contrast.value = {
        isLight,
        textColorClass: isLight ? "text-gray-900" : "text-white",
        iconColorClass: isLight ? "text-gray-900" : "text-white",
      };
    });
  };

  const throttledUpdate = () => {
    if (rafId) return;
    updateContrast();
  };

  onMounted(() => {
    // Initial check
    setTimeout(updateContrast, 100);

    // Update on scroll (throttled)
    window.addEventListener("scroll", throttledUpdate, { passive: true });
    
    // Update periodically to catch dynamic background changes
    checkInterval = setInterval(updateContrast, 500);

    // Update on resize
    window.addEventListener("resize", throttledUpdate, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", throttledUpdate);
    window.removeEventListener("resize", throttledUpdate);
    if (checkInterval) {
      clearInterval(checkInterval);
    }
    if (rafId) {
      cancelAnimationFrame(rafId);
    }
  });

  return {
    contrast,
  };
};

