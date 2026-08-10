<script setup lang="ts">
/**
 * Direction: couch-over-shoulder cinema — static room, camera orbits the TV.
 * Screen is the hero; couch/popcorn frame the lower edge for depth.
 */
import * as THREE from "three";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  src: string;
}>();

const colorMode = useColorMode();
const { reducedMotion } = useSettings();
const isDark = computed(() => colorMode.value === "dark");

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let room: THREE.Group | null = null;
let screenMesh: THREE.Mesh | null = null;
let scanlineMesh: THREE.Mesh | null = null;
let screenGlow: THREE.PointLight | null = null;
let dust: THREE.Points | null = null;
let resizeObserver: ResizeObserver | null = null;
let raf = 0;
let disposed = false;
let clockStart = 0;
let scanlineTexture: THREE.CanvasTexture | null = null;

/** Orbit around the TV look target (spherical). */
const ORBIT_TARGET = new THREE.Vector3(0, 1.12, -1.55);
const ORBIT_RADIUS = 3.95;
/** Default: slightly off-axis, just above eye level over the couch. */
const DEFAULT_THETA = 0.38;
const DEFAULT_PHI = 1.38;

const theta = ref(DEFAULT_THETA);
const phi = ref(DEFAULT_PHI);
const velocityTheta = ref(0);
const dragging = ref(false);
let lastX = 0;
let lastY = 0;

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = "anonymous";
let currentTexture: THREE.Texture | null = null;
const sharedGeometries: THREE.BufferGeometry[] = [];

function trackGeo<T extends THREE.BufferGeometry>(geo: T): T {
  sharedGeometries.push(geo);
  return geo;
}

function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = mesh.material;
    if (!mat) return;
    const mats = Array.isArray(mat) ? mat : [mat];
    for (const m of mats) {
      const map = (m as THREE.MeshStandardMaterial).map;
      if (map && map !== currentTexture) map.dispose();
      m.dispose();
    }
  });
}

function disposeSharedGeometries() {
  for (const geo of sharedGeometries) geo.dispose();
  sharedGeometries.length = 0;
}

function themeColors() {
  if (isDark.value) {
    return {
      bg: 0x0a0a0a,
      floor: 0x141414,
      rug: 0x1c1c1c,
      wall: 0x101010,
      tv: 0x141414,
      tvEdge: 0x222222,
      stand: 0x3f3f46,
      couch: 0x3a3a40,
      couchDark: 0x27272a,
      cushion: 0x4a4a52,
      table: 0x2a2a2e,
      bucket: 0x3f3f46,
      bucketStripe: 0xe4e4e7,
      bucketRim: 0x71717a,
      kernel: [0xf5f5f4, 0xe7e5e4, 0xd6d3d1, 0xfafaf9],
      bottle: 0xb8bcc4,
      bottleLiquid: 0x2a2a2e,
      bottleLabel: 0x1c1c1c,
      bottleCap: 0x3f3f46,
      screenFallback: 0x262626,
    };
  }
  return {
    bg: 0xf4f4f5,
    floor: 0xe4e4e7,
    rug: 0xd4d4d8,
    wall: 0xefefef,
    tv: 0x171717,
    tvEdge: 0x262626,
    stand: 0x525252,
    couch: 0x9a9a9a,
    couchDark: 0x737373,
    cushion: 0xb0b0b0,
    table: 0x8a8a8a,
    bucket: 0x404040,
    bucketStripe: 0xf5f5f5,
    bucketRim: 0x737373,
    kernel: [0xfafaf9, 0xf5f5f4, 0xe7e5e4, 0xfffbeb],
    bottle: 0xd4d4d8,
    bottleLiquid: 0x3f3f46,
    bottleLabel: 0x262626,
    bottleCap: 0x525252,
    screenFallback: 0x404040,
  };
}

function mat(
  color: number,
  opts?: { roughness?: number; metalness?: number },
) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts?.roughness ?? 0.72,
    metalness: opts?.metalness ?? 0.08,
  });
}

function resolveCoverUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const host = new URL(src).hostname;
    if (
      host === "image.tmdb.org" ||
      host === "howlongtobeat.com" ||
      host === "www.howlongtobeat.com" ||
      host.endsWith(".scdn.co") ||
      host === "images.igdb.com"
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return src;
  }
  return src;
}

function makeScanlineTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 4;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  for (let y = 0; y < 128; y++) {
    const a = y % 3 === 0 ? 0.14 : y % 3 === 1 ? 0.04 : 0;
    ctx.fillStyle = `rgba(0,0,0,${a})`;
    ctx.fillRect(0, y, 4, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  tex.needsUpdate = true;
  return tex;
}

function buildDust(): THREE.Points {
  const count = 36;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 1] = 0.4 + Math.random() * 2.4;
    positions[i * 3 + 2] = -1.2 + Math.random() * 2.8;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: isDark.value ? 0xffffff : 0x222222,
      size: 0.022,
      transparent: true,
      opacity: isDark.value ? 0.22 : 0.12,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
}

function buildTv(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  group.position.set(0, 1.2, -1.85);

  const bezel = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.85, 1.62, 0.08)),
    mat(colors.tv, { roughness: 0.4, metalness: 0.3 }),
  );
  group.add(bezel);

  const frame = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.72, 1.5, 0.02)),
    mat(colors.tvEdge, { roughness: 0.35, metalness: 0.25 }),
  );
  frame.position.z = 0.045;
  group.add(frame);

  screenMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(2.58, 1.4)),
    new THREE.MeshStandardMaterial({
      color: colors.screenFallback,
      roughness: 0.28,
      metalness: 0.04,
      emissive: new THREE.Color(colors.screenFallback),
      emissiveIntensity: 0.18,
    }),
  );
  screenMesh.position.z = 0.06;
  group.add(screenMesh);

  scanlineTexture = makeScanlineTexture();
  scanlineMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(2.58, 1.4)),
    new THREE.MeshBasicMaterial({
      map: scanlineTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    }),
  );
  scanlineMesh.position.z = 0.065;
  group.add(scanlineMesh);

  screenGlow = new THREE.PointLight(0xffffff, 0.35, 6, 1.6);
  screenGlow.position.set(0, 0, 0.45);
  group.add(screenGlow);

  // Thin wall bracket — no freestanding stand
  const bracket = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.55, 0.12, 0.06)),
    mat(colors.stand, { roughness: 0.45, metalness: 0.5 }),
  );
  bracket.position.set(0, 0, -0.07);
  group.add(bracket);

  return group;
}

function buildCouch(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  // Foreground — frames lower edge of the over-shoulder shot
  group.position.set(0.25, 0.02, 1.85);
  group.rotation.y = -0.12;
  group.scale.setScalar(0.92);

  const seat = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.9, 0.34, 1.05)),
    mat(colors.couch, { roughness: 0.92 }),
  );
  seat.position.set(0, 0.22, 0.08);
  group.add(seat);

  const back = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(2.9, 0.88, 0.26)),
    mat(colors.couchDark, { roughness: 0.9 }),
  );
  back.position.set(0, 0.68, -0.4);
  group.add(back);

  const cushionL = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.28, 0.2, 0.88)),
    mat(colors.cushion, { roughness: 0.95 }),
  );
  cushionL.position.set(-0.68, 0.46, 0.1);
  group.add(cushionL);

  const cushionR = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(1.28, 0.2, 0.88)),
    mat(colors.cushion, { roughness: 0.95 }),
  );
  cushionR.position.set(0.68, 0.46, 0.1);
  group.add(cushionR);

  const armGeo = trackGeo(new THREE.BoxGeometry(0.26, 0.62, 1.05));
  const armL = new THREE.Mesh(
    armGeo,
    mat(colors.couchDark, { roughness: 0.88 }),
  );
  armL.position.set(-1.55, 0.42, 0.08);
  group.add(armL);

  const armR = new THREE.Mesh(
    armGeo,
    mat(colors.couchDark, { roughness: 0.88 }),
  );
  armR.position.set(1.55, 0.42, 0.08);
  group.add(armR);

  const legGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 0.2, 10));
  for (const x of [-1.2, 1.2]) {
    for (const z of [0.35, -0.3]) {
      const leg = new THREE.Mesh(
        legGeo,
        mat(colors.stand, { roughness: 0.5, metalness: 0.3 }),
      );
      leg.position.set(x, -0.02, z);
      group.add(leg);
    }
  }

  return group;
}

