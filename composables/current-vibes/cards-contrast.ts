import type { Ref } from "vue";
import { ref, watch } from "vue";
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
  const { getContrastColor } = useImageContrast();
  const cardContrast = ref<Map<number, ContrastResult>>(new Map());

  // Analyze images when cards change
  watch(
    cards,
    async () => {
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
    },
    { immediate: true }
  );

  return {
    cardContrast,
  };
};
