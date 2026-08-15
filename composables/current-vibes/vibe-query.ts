import type { CardData } from "./current-vibes-data";

export const VIBE_TYPES = [
  "game",
  "music",
  "blog",
  "map",
  "trakt",
  "github",
  "reading",
] as const satisfies readonly CardData["type"][];

export type VibeType = (typeof VIBE_TYPES)[number];

export function isVibeType(value: unknown): value is VibeType {
  return (
    typeof value === "string" &&
    (VIBE_TYPES as readonly string[]).includes(value)
  );
}

export const useVibeQuery = () => {
  const route = useRoute();
  const router = useRouter();

  const vibe = computed<VibeType | null>(() => {
    const raw = route.query.vibe;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return isVibeType(value) ? value : null;
  });

  const setVibe = (type: VibeType, options?: { withHash?: boolean }) => {
    const query = { ...route.query, vibe: type };
    router.replace({
      query,
      hash: options?.withHash ? "#current-vibes" : route.hash,
    });
  };

  return { vibe, setVibe };
};
