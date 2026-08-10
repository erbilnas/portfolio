<script setup lang="ts">
/**
 * Direction: contribution lattice — rising ink cells, traveling commit pulse,
 * pointer ripple. Data from contributionsByMonth drives column intensity.
 */
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  contributionsByMonth?: { label: string; count: number }[];
  contributions?: number;
}>();

const { reducedMotion } = useSettings();
const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === "dark");

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const pointer = ref({ x: -1, y: -1 });
let raf = 0;
let t = 0;
let resizeObserver: ResizeObserver | null = null;

/** Seeded pops so commits feel alive without reshuffling every frame. */
const popSeeds: number[] = Array.from({ length: 14 * 18 }, (_, i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
});

const months = computed(() => props.contributionsByMonth ?? []);

function ink(alpha: number): string {
  return isDark.value
    ? `rgba(255,255,255,${alpha})`
    : `rgba(20,20,20,${alpha})`;
}

function draw(width: number, height: number) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.fillStyle = isDark.value ? "#0a0a0a" : "#f5f5f5";
  ctx.fillRect(0, 0, width, height);

  // Soft vignette
  const vig = ctx.createRadialGradient(
    width * 0.5,
    height * 0.45,
    Math.min(width, height) * 0.15,
    width * 0.5,
    height * 0.5,
    Math.max(width, height) * 0.72,
  );
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(
    1,
    isDark.value ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.08)",
  );
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  const cols = 14;
  const rows = 18;
  const padX = Math.max(20, width * 0.06);
  const padY = Math.max(24, height * 0.07);
  const gap = Math.max(3, Math.min(width, height) * 0.008);
  const cellW = (width - padX * 2 - gap * (cols - 1)) / cols;
  const cellH = (height - padY * 2 - gap * (rows - 1)) / rows;
  const maxLift = Math.min(cellH * 0.55, 10);

  const series = months.value;
  const maxCount = Math.max(1, ...series.map((m) => m.count), 1);

  // Traveling commit scan (Y)
  const scanY = reducedMotion.value
    ? -999
    : padY + ((t * 1.35) % (height - padY * 2));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      const monthIdx = series.length
        ? Math.floor((c / cols) * series.length) % series.length
        : 0;
      const count = series[monthIdx]?.count ?? 0;
      const noise = popSeeds[idx]! * 0.35;
      const intensity = series.length
        ? Math.min(1, (count / maxCount) * 0.85 + noise)
        : 0.12 + noise * 0.45;

      const x = padX + c * (cellW + gap);
      const y = padY + r * (cellH + gap);
      const cx = x + cellW / 2;
      const cy = y + cellH / 2;

      let highlight = 0;
      if (pointer.value.x >= 0) {
        const dx = pointer.value.x - cx;
        const dy = pointer.value.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        highlight = Math.max(0, 1 - dist / 110);
      }

      // Scan-line wake
      if (!reducedMotion.value) {
        const distScan = Math.abs(cy - scanY);
        highlight = Math.max(highlight, Math.max(0, 1 - distScan / 48) * 0.55);
      }

      // Idle breathe + staggered commit pop
      let lift = 0;
      let pop = 1;
      if (!reducedMotion.value) {
        const wave = (Math.sin(t * 0.035 + r * 0.32 + c * 0.18) + 1) / 2;
        highlight = Math.max(highlight, wave * 0.18 * intensity);
        lift = intensity * maxLift * (0.35 + wave * 0.65);

        const phase = (t * 0.018 + popSeeds[idx]! * Math.PI * 2) % (Math.PI * 2);
        const beat = Math.max(0, Math.sin(phase));
        pop = 0.92 + beat * 0.12 * intensity;
      } else {
        lift = intensity * maxLift * 0.45;
      }

      const drawH = cellH * 0.72 + lift;
      const drawY = y + cellH - drawH;
      const drawW = cellW * pop;
      const drawX = x + (cellW - drawW) / 2;

      const alpha = 0.1 + intensity * 0.62 + highlight * 0.28;
      ctx.fillStyle = ink(Math.min(alpha, 0.95));

      const radius = Math.min(3.5, cellW / 4);
      ctx.beginPath();
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(drawX, drawY, drawW, drawH, radius);
      } else {
        ctx.rect(drawX, drawY, drawW, drawH);
      }
      ctx.fill();

      // Top lip catch-light on tall cells
      if (lift > 2) {
        ctx.fillStyle = ink(0.12 + highlight * 0.1);
        ctx.fillRect(drawX + 1, drawY, drawW - 2, 1.5);
      }
    }
  }

  if (!reducedMotion.value) {
    // Scan beam
    const beam = ctx.createLinearGradient(0, scanY - 18, 0, scanY + 18);
    beam.addColorStop(0, ink(0));
    beam.addColorStop(0.5, ink(0.16));
    beam.addColorStop(1, ink(0));
    ctx.fillStyle = beam;
    ctx.fillRect(padX, scanY - 18, width - padX * 2, 36);

    ctx.strokeStyle = ink(0.22);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(padX, scanY);
    ctx.lineTo(width - padX, scanY);
    ctx.stroke();

    // Spark along the scan
    const sparkX =
      padX + ((t * 2.4) % (width - padX * 2));
    ctx.beginPath();
    ctx.fillStyle = ink(0.55);
    ctx.arc(sparkX, scanY, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Corner crop marks — quiet technical frame
  ctx.strokeStyle = ink(0.18);
  ctx.lineWidth = 1;
  const m = 14;
  const len = 12;
  for (const [ox, oy, sx, sy] of [
    [m, m, 1, 1],
    [width - m, m, -1, 1],
    [m, height - m, 1, -1],
    [width - m, height - m, -1, -1],
  ] as const) {
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + len * sx, oy);
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox, oy + len * sy);
    ctx.stroke();
  }
}

function loop() {
  const el = containerRef.value;
  if (!el) return;
  const { clientWidth: w, clientHeight: h } = el;
  if (w > 0 && h > 0) {
    if (!reducedMotion.value) t += 1;
    draw(w, h);
  }
  raf = requestAnimationFrame(loop);
}

function onPointerMove(e: PointerEvent) {
  const el = containerRef.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  pointer.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function onPointerLeave() {
  pointer.value = { x: -1, y: -1 };
}

onMounted(() => {
  raf = requestAnimationFrame(loop);
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      /* next frame redraws */
    });
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch([isDark, months, () => props.contributions, reducedMotion], () => {
  /* redraw on next raf */
});
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 cursor-crosshair touch-none overflow-hidden bg-neutral-100 dark:bg-neutral-950"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas ref="canvasRef" class="h-full w-full" aria-hidden="true" />
  </div>
</template>