function buildTable(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  group.position.set(-0.95, 0.02, 0.55);

  const top = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.42, 0.42, 0.04, 28)),
    mat(colors.table, { roughness: 0.55, metalness: 0.12 }),
  );
  top.position.y = 0.28;
  group.add(top);

  const stem = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.05, 0.07, 0.26, 12)),
    mat(colors.stand, { roughness: 0.5, metalness: 0.35 }),
  );
  stem.position.y = 0.14;
  group.add(stem);

  const foot = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 24)),
    mat(colors.stand, { roughness: 0.48, metalness: 0.4 }),
  );
  foot.position.y = 0.015;
  group.add(foot);

  return group;
}

function hexCss(n: number) {
  return `#${n.toString(16).padStart(6, "0")}`;
}

function makeBucketStripeTexture(
  dark: number,
  light: number,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const stripeN = 14;
  for (let i = 0; i < stripeN; i++) {
    ctx.fillStyle = i % 2 === 0 ? hexCss(dark) : hexCss(light);
    ctx.fillRect((i / stripeN) * 512, 0, 512 / stripeN + 1, 256);
  }
  // Soft paper grain
  const img = ctx.getImageData(0, 0, 512, 256);
  for (let p = 0; p < img.data.length; p += 4) {
    const n = (Math.random() - 0.5) * 14;
    img.data[p] = Math.max(0, Math.min(255, img.data[p]! + n));
    img.data[p + 1] = Math.max(0, Math.min(255, img.data[p + 1]! + n));
    img.data[p + 2] = Math.max(0, Math.min(255, img.data[p + 2]! + n));
  }
  ctx.putImageData(img, 0, 0);
  // Top/bottom edge shade for rolled paper feel
  const fade = ctx.createLinearGradient(0, 0, 0, 256);
  fade.addColorStop(0, "rgba(0,0,0,0.18)");
  fade.addColorStop(0.08, "rgba(0,0,0,0)");
  fade.addColorStop(0.92, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, 512, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function buildPopcornBucket(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  group.position.set(0, 0.02, -1.22);
  group.rotation.y = 0.18;

  const bucketH = 0.46;
  const topR = 0.21;
  const botR = 0.15;
  const wall = 0.01;

  const stripeTex = makeBucketStripeTexture(colors.bucket, colors.bucketStripe);
  const paperMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    roughness: 0.92,
    metalness: 0.0,
    side: THREE.DoubleSide,
  });

  const outer = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(topR, botR, bucketH, 48, 1, true)),
    paperMat,
  );
  outer.position.y = bucketH / 2;
  group.add(outer);

  const innerMat = mat(colors.bucketStripe, { roughness: 0.88 });
  innerMat.side = THREE.BackSide;
  const inner = new THREE.Mesh(
    trackGeo(
      new THREE.CylinderGeometry(
        topR - wall,
        botR - wall,
        bucketH - 0.01,
        40,
        1,
        true,
      ),
    ),
    innerMat,
  );
  inner.position.y = bucketH / 2 + 0.005;
  group.add(inner);

  // Rolled paper rim
  const rim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(topR - 0.004, 0.014, 10, 40)),
    mat(colors.bucketRim, { roughness: 0.78 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = bucketH;
  group.add(rim);

  const lip = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(topR + 0.004, topR - 0.002, 0.018, 40)),
    mat(colors.bucketStripe, { roughness: 0.86 }),
  );
  lip.position.y = bucketH - 0.004;
  group.add(lip);

  const bottom = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(botR - 0.005, 36)),
    mat(colors.bucket, { roughness: 0.9 }),
  );
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = 0.012;
  group.add(bottom);

  // Heap of popcorn that clearly fills and overflows the rim
  const kernelGeos = [
    trackGeo(new THREE.IcosahedronGeometry(0.036, 0)),
    trackGeo(new THREE.DodecahedronGeometry(0.034, 0)),
    trackGeo(new THREE.SphereGeometry(0.032, 7, 6)),
  ];

  for (let i = 0; i < 120; i++) {
    const color = colors.kernel[i % colors.kernel.length]!;
    const geo = kernelGeos[i % kernelGeos.length]!;
    const kernel = new THREE.Mesh(
      geo,
      mat(color, { roughness: 0.94 }),
    );
    const layer = Math.floor(i / 15);
    const inLayer = i % 15;
    const a = (inLayer / 15) * Math.PI * 2 + layer * 0.37;
    // Wider layers near the top so the mound spills over the rim
    const rimFactor = layer < 4 ? 0.55 : 0.85 + (layer - 4) * 0.06;
    const r = (0.04 + (inLayer % 5) * 0.028) * (0.7 + layer * 0.08);
    const cappedR = Math.min(r, topR * rimFactor);
    kernel.position.set(
      Math.cos(a) * cappedR,
      bucketH * 0.62 + layer * 0.032 + (inLayer % 3) * 0.012,
      Math.sin(a) * cappedR * 0.95,
    );
    kernel.rotation.set(
      (i % 5) * 0.7,
      (i % 7) * 0.55,
      (i % 3) * 0.9,
    );
    kernel.scale.set(
      1.0 + (i % 4) * 0.35,
      0.75 + (i % 5) * 0.28,
      1.05 + (i % 3) * 0.3,
    );
    group.add(kernel);
  }

  return group;
}

