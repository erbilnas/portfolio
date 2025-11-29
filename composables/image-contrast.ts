import { ref } from "vue";

interface ContrastResult {
  isLight: boolean;
  textColor: string;
  textColorClass: string;
}

export const useImageContrast = () => {
  const contrastCache = ref<Map<string, ContrastResult>>(new Map());

  /**
   * Calculate the brightness of an image
   * Returns a value between 0 (dark) and 1 (light)
   */
  const getImageBrightness = async (imageSrc: string): Promise<number> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(0.5); // Default to medium brightness
            return;
          }

          canvas.width = Math.min(img.width, 100); // Sample smaller for performance
          canvas.height = Math.min(img.height, 100);

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Sample pixels from the bottom third (where text is)
          const imageData = ctx.getImageData(
            0,
            Math.floor(canvas.height * 0.6),
            canvas.width,
            Math.floor(canvas.height * 0.4)
          );
          const data = imageData.data;

          let totalBrightness = 0;
          let pixelCount = 0;

          // Calculate average brightness using luminance formula
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Luminance formula: 0.299*R + 0.587*G + 0.114*B
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            totalBrightness += brightness;
            pixelCount++;
          }

          const averageBrightness = totalBrightness / pixelCount;
          resolve(averageBrightness);
        } catch (error) {
          console.warn("Error analyzing image brightness:", error);
          resolve(0.5); // Default to medium brightness
        }
      };

      img.onerror = () => {
        resolve(0.5); // Default to medium brightness on error
      };

      img.src = imageSrc;
    });
  };

  /**
   * Get contrast-optimized text color based on image brightness
   */
  const getContrastColor = async (
    imageSrc: string
  ): Promise<ContrastResult> => {
    // Check cache first
    if (contrastCache.value.has(imageSrc)) {
      return contrastCache.value.get(imageSrc)!;
    }

    const brightness = await getImageBrightness(imageSrc);
    const isLight = brightness > 0.5;

    const result: ContrastResult = {
      isLight,
      textColor: isLight ? "#1a1a1a" : "#ffffff",
      textColorClass: isLight ? "text-gray-900" : "text-white",
    };

    // Cache the result
    contrastCache.value.set(imageSrc, result);

    return result;
  };

  return {
    getContrastColor,
    getImageBrightness,
  };
};
