import type { Ref } from "vue";
import { ref, watch, onMounted, nextTick } from "vue";
import type { CardMetadata } from "./cards-metadata";
import type { CardData } from "./current-vibes-data";
import { useImageContrast } from "~/composables/image-contrast";

export interface ContrastResult {
  isLight: boolean;
  textColorClass: string;
}

export const useCardsContrast = (
  cards: Ref<CardData[]>,
  getCardMetadata: (card: CardData, index: number) => CardMetadata
) => {
  const cardContrast = ref<Map<number, ContrastResult>>(new Map());
  // Initialize composable at top level (safe even on SSR)
  const { getContrastColor } = useImageContrast();
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
          const contrast = await getContrastColor(metadata.src);
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
