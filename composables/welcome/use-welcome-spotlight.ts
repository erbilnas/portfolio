import { usePointerGlow } from "~/composables/use-pointer-glow";

/**
 * Welcome social magnet gates — shares the global pointer-glow interaction flags.
 */
export function useWelcomeSpotlight() {
  const { magnetEnabled, interactionEnabled } = usePointerGlow();
  return {
    magnetEnabled,
    interactionEnabled,
  };
}
