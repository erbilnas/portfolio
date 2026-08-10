import { useSpring } from "vue-use-spring";
import { useSettings } from "~/composables/settings";

/**
 * Pointer tilt for Current Vibes cover scenes (TravelGlobe-style spring).
 */
export function useSceneTilt(options?: { maxDeg?: number }) {
  const maxDeg = options?.maxDeg ?? 10;
  const { reducedMotion } = useSettings();

  const spring = useSpring(
    { x: 0, y: 0 },
    { mass: 1, tension: 280, friction: 100, precision: 0.001 },
  );

  const containerRef = ref<HTMLElement | null>(null);
  const dragging = ref(false);

  function onPointerMove(e: PointerEvent) {
    const el = containerRef.value;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    spring.x = nx * maxDeg * 2;
    spring.y = -ny * maxDeg * 2;
  }

  function onPointerDown(e: PointerEvent) {
    dragging.value = true;
    (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
    onPointerMove(e);
  }

  function onPointerUp(e: PointerEvent) {
    dragging.value = false;
    (e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(
      e.pointerId,
    );
    if (!reducedMotion.value) {
      spring.x = 0;
      spring.y = 0;
    }
  }

  function onPointerLeave() {
    if (dragging.value) return;
    if (!reducedMotion.value) {
      spring.x = 0;
      spring.y = 0;
    }
  }

  const transformStyle = computed(() => {
    if (reducedMotion.value) {
      return { transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" };
    }
    return {
      transform: `perspective(900px) rotateX(${spring.y}deg) rotateY(${spring.x}deg)`,
    };
  });

  return {
    containerRef,
    spring,
    reducedMotion,
    dragging,
    transformStyle,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  };
}