function buildDrink(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  group.position.set(0.36, 0.02, -1.16);
  group.rotation.y = -0.22;

  // Classic PET bottle silhouette via lathe
  const profile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.055, 0.0),
    new THREE.Vector2(0.062, 0.018),
    new THREE.Vector2(0.068, 0.06),
    new THREE.Vector2(0.072, 0.14),
    new THREE.Vector2(0.074, 0.26),
    new THREE.Vector2(0.07, 0.32),
    new THREE.Vector2(0.048, 0.38),
    new THREE.Vector2(0.026, 0.43),
    new THREE.Vector2(0.024, 0.5),
    new THREE.Vector2(0.03, 0.505),
  ];
  const bottleGeo = trackGeo(new THREE.LatheGeometry(profile, 48));

  const plastic = new THREE.MeshPhysicalMaterial({
    color: colors.bottle,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 0.7,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const bottle = new THREE.Mesh(bottleGeo, plastic);
  group.add(bottle);

  // Liquid fill
  const liquid = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.062, 0.058, 0.26, 28)),
    new THREE.MeshPhysicalMaterial({
      color: colors.bottleLiquid,
      roughness: 0.28,
      metalness: 0.0,
      clearcoat: 0.4,
      clearcoatRoughness: 0.35,
      transparent: true,
      opacity: 0.88,
    }),
  );
  liquid.position.y = 0.16;
  group.add(liquid);

  // Label wrap
  const label = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.075, 0.073, 0.14, 36, 1, true)),
    mat(colors.bottleLabel, { roughness: 0.72 }),
  );
  label.position.y = 0.2;
  group.add(label);

  // Thin highlight stripe on label
  const labelBand = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.076, 0.0745, 0.018, 36)),
    mat(colors.bucketStripe, { roughness: 0.55 }),
  );
  labelBand.position.y = 0.2;
  group.add(labelBand);

  // Screw cap
  const cap = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.032, 0.031, 0.038, 20)),
    mat(colors.bottleCap, { roughness: 0.45, metalness: 0.08 }),
  );
  cap.position.y = 0.524;
  group.add(cap);

  const capTop = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(0.031, 20)),
    mat(colors.bottleCap, { roughness: 0.4 }),
  );
  capTop.rotation.x = -Math.PI / 2;
  capTop.position.y = 0.544;
  group.add(capTop);

  // Cap ridges
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    const ridge = new THREE.Mesh(
      trackGeo(new THREE.BoxGeometry(0.006, 0.034, 0.004)),
      mat(colors.bottleCap, { roughness: 0.5 }),
    );
    ridge.position.set(Math.cos(a) * 0.033, 0.524, Math.sin(a) * 0.033);
    ridge.lookAt(0, 0.524, 0);
    group.add(ridge);
  }

  return group;
}

