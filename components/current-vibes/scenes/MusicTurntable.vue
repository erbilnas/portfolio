<script setup lang="ts">
/**
 * Direction: Three.js turntable — elevated ¾ product shot.
 * Vinyl + tonearm are the means; Spotify album art sits as the center label
 * (and a sleeve leaning behind). No default/placeholder cover image.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  src: string;
  isPlaying?: boolean;
}>();

const colorMode = useColorMode();
const { reducedMotion } = useSettings();
const isDark = computed(() => colorMode.value === "dark");

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const DECK_W = 1.72;
const DECK_D = 1.48;
const DECK_H = 0.07;
const PLATTER_R = 0.58;
const LABEL_R = 0.2;

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let root: Group | null = null;
let vinyl: Group | null = null;
let tonearm: Group | null = null;
let labelMesh: Mesh | null = null;
let sleeveMesh: Mesh | null = null;
let grooveTexture: CanvasTexture | null = null;
let labelTexture: CanvasTexture | null = null;
let coverTexture: Texture | null = null;
let sleeveTexture: CanvasTexture | null = null;
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let lastFrame = 0;

/** Orbit around deck center (yaw / pitch). */
const yaw = ref(-0.42);
const pitch = ref(0.38);
const velocityYaw = ref(0);
const dragging = ref(false);
let lastX = 0;
let lastY = 0;
let pointerId: number | null = null;

/** Rest = parked right of platter; play = stylus on the grooves. */
const tonearmRest = 0.48;
const tonearmPlay = -0.82;
const tonearmAngle = ref(tonearmRest);

function disposeTexture(tex: Texture | CanvasTexture | null) {
  tex?.dispose();
}

