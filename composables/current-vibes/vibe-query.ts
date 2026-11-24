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

  const setVibe = async (type: VibeType) => {
    if (route.query.vibe === type && !route.hash) {
      return;
    }
    // Query only. Do not pass hash: "" to router.replace — that scrolls to
    // top and fights navbar smooth-scroll. Strip a leftover hash via history.
    const query = { ...route.query, vibe: type };
    await router.replace({ path: route.path, query });
    if (window.location.hash) {
      const { href } = router.resolve({ path: route.path, query });
      window.history.replaceState(window.history.state, "", href);
    }
  };

  return { vibe, setVibe };
};