function buildRoom() {
  if (!scene) return;
  if (room) {
    scene.remove(room);
    disposeObject(room);
    if (dust) {
      dust.geometry.dispose();
      (dust.material as THREE.PointsMaterial).dispose();
      dust = null;
    }
    if (scanlineTexture) {
      scanlineTexture.dispose();
      scanlineTexture = null;
    }
    disposeSharedGeometries();
    room = null;
    screenMesh = null;
    scanlineMesh = null;
    screenGlow = null;
  }

  const colors = themeColors();
  scene.background = new THREE.Color(colors.bg);

  room = new THREE.Group();

  const floor = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(5.2, 56)),
    mat(colors.floor, { roughness: 0.96 }),
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  const rug = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(1.55, 40)),
    mat(colors.rug, { roughness: 0.98 }),
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.008, -0.15);
  room.add(rug);

  const wall = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(7.5, 3.6)),
    mat(colors.wall, { roughness: 1 }),
  );
  wall.position.set(0, 1.75, -2.15);
  room.add(wall);

  // Soft side walls for vanishing lines
  const sideGeo = trackGeo(new THREE.PlaneGeometry(4.2, 3.6));
  const wallL = new THREE.Mesh(sideGeo, mat(colors.wall, { roughness: 1 }));
  wallL.position.set(-3.5, 1.75, -0.1);
  wallL.rotation.y = Math.PI / 2;
  room.add(wallL);

  const wallR = new THREE.Mesh(sideGeo, mat(colors.wall, { roughness: 1 }));
  wallR.position.set(3.5, 1.75, -0.1);
  wallR.rotation.y = -Math.PI / 2;
  room.add(wallR);

  room.add(buildTv(colors));
  room.add(buildCouch(colors));
  room.add(buildTable(colors));
  room.add(buildPopcornBucket(colors));
  room.add(buildDrink(colors));

  dust = buildDust();
  room.add(dust);

  scene.add(room);
  applyScreenTexture(props.src);
}

function applyScreenTexture(src: string) {
  if (!screenMesh) return;
  const material = screenMesh.material as THREE.MeshStandardMaterial;
  const url = resolveCoverUrl(src);

  if (!url) {
    material.map = null;
    material.color.setHex(themeColors().screenFallback);
    material.emissive.setHex(themeColors().screenFallback);
    material.emissiveIntensity = 0.12;
    material.needsUpdate = true;
    if (screenGlow) screenGlow.intensity = 0.15;
    return;
  }

  textureLoader.load(
    url,
    (texture) => {
      if (disposed || !screenMesh) {
        texture.dispose();
        return;
      }
      if (currentTexture) currentTexture.dispose();
      currentTexture = texture;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      material.map = texture;
      material.color.setHex(0xffffff);
      material.emissive.setHex(0x1a1a1a);
      material.emissiveIntensity = 0.42;
      material.needsUpdate = true;
      if (screenGlow) screenGlow.intensity = 0.55;
    },
    undefined,
    () => {
      if (!screenMesh) return;
      material.map = null;
      material.color.setHex(themeColors().screenFallback);
      material.emissiveIntensity = 0.12;
      material.needsUpdate = true;
      if (screenGlow) screenGlow.intensity = 0.15;
    },
  );
}

function updateCamera() {
  if (!camera) return;
  const t = theta.value;
  const p = phi.value;
  const sinP = Math.sin(p);
  camera.position.set(
    ORBIT_TARGET.x + ORBIT_RADIUS * sinP * Math.sin(t),
    ORBIT_TARGET.y + ORBIT_RADIUS * Math.cos(p),
    ORBIT_TARGET.z + ORBIT_RADIUS * sinP * Math.cos(t),
  );
  camera.lookAt(ORBIT_TARGET);
}

