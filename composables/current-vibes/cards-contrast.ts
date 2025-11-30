import type { Ref } from "vue";
import { nextTick, onMounted, ref, watch } from "vue";
import type { CardMetadata } from "./cards-metadata";
import type { CardData } from "./current-vibes-data";

export interface ContrastResult {
  isLight: boolean;
  textColorClass: string;
}

export const useCardsContrast = (
  cards: Ref<CardData[]>,
  getCardMetadata: (card: CardData, index: number) => CardMetadata
) => {
  const cardContrast = ref<Map<number, ContrastResult>>(new Map());
  // Defer initialization of useImageContrast to avoid $r initialization errors
  // Use dynamic import to prevent module evaluation during initial load
  type ImageContrastReturn = {
    getContrastColor: (imageSrc: string) => Promise<ContrastResult>;
    getImageBrightness: (imageSrc: string) => Promise<number>;
  };
  let imageContrastComposable: ImageContrastReturn | null = null;
  const getImageContrast = async (): Promise<ImageContrastReturn> => {
    if (!imageContrastComposable) {
      // Dynamic import to avoid initialization order issues
      const { useImageContrast } = await import("~/composables/image-contrast");
      imageContrastComposable = useImageContrast();
    }
    return imageContrastComposable;
  };
  let isClientReady = false;

  // Mark as ready after mount to ensure DOM APIs are available
  onMounted(async () => {
    await nextTick();
    isClientReady = true;
    // Trigger initial analysis after client is ready
    await analyzeCards();
  });

  const analyzeCards = async () => {
    // Only analyze on client side
    if (!isClientReady || process.server || typeof window === "undefined") {
      return;
    }

    for (let i = 0; i < cards.value.length; i++) {
      const card = cards.value[i];
      const metadata = getCardMetadata(card, i);
      if (metadata.src) {
        try {
          const imageContrast = await getImageContrast();
          const contrast = await imageContrast.getContrastColor(metadata.src);
          cardContrast.value.set(i, {
            isLight: contrast.isLight,
            textColorClass: contrast.textColorClass,
          });
        } catch {
          // Default to dark text if analysis fails
          cardContrast.value.set(i, {
            isLight: false,
            textColorClass: "text-white",
          });
        }
      }
    }
  };

  // Analyze images when cards change (only after client is ready)
  watch(
    cards,
    async () => {
      if (isClientReady) {
        await analyzeCards();
      }
    },
    { immediate: false }
  );

  return {
    cardContrast,
  };
};
