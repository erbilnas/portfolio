<script setup lang="ts">
/**
 * Direction: closed hardcover — front/back boards tuck into a solid spine,
 * page block flush between them (no floating hinge strips).
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  BoxGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
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
  Vector3,
  WebGLRenderer,
} from "three";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  src: string;
}>();

const { reducedMotion } = useSettings();

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

/** Front/back board face size. */
const COVER_W = 1.0;
const COVER_H = 1.52;
const COVER_T = 0.028;
/** Page block inset from fore-edge; sits flush against spine. */
const PAGE_W = 0.955;
const PAGE_H = 1.46;
const PAGE_D = 0.155;
/** Spine board thickness (X). Overlap tucks cover left edges into the spine. */
const SPINE_T = 0.05;
const SPINE_OVERLAP = 0.014;
const BOOK_SCALE = 0.86;

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let book: Group | null = null;
let frontTexture: CanvasTexture | null = null;
let backTexture: CanvasTexture | null = null;
let spineTexture: CanvasTexture | null = null;
let coverTexture: Texture | null = null;
let pageEdgeTextures: CanvasTexture[] = [];
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let clockStart = 0;

const rotY = ref(-0.55);
const velocity = ref(0);
const dragging = ref(false);
let lastX = 0;
let pointerId: number | null = null;

const COVER_TEX = 1536;
const SPINE_TEX_W = 384;
const SPINE_TEX_H = 1536;

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