function measure() {
  const el = containerRef.value;
  if (!el || !renderer || !camera) return;
  const w = el.clientWidth;
  const h = el.clientHeight;
  if (w <= 0 || h <= 0) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function onPointerDown(e: PointerEvent) {
  dragging.value = true;
  velocityTheta.value = 0;
  lastX = e.clientX;
  lastY = e.clientY;
  (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  theta.value += dx * 0.0045;
  phi.value = Math.max(
    1.05,
    Math.min(1.52, phi.value + dy * 0.0028),
  );
  velocityTheta.value = dx * 0.0045;
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false;
  (e.currentTarget as HTMLElement | null)?.releasePointerCapture?.(
    e.pointerId,
  );
}

function tick() {
  if (disposed) return;
  const now = performance.now();

  if (!dragging.value) {
    if (reducedMotion.value) {
      velocityTheta.value = 0;
      theta.value += (DEFAULT_THETA - theta.value) * 0.08;
      phi.value += (DEFAULT_PHI - phi.value) * 0.08;
    } else if (Math.abs(velocityTheta.value) > 0.00035) {
      theta.value += velocityTheta.value;
      velocityTheta.value *= 0.93;
    } else {
      velocityTheta.value = 0;
      // Ease toward default, then add a quiet over-shoulder sway
      const t = (now - clockStart) * 0.00028;
      const homeTheta = DEFAULT_THETA + Math.sin(t) * 0.085;
      const homePhi = DEFAULT_PHI + Math.sin(t * 0.7) * 0.025;
      theta.value += (homeTheta - theta.value) * 0.035;
      phi.value += (homePhi - phi.value) * 0.035;
    }
  }

  // Clamp yaw so we never flip behind the wall
  theta.value = Math.max(-0.95, Math.min(1.15, theta.value));

  updateCamera();

  if (!reducedMotion.value) {
    const t = (now - clockStart) * 0.001;
    if (scanlineTexture) {
      scanlineTexture.offset.y = (t * 0.12) % 1;
    }
    if (screenMesh) {
      const mat = screenMesh.material as THREE.MeshStandardMaterial;
      const base = mat.map ? 0.42 : 0.12;
      // Quiet CRT flicker — rare spikes, mostly stable
      const flicker =
        Math.sin(t * 37) > 0.972 ? 0.08 : Math.sin(t * 2.1) * 0.015;
      mat.emissiveIntensity = base + flicker;
    }
    if (screenGlow) {
      const baseGlow = currentTexture ? 0.55 : 0.15;
      screenGlow.intensity = baseGlow + Math.sin(t * 1.6) * 0.04;
    }
    if (dust) {
      dust.rotation.y = t * 0.03;
      const positions = dust.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i) + Math.sin(t * 0.4 + i) * 0.00035;
        positions.setY(i, y > 3.2 ? 0.35 : y);
      }
      positions.needsUpdate = true;
    }
    if (scanlineMesh) {
      (scanlineMesh.material as THREE.MeshBasicMaterial).opacity =
        0.35 + Math.sin(t * 0.9) * 0.08;
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(tick);
}

function init() {
  const canvas = canvasRef.value;
  const el = containerRef.value;
  if (!canvas || !el) return;

  disposed = false;
  clockStart = performance.now();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(46, 1, 0.1, 50);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x3a3a3a, 0.7);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.05);
  key.position.set(2.2, 4.2, 3.8);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.28);
  fill.position.set(-2.8, 2.2, 1.5);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.22);
  rim.position.set(0.5, 2.5, -3.5);
  scene.add(rim);

  buildRoom();
  updateCamera();
  measure();
  raf = requestAnimationFrame(tick);

  resizeObserver = new ResizeObserver(() => measure());
  resizeObserver.observe(el);
}

function teardown() {
  disposed = true;
  cancelAnimationFrame(raf);
  resizeObserver?.disconnect();
  resizeObserver = null;

  if (room && scene) {
    scene.remove(room);
    disposeObject(room);
    if (dust) {
      dust.geometry.dispose();
      (dust.material as THREE.PointsMaterial).dispose();
      dust = null;
    }
    disposeSharedGeometries();
  }
  if (currentTexture) {
    currentTexture.dispose();
    currentTexture = null;
  }
  if (scanlineTexture) {
    scanlineTexture.dispose();
    scanlineTexture = null;
  }
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  room = null;
  screenMesh = null;
  scanlineMesh = null;
  screenGlow = null;
  dust = null;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  teardown();
});

watch(
  () => props.src,
  (src) => applyScreenTexture(src),
);

watch(isDark, () => {
  if (!scene) return;
  buildRoom();
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
    <canvas ref="canvasRef" class="h-full w-full" aria-hidden="true" />
  </div>
</template>