function prepCanvasTexture(tex: CanvasTexture) {
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

function theme() {
  if (isDark.value) {
    return {
      deck: 0x1a1a1a,
      deckEdge: 0x0f0f0f,
      platter: 0x0a0a0a,
      spindle: 0xc4c4c4,
      arm: 0x8a8a8a,
      armDark: 0x5c5c5c,
      sleeve: 0x262626,
      shadow: 0.16,
    };
  }
  return {
    deck: 0xe8e8e8,
    deckEdge: 0xcfcfcf,
    platter: 0x111111,
    spindle: 0xd4d4d4,
    arm: 0x6b6b6b,
    armDark: 0x4a4a4a,
    sleeve: 0xd4d4d4,
    shadow: 0.1,
  };
}

function paintGrooves(): CanvasTexture {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const mid = size / 2;

  ctx.fillStyle = "#0c0c0c";
  ctx.beginPath();
  ctx.arc(mid, mid, mid, 0, Math.PI * 2);
  ctx.fill();

  for (let r = mid * 0.96; r > mid * 0.38; r -= 2.2) {
    const a = 0.04 + (Math.sin(r * 0.35) * 0.5 + 0.5) * 0.035;
    ctx.strokeStyle = `rgba(255,255,255,${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mid, mid, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Outer rim highlight
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(mid, mid, mid * 0.985, 0, Math.PI * 2);
  ctx.stroke();

  // Run-out ring
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(mid, mid, mid * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  return prepCanvasTexture(new CanvasTexture(c));
}

function paintLabel(art: HTMLImageElement | null): CanvasTexture {
  const size = 768;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  const mid = size / 2;

  ctx.beginPath();
  ctx.arc(mid, mid, mid, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (art && art.complete && art.naturalWidth > 0) {
    const scale = Math.max(size / art.naturalWidth, size / art.naturalHeight);
    const dw = art.naturalWidth * scale;
    const dh = art.naturalHeight * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(art, (size - dw) / 2, (size - dh) / 2, dw, dh);
  } else {
    const g = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
    g.addColorStop(0, "#3a3a3a");
    g.addColorStop(1, "#1a1a1a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 3;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(mid, mid, mid * (0.35 + i * 0.15), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Soft rim
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(mid, mid, mid - 4, 0, Math.PI * 2);
  ctx.stroke();

  return prepCanvasTexture(new CanvasTexture(c));
}

function paintSleeve(art: HTMLImageElement | null): CanvasTexture {
  const w = 768;
  const h = 768;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = isDark.value ? "#222" : "#d8d8d8";
  ctx.fillRect(0, 0, w, h);

  if (art && art.complete && art.naturalWidth > 0) {
    const pad = 28;
    const scale = Math.max(
      (w - pad * 2) / art.naturalWidth,
      (h - pad * 2) / art.naturalHeight,
    );
    const dw = art.naturalWidth * scale;
    const dh = art.naturalHeight * scale;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(art, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  // Paper edge
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);

  return prepCanvasTexture(new CanvasTexture(c));
}

function resolveCoverUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const host = new URL(src).hostname;
    if (
      host === "i.scdn.co" ||
      host === "mosaic.scdn.co" ||
      host.endsWith(".scdn.co")
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return src;
  }
  return src;
}

function applyArt(img: HTMLImageElement | null) {
  if (!labelMesh || !sleeveMesh) return;

  disposeTexture(labelTexture);
  disposeTexture(sleeveTexture);
  labelTexture = paintLabel(img);
  sleeveTexture = paintSleeve(img);

  const labelMat = labelMesh.material as MeshStandardMaterial;
  if (labelMat.map && labelMat.map !== labelTexture) labelMat.map.dispose();
  labelMat.map = labelTexture;
  labelMat.needsUpdate = true;

  const hasArt = Boolean(img && img.complete && img.naturalWidth > 0);
  sleeveMesh.visible = hasArt;
  if (hasArt) {
    const sleeveMat = sleeveMesh.material as MeshStandardMaterial;
    if (sleeveMat.map && sleeveMat.map !== sleeveTexture)
      sleeveMat.map.dispose();
    sleeveMat.map = sleeveTexture;
    sleeveMat.needsUpdate = true;
  }
}

function loadCover(src: string) {
  const url = resolveCoverUrl(src);
  if (!url) {
    applyArt(null);
    return;
  }

  const loader = new TextureLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(
    url,
    (tex) => {
      disposeTexture(coverTexture);
      coverTexture = tex;
      tex.colorSpace = SRGBColorSpace;
      tex.anisotropy = 8;
      applyArt(tex.image as HTMLImageElement);
    },
    undefined,
    () => applyArt(null),
  );
}

function buildScene(colors: ReturnType<typeof theme>) {
  const group = new Group();

  // Soft contact shadow under deck
  const shadow = new Mesh(
    new PlaneGeometry(DECK_W * 1.35, DECK_D * 1.35),
    new MeshStandardMaterial({
      color: "#000000",
      transparent: true,
      opacity: colors.shadow,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.002;
  group.add(shadow);

  const deckTop = new MeshPhysicalMaterial({
    color: new Color(colors.deck),
    roughness: 0.55,
    metalness: 0.08,
    clearcoat: 0.35,
    clearcoatRoughness: 0.45,
  });
  const deck = new Mesh(new BoxGeometry(DECK_W, DECK_H, DECK_D), [
    new MeshPhysicalMaterial({
      color: new Color(colors.deckEdge),
      roughness: 0.6,
      metalness: 0.06,
    }),
    new MeshPhysicalMaterial({
      color: new Color(colors.deckEdge),
      roughness: 0.6,
      metalness: 0.06,
    }),
    deckTop,
    new MeshPhysicalMaterial({
      color: new Color(colors.deckEdge),
      roughness: 0.7,
      metalness: 0.04,
    }),
    new MeshPhysicalMaterial({
      color: new Color(colors.deckEdge),
      roughness: 0.6,
      metalness: 0.06,
    }),
    new MeshPhysicalMaterial({
      color: new Color(colors.deckEdge),
      roughness: 0.6,
      metalness: 0.06,
    }),
  ]);
  deck.position.y = DECK_H / 2;
  group.add(deck);

  // Plinth lip / platter well
  const well = new Mesh(
    new CylinderGeometry(PLATTER_R + 0.04, PLATTER_R + 0.05, 0.018, 64),
    new MeshStandardMaterial({
      color: colors.deckEdge,
      roughness: 0.7,
      metalness: 0.05,
    }),
  );
  well.position.set(-0.12, DECK_H + 0.01, 0.02);
  group.add(well);

  // Vinyl platter
  vinyl = new Group();
  vinyl.position.set(-0.12, DECK_H + 0.022, 0.02);

  grooveTexture = paintGrooves();
  const disc = new Mesh(
    new CylinderGeometry(PLATTER_R, PLATTER_R, 0.018, 96),
    [
      new MeshStandardMaterial({
        color: colors.platter,
        roughness: 0.85,
        metalness: 0.05,
      }),
      new MeshStandardMaterial({
        map: grooveTexture,
        roughness: 0.78,
        metalness: 0.04,
      }),
      new MeshStandardMaterial({
        color: colors.platter,
        roughness: 0.9,
        metalness: 0.02,
      }),
    ],
  );
  vinyl.add(disc);

  labelTexture = paintLabel(null);
  labelMesh = new Mesh(
    new CircleGeometry(LABEL_R, 64),
    new MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.55,
      metalness: 0.02,
    }),
  );
  labelMesh.rotation.x = -Math.PI / 2;
  labelMesh.position.y = 0.012;
  vinyl.add(labelMesh);

  const spindle = new Mesh(
    new CylinderGeometry(0.018, 0.018, 0.05, 24),
    new MeshStandardMaterial({
      color: colors.spindle,
      roughness: 0.25,
      metalness: 0.7,
    }),
  );
  spindle.position.y = 0.028;
  vinyl.add(spindle);

  const spindleCap = new Mesh(
    new CylinderGeometry(0.028, 0.022, 0.012, 24),
    new MeshStandardMaterial({
      color: colors.spindle,
      roughness: 0.3,
      metalness: 0.65,
    }),
  );
  spindleCap.position.y = 0.052;
  vinyl.add(spindleCap);

  group.add(vinyl);

  // Sleeve upright behind the tonearm / pickup
  sleeveTexture = paintSleeve(null);
  sleeveMesh = new Mesh(
    new PlaneGeometry(1.18, 1.18),
    new MeshStandardMaterial({
      map: sleeveTexture,
      roughness: 0.85,
      metalness: 0,
      side: DoubleSide,
    }),
  );
  sleeveMesh.position.set(0.68, 0.78, -0.78);
  sleeveMesh.rotation.set(-0.06, -0.28, 0.04);
  sleeveMesh.renderOrder = -1;
  sleeveMesh.visible = false;
  group.add(sleeveMesh);

  // Tonearm — pivot at rear-right of deck (in front of sleeve)
  tonearm = new Group();
  tonearm.position.set(0.62, DECK_H + 0.04, -0.42);
  tonearm.renderOrder = 1;

  const pivotBase = new Mesh(
    new CylinderGeometry(0.055, 0.065, 0.04, 24),
    new MeshStandardMaterial({
      color: colors.armDark,
      roughness: 0.4,
      metalness: 0.55,
    }),
  );
  tonearm.add(pivotBase);

  const arm = new Mesh(
    new BoxGeometry(0.028, 0.018, 0.78),
    new MeshStandardMaterial({
      color: colors.arm,
      roughness: 0.35,
      metalness: 0.6,
    }),
  );
  arm.position.set(0, 0.04, 0.36);
  tonearm.add(arm);

  const headshell = new Mesh(
    new BoxGeometry(0.055, 0.02, 0.1),
    new MeshStandardMaterial({
      color: colors.armDark,
      roughness: 0.4,
      metalness: 0.5,
    }),
  );
  headshell.position.set(0, 0.03, 0.74);
  tonearm.add(headshell);

  const stylus = new Mesh(
    new BoxGeometry(0.012, 0.03, 0.012),
    new MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.5,
      metalness: 0.3,
    }),
  );
  stylus.position.set(0, 0.01, 0.78);
  tonearm.add(stylus);

  tonearm.rotation.y = tonearmAngle.value;
  group.add(tonearm);

  return group;
}

function setSize() {
  const el = containerRef.value;
  if (!el || !renderer || !camera) return;
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w === 0 || h === 0) return;
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function applyCamera() {
  if (!camera || !root) return;
  // Elevated ¾ product shot; drag orbits around the deck.
  const r = 5;
  const elev = Math.max(0.55, Math.min(1.35, pitch.value + 0.45));
  const y = yaw.value;
  const flat = Math.cos(elev * 0.55);
  camera.position.set(
    r * Math.sin(y) * Math.max(0.45, flat),
    r * Math.sin(elev) * 0.72 + 0.35,
    r * Math.cos(y) * Math.max(0.45, flat),
  );
  camera.lookAt(-0.05, 0.18, 0.02);
  root.rotation.set(0, 0, 0);
}

function tick(now: number) {
  if (!renderer || !scene || !camera || !root || !vinyl || !tonearm) return;

  const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0.016;
  lastFrame = now;

  if (!dragging.value && !reducedMotion.value) {
    if (Math.abs(velocityYaw.value) > 0.0003) {
      yaw.value += velocityYaw.value;
      velocityYaw.value *= 0.92;
    } else {
      velocityYaw.value = 0;
      yaw.value += 0.0012;
    }
  } else if (!dragging.value) {
    velocityYaw.value = 0;
  }

  // Vinyl spin
  if (!reducedMotion.value) {
    const speed = props.isPlaying ? 1.85 : 0.35;
    vinyl.rotation.y += speed * dt;
    // Quiet platter breathe
    vinyl.position.y = DECK_H + 0.022 + Math.sin(now * 0.0012) * 0.004;
  }

  // Tonearm ease toward play / rest
  const target = props.isPlaying ? tonearmPlay : tonearmRest;
  const ease = 1 - Math.exp(-dt * 5);
  tonearmAngle.value += (target - tonearmAngle.value) * ease;
  tonearm.rotation.y = tonearmAngle.value;
  // Dip stylus onto the plaque when playing; lift when resting
  const tipTarget = props.isPlaying ? 0.1 : -0.06;
  tonearm.rotation.x += (tipTarget - tonearm.rotation.x) * ease;

  if (sleeveMesh && sleeveMesh.visible && !reducedMotion.value) {
    sleeveMesh.rotation.y = -0.28 + Math.sin(now * 0.0007) * 0.02;
  }

  applyCamera();
  renderer.render(scene, camera);
  raf = requestAnimationFrame(tick);
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  velocityYaw.value = 0;
  lastX = e.clientX;
  lastY = e.clientY;
  pointerId = e.pointerId;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || pointerId !== e.pointerId) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  const stepY = dx * 0.008;
  yaw.value += stepY;
  pitch.value = Math.max(0.18, Math.min(1.15, pitch.value - dy * 0.006));
  velocityYaw.value = stepY;
}

function onPointerUp(e: PointerEvent) {
  if (pointerId !== null && pointerId !== e.pointerId) return;
  dragging.value = false;
  pointerId = null;
  (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
}

function applyThemeColors() {
  if (!scene || !root) return;

  const disposedMats = new Set<object>();
  root.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (disposedMats.has(m)) continue;
        disposedMats.add(m);
        const map = (m as MeshStandardMaterial).map;
        if (
          map &&
          map !== grooveTexture &&
          map !== labelTexture &&
          map !== sleeveTexture &&
          map !== coverTexture
        ) {
          map.dispose();
        }
        m.dispose();
      }
    }
  });
  scene.remove(root);

  disposeTexture(grooveTexture);
  disposeTexture(labelTexture);
  disposeTexture(sleeveTexture);
  grooveTexture = null;
  labelTexture = null;
  sleeveTexture = null;
  labelMesh = null;
  sleeveMesh = null;
  vinyl = null;
  tonearm = null;

  root = buildScene(theme());
  scene.add(root);
  tonearmAngle.value = props.isPlaying ? tonearmPlay : tonearmRest;

  const img =
    coverTexture && coverTexture.image
      ? (coverTexture.image as HTMLImageElement)
      : null;
  applyArt(img && img.naturalWidth ? img : null);
}

function init() {
  const canvas = canvasRef.value;
  const el = containerRef.value;
  if (!canvas || !el) return;

  scene = new Scene();
  camera = new PerspectiveCamera(30, 1, 0.1, 40);

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene.add(new AmbientLight(0xffffff, 0.38));
  scene.add(new HemisphereLight(0xffffff, 0x9a9a9a, 0.45));

  const key = new DirectionalLight(0xffffff, 1.15);
  key.position.set(2.8, 4.2, 2.2);
  scene.add(key);

  const fill = new DirectionalLight(0xf0f0f0, 0.4);
  fill.position.set(-2.5, 1.2, 1.5);
  scene.add(fill);

  const rim = new DirectionalLight(0xffffff, 0.35);
  rim.position.set(0.2, 2.2, -3);
  scene.add(rim);

  root = buildScene(theme());
  scene.add(root);

  tonearmAngle.value = props.isPlaying ? tonearmPlay : tonearmRest;

  setSize();
  resizeObserver = new ResizeObserver(() => setSize());
  resizeObserver.observe(el);

  loadCover(props.src);
  applyCamera();
  raf = requestAnimationFrame(tick);
}

function disposeScene() {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (root) {
    const disposedMats = new Set<object>();
    root.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (disposedMats.has(m)) continue;
          disposedMats.add(m);
          const map = (m as MeshStandardMaterial).map;
          if (
            map &&
            map !== grooveTexture &&
            map !== labelTexture &&
            map !== sleeveTexture &&
            map !== coverTexture
          ) {
            map.dispose();
          }
          m.dispose();
        }
      }
    });
    root = null;
  }

  disposeTexture(grooveTexture);
  disposeTexture(labelTexture);
  disposeTexture(sleeveTexture);
  disposeTexture(coverTexture);
  grooveTexture = null;
  labelTexture = null;
  sleeveTexture = null;
  coverTexture = null;
  labelMesh = null;
  sleeveMesh = null;
  vinyl = null;
  tonearm = null;

  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
}

watch(
  () => props.src,
  (src) => {
    if (scene) loadCover(src);
  },
);

watch(isDark, () => {
  applyThemeColors();
});

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  disposeScene();
});
</script>

<template>
  <div
    ref="containerRef"
    class="absolute inset-0 cursor-grab touch-none overflow-hidden bg-neutral-100 active:cursor-grabbing dark:bg-neutral-950"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <canvas ref="canvasRef" class="absolute inset-0 h-full w-full" />
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.14)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.4)_100%)]"
      aria-hidden="true"
    />
  </div>
</template>