function sampleCoverTone(img: HTMLImageElement | null): {
  r: number;
  g: number;
  b: number;
} {
  if (!img) return { r: 36, g: 36, b: 38 };
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, 32, 32);
  const data = ctx.getImageData(0, 0, 32, 32).data;
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 16) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n += 1;
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function paintBoard(
  img: HTMLImageElement | null,
  face: "front" | "back",
): CanvasTexture {
  const w = COVER_TEX;
  const h = Math.round(COVER_TEX * (COVER_H / COVER_W));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  // Board substrate
  ctx.fillStyle = face === "front" ? "#1c1c1e" : "#222226";
  ctx.fillRect(0, 0, w, h);

  if (img && face === "front") {
    // Dust-jacket style: cover art with a thin board margin
    const margin = Math.round(w * 0.018);
    const iw = w - margin * 2;
    const ih = h - margin * 2;
    const scale = Math.max(iw / img.width, ih / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(margin, margin, iw, ih);
    ctx.clip();
    ctx.drawImage(img, margin + (iw - dw) / 2, margin + (ih - dh) / 2, dw, dh);
    ctx.restore();
  } else if (img && face === "back") {
    // Muted back: blurred average tone + faint panel
    const tone = sampleCoverTone(img);
    ctx.fillStyle = `rgb(${Math.max(18, tone.r * 0.22)}, ${Math.max(18, tone.g * 0.22)}, ${Math.max(20, tone.b * 0.24)})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(w * 0.12, h * 0.14, w * 0.76, h * 0.72);
  } else {
    ctx.fillStyle = "#2a2a2e";
    ctx.fillRect(w * 0.1, h * 0.14, w * 0.8, h * 0.72);
  }

  // Cloth/paper grain
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 5200; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
    ctx.fillRect(x, y, 1.2, 1.2);
  }
  ctx.restore();

  // Soft bevel (light from top-left)
  const top = ctx.createLinearGradient(0, 0, 0, h * 0.08);
  top.addColorStop(0, "rgba(255,255,255,0.16)");
  top.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, w, h * 0.08);

  const left = ctx.createLinearGradient(0, 0, w * 0.06, 0);
  left.addColorStop(0, "rgba(0,0,0,0.28)");
  left.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = left;
  ctx.fillRect(0, 0, w * 0.06, h);

  const right = ctx.createLinearGradient(w, 0, w * 0.94, 0);
  right.addColorStop(0, "rgba(255,255,255,0.08)");
  right.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = right;
  ctx.fillRect(w * 0.94, 0, w * 0.06, h);

  const bottom = ctx.createLinearGradient(0, h, 0, h * 0.92);
  bottom.addColorStop(0, "rgba(0,0,0,0.22)");
  bottom.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, h * 0.92, w, h * 0.08);

  return prepCanvasTexture(new CanvasTexture(c));
}

function paintSpine(img: HTMLImageElement | null): CanvasTexture {
  const w = SPINE_TEX_W;
  const h = SPINE_TEX_H;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const tone = sampleCoverTone(img);
  const base = `rgb(${Math.max(16, Math.round(tone.r * 0.28))}, ${Math.max(16, Math.round(tone.g * 0.28))}, ${Math.max(18, Math.round(tone.b * 0.3))})`;
  const mid = `rgb(${Math.max(24, Math.round(tone.r * 0.4))}, ${Math.max(24, Math.round(tone.g * 0.4))}, ${Math.max(26, Math.round(tone.b * 0.42))})`;

  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.18, base);
  g.addColorStop(0.5, mid);
  g.addColorStop(0.82, base);
  g.addColorStop(1, "rgba(0,0,0,0.5)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Raised bands
  for (const y of [0.14, 0.22, 0.78, 0.86]) {
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.fillRect(w * 0.12, h * y, w * 0.76, h * 0.012);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(w * 0.12, h * (y + 0.014), w * 0.76, h * 0.006);
  }

  // Title stripe (abstract — no real text to avoid wrong glyphs)
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fillRect(w * 0.38, h * 0.32, w * 0.24, h * 0.36);

  ctx.save();
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
  ctx.restore();

  return prepCanvasTexture(new CanvasTexture(c));
}

function paintPageEdge(kind: "fore" | "head" | "spineSide"): CanvasTexture {
  const w = kind === "fore" ? 160 : kind === "head" ? 1024 : 160;
  const h = kind === "head" ? 160 : 1280;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  const cream = ctx.createLinearGradient(0, 0, kind === "head" ? 0 : w, kind === "head" ? h : 0);
  cream.addColorStop(0, "#f7f3ea");
  cream.addColorStop(0.55, "#efe9dc");
  cream.addColorStop(1, "#e6dfd0");
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, w, h);

  const lines = kind === "head" ? 90 : 110;
  for (let i = 0; i < lines; i++) {
    const t = i / lines;
    if (kind === "head") {
      const x = t * w;
      ctx.fillStyle =
        i % 3 === 0 ? "rgba(90,70,40,0.07)" : "rgba(60,50,35,0.035)";
      ctx.fillRect(x, 0, Math.max(1, w / lines), h);
    } else {
      const y = t * h;
      ctx.fillStyle =
        i % 3 === 0 ? "rgba(90,70,40,0.08)" : "rgba(60,50,35,0.04)";
      ctx.fillRect(0, y, w, Math.max(1, h / lines));
    }
  }

  // Slight age darkening toward spine / outer edge
  if (kind === "fore") {
    const shade = ctx.createLinearGradient(0, 0, w, 0);
    shade.addColorStop(0, "rgba(120,95,60,0.12)");
    shade.addColorStop(0.35, "rgba(120,95,60,0)");
    shade.addColorStop(1, "rgba(255,255,255,0.08)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
  } else if (kind === "spineSide") {
    const shade = ctx.createLinearGradient(0, 0, w, 0);
    shade.addColorStop(0, "rgba(80,60,40,0.18)");
    shade.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);
  }

  return prepCanvasTexture(new CanvasTexture(c));
}

function coverMat(map: Texture, roughness = 0.62) {
  return new MeshPhysicalMaterial({
    map,
    color: new Color("#ffffff"),
    roughness,
    metalness: 0.04,
    clearcoat: 0.22,
    clearcoatRoughness: 0.55,
    sheen: 0.18,
    sheenRoughness: 0.75,
    sheenColor: new Color("#f2efe8"),
  });
}

function pageMat(map: Texture) {
  return new MeshStandardMaterial({
    map,
    color: new Color("#f4f0e6"),
    roughness: 0.92,
    metalness: 0,
  });
}

function solidMat(color: string, roughness = 0.88) {
  return new MeshStandardMaterial({
    color: new Color(color),
    roughness,
    metalness: 0,
  });
}

function buildBook(
  front: CanvasTexture,
  back: CanvasTexture,
  spine: CanvasTexture,
): Group {
  const group = new Group();
  pageEdgeTextures.forEach(disposeTexture);
  pageEdgeTextures = [
    paintPageEdge("fore"),
    paintPageEdge("head"),
    paintPageEdge("spineSide"),
  ];
  const [foreTex, headTex, spineSideTex] = pageEdgeTextures;

  const caseDepth = PAGE_D + COVER_T * 2;
  // Spine occupies [0, SPINE_T]; covers tuck slightly into it so the left edge is solid.
  const spineInnerX = SPINE_T;
  const boardLeftX = spineInnerX - SPINE_OVERLAP;
  const boardCenterX = boardLeftX + COVER_W / 2;
  const pageCenterX = spineInnerX + PAGE_W / 2;

  const boardEdge = solidMat("#1a1a1c", 0.78);
  const boardInner = solidMat("#26262a", 0.9);

  // Solid spine slab — joins front and back into one case (no floating hinges).
  const spineMesh = new Mesh(new BoxGeometry(SPINE_T, COVER_H, caseDepth), [
    solidMat("#1c1c1e", 0.75), // +x inner (against pages)
    coverMat(spine, 0.68), // -x outer
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
  ]);
  spineMesh.position.set(SPINE_T / 2, 0, 0);
  spineMesh.name = "spine";
  group.add(spineMesh);

  // Page block flush to spine inner face
  const pages = new Mesh(new BoxGeometry(PAGE_W, PAGE_H, PAGE_D), [
    pageMat(foreTex),
    pageMat(spineSideTex),
    pageMat(headTex),
    pageMat(headTex),
    solidMat("#f7f4ec", 0.95),
    solidMat("#f0ebe2", 0.95),
  ]);
  pages.position.set(pageCenterX, 0, 0);
  pages.name = "pages";
  group.add(pages);

  // Front board — left edge tucked into spine
  const frontCover = new Mesh(new BoxGeometry(COVER_W, COVER_H, COVER_T), [
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
    coverMat(front, 0.55),
    boardInner.clone(),
  ]);
  frontCover.position.set(boardCenterX, 0, PAGE_D / 2 + COVER_T / 2);
  frontCover.name = "front";
  group.add(frontCover);

  // Back board
  const backCover = new Mesh(new BoxGeometry(COVER_W, COVER_H, COVER_T), [
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
    boardEdge.clone(),
    boardInner.clone(),
    coverMat(back, 0.7),
  ]);
  backCover.position.set(boardCenterX, 0, -(PAGE_D / 2 + COVER_T / 2));
  backCover.name = "back";
  group.add(backCover);

  const shadow = new Mesh(
    new PlaneGeometry(COVER_W + SPINE_T * 1.2, caseDepth * 2.2),
    new MeshStandardMaterial({
      color: "#000000",
      transparent: true,
      opacity: 0.13,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(boardCenterX * 0.55, -COVER_H / 2 - 0.01, 0);
  shadow.name = "shadow";
  group.add(shadow);

  group.scale.setScalar(BOOK_SCALE);

  group.updateMatrixWorld(true);
  const box = new Box3().setFromObject(group);
  const center = new Vector3();
  box.getCenter(center);
  center.divideScalar(BOOK_SCALE);
  for (const child of group.children) {
    child.position.sub(center);
  }

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
  camera.lookAt(0, 0, 0);
}

function resolveCoverUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const host = new URL(src).hostname;
    if (
      host === "i.gr-assets.com" ||
      host === "images.gr-assets.com" ||
      host === "s.gr-assets.com" ||
      host.endsWith(".gr-assets.com")
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return src;
  }
  return src;
}

function applyCoverArt(img: HTMLImageElement | null) {
  if (!book) return;

  disposeTexture(frontTexture);
  disposeTexture(backTexture);
  disposeTexture(spineTexture);
  frontTexture = paintBoard(img, "front");
  backTexture = paintBoard(img, "back");
  spineTexture = paintSpine(img);

  const front = book.getObjectByName("front") as Mesh | undefined;
  if (front && Array.isArray(front.material)) {
    const mats = front.material as MeshPhysicalMaterial[];
    const prev = mats[4];
    mats[4] = coverMat(frontTexture, 0.58);
    prev.map = null;
    prev.dispose();
  }

  const back = book.getObjectByName("back") as Mesh | undefined;
  if (back && Array.isArray(back.material)) {
    const mats = back.material as MeshPhysicalMaterial[];
    const prev = mats[5];
    mats[5] = coverMat(backTexture, 0.72);
    prev.map = null;
    prev.dispose();
  }

  const spine = book.getObjectByName("spine") as Mesh | undefined;
  if (spine && Array.isArray(spine.material)) {
    const mats = spine.material as MeshPhysicalMaterial[];
    const prev = mats[1];
    mats[1] = coverMat(spineTexture, 0.68);
    prev.map = null;
    prev.dispose();
  }
}

function loadCover(src: string) {
  const url = resolveCoverUrl(src);
  if (!url) {
    applyCoverArt(null);
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
      applyCoverArt(tex.image as HTMLImageElement);
    },
    undefined,
    () => applyCoverArt(null),
  );
}

function tick() {
  if (!renderer || !scene || !camera || !book) return;

  const now = (performance.now() - clockStart) * 0.001;

  if (!dragging.value) {
    if (reducedMotion.value) {
      velocity.value = 0;
    } else if (Math.abs(velocity.value) > 0.0004) {
      rotY.value += velocity.value;
      velocity.value *= 0.94;
    } else {
      velocity.value = 0;
      rotY.value += 0.0024;
    }
  }

  book.rotation.y = rotY.value;
  const bobY = reducedMotion.value ? 0 : Math.sin(now * 0.85) * 0.028;
  if (reducedMotion.value) {
    book.rotation.x = 0.14;
    book.rotation.z = 0;
  } else {
    book.rotation.x = 0.14 + Math.sin(now * 0.65) * 0.025;
    book.rotation.z = Math.sin(now * 0.4) * 0.01;
  }
  // Keep X/Z locked to origin so the stage stays centered.
  book.position.set(0, bobY, 0);

  const shadow = book.getObjectByName("shadow") as Mesh | undefined;
  if (shadow) {
    shadow.scale.setScalar(1 + Math.abs(bobY) * 0.4);
    const mat = shadow.material as MeshStandardMaterial;
    mat.opacity = Math.max(0.06, 0.14 - Math.abs(bobY) * 0.35);
  }

  renderer.render(scene, camera);
  raf = requestAnimationFrame(tick);
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  velocity.value = 0;
  lastX = e.clientX;
  pointerId = e.pointerId;
  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value || pointerId !== e.pointerId) return;
  const delta = e.clientX - lastX;
  lastX = e.clientX;
  const step = delta * 0.01;
  rotY.value += step;
  velocity.value = step;
}

function onPointerUp(e: PointerEvent) {
  if (pointerId !== null && pointerId !== e.pointerId) return;
  dragging.value = false;
  pointerId = null;
  (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
}

function init() {
  const canvas = canvasRef.value;
  const el = containerRef.value;
  if (!canvas || !el) return;

  scene = new Scene();
  camera = new PerspectiveCamera(28, 1, 0.1, 40);
  camera.position.set(0, 0.04, 3.6);
  camera.lookAt(0, 0, 0);

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  scene.add(new AmbientLight(0xffffff, 0.32));
  scene.add(new HemisphereLight(0xfff8f0, 0x8a8680, 0.55));

  const key = new DirectionalLight(0xfff5ea, 1.25);
  key.position.set(2.8, 3.6, 3.2);
  scene.add(key);

  const fill = new DirectionalLight(0xe8eef8, 0.38);
  fill.position.set(-3.2, 0.8, 1.6);
  scene.add(fill);

  const rim = new DirectionalLight(0xfff0e0, 0.42);
  rim.position.set(-1.2, 2.2, -3.4);
  scene.add(rim);

  const under = new DirectionalLight(0xffffff, 0.18);
  under.position.set(0.4, -2.5, 1.2);
  scene.add(under);

  frontTexture = paintBoard(null, "front");
  backTexture = paintBoard(null, "back");
  spineTexture = paintSpine(null);
  book = buildBook(frontTexture, backTexture, spineTexture);
  scene.add(book);

  clockStart = performance.now();
  setSize();
  resizeObserver = new ResizeObserver(() => setSize());
  resizeObserver.observe(el);

  loadCover(props.src);
  raf = requestAnimationFrame(tick);
}

function disposeScene() {
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (book) {
    const disposedMats = new Set<object>();
    book.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (disposedMats.has(m)) continue;
          disposedMats.add(m);
          if (
            m.map &&
            m.map !== frontTexture &&
            m.map !== backTexture &&
            m.map !== spineTexture &&
            !pageEdgeTextures.includes(m.map as CanvasTexture)
          ) {
            m.map.dispose();
          }
          m.dispose();
        }
      }
    });
    book = null;
  }

  pageEdgeTextures.forEach(disposeTexture);
  pageEdgeTextures = [];
  disposeTexture(frontTexture);
  disposeTexture(backTexture);
  disposeTexture(spineTexture);
  disposeTexture(coverTexture);
  frontTexture = null;
  backTexture = null;
  spineTexture = null;
  coverTexture = null;

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
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.14)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(0,0,0,0.4)_100%)]"
      aria-hidden="true"
    />
  </div>
</template>
