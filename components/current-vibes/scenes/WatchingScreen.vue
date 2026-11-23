<script setup lang="ts">
/**
 * Direction: cinema one-sheet on a quiet gallery wall — portrait 2:3 print
 * in a thin lobby frame; orbit stays on the poster, no snack props.
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
let screenGlow: THREE.PointLight | null = null;
let dust: THREE.Points | null = null;
let resizeObserver: ResizeObserver | null = null;
let raf = 0;
let disposed = false;
let clockStart = 0;

/** Classic US one-sheet ≈ 27×40 → 2:3 portrait. */
const POSTER_W = 1.78;
const POSTER_H = POSTER_W * (3 / 2);
const FRAME_W = 0.048;
const FRAME_D = 0.022;

/** Orbit around the poster face. */
const ORBIT_TARGET = new THREE.Vector3(0, 1.58, -1.9);
const ORBIT_RADIUS = 4.05;
/** Slightly off-axis, looking at a tall lobby print. */
const DEFAULT_THETA = 0.18;
const DEFAULT_PHI = 1.4;

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
      floor: 0x121212,
      wall: 0x0e0e0e,
      frame: 0x0a0a0a,
      matte: 0x141414,
      posterBack: 0x111111,
      screenFallback: 0x262626,
    };
  }
  return {
    bg: 0xf4f4f5,
    floor: 0xe8e8ea,
    wall: 0xf0f0f0,
    frame: 0x1a1a1a,
    matte: 0xfafafa,
    posterBack: 0x222222,
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

function buildDust(): THREE.Points {
  const count = 28;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4.2;
    positions[i * 3 + 1] = 0.5 + Math.random() * 2.6;
    positions[i * 3 + 2] = -1.4 + Math.random() * 2.4;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      color: isDark.value ? 0xffffff : 0x222222,
      size: 0.02,
      transparent: true,
      opacity: isDark.value ? 0.18 : 0.1,
      depthWrite: false,
      sizeAttenuation: true,
    }),
  );
}

function buildCinemaPoster(colors: ReturnType<typeof themeColors>) {
  const group = new THREE.Group();
  // Flush to the back wall (wall at z = -2.15)
  group.position.set(0, 1.58, -2.12);

  const outerW = POSTER_W + FRAME_W * 2;
  const outerH = POSTER_H + FRAME_W * 2;
  const frameMat = mat(colors.frame, { roughness: 0.48, metalness: 0.22 });

  // Paper-thin backing board (not a solid slab — keeps the print readable)
  const backing = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(POSTER_W + 0.02, POSTER_H + 0.02, 0.006)),
    mat(colors.posterBack, { roughness: 0.92 }),
  );
  backing.position.z = -0.004;
  group.add(backing);

  // Quiet matte border peeking between moulding and art
  const matte = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(POSTER_W + 0.03, POSTER_H + 0.03)),
    mat(colors.matte, { roughness: 0.96 }),
  );
  matte.position.z = 0.002;
  group.add(matte);

  screenMesh = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(POSTER_W, POSTER_H)),
    new THREE.MeshStandardMaterial({
      color: colors.screenFallback,
      roughness: 0.78,
      metalness: 0,
      emissive: new THREE.Color(colors.screenFallback),
      emissiveIntensity: 0.06,
    }),
  );
  screenMesh.position.z = 0.006;
  group.add(screenMesh);

  // Lobby moulding — four thin rails only (open center for the one-sheet)
  const top = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(outerW, FRAME_W, FRAME_D)),
    frameMat,
  );
  top.position.set(0, (POSTER_H + FRAME_W) / 2, 0.01);
  group.add(top);

  const bottom = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(outerW, FRAME_W, FRAME_D)),
    frameMat,
  );
  bottom.position.set(0, -(POSTER_H + FRAME_W) / 2, 0.01);
  group.add(bottom);

  const sideH = POSTER_H;
  const left = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(FRAME_W, sideH, FRAME_D)),
    frameMat,
  );
  left.position.set(-(POSTER_W + FRAME_W) / 2, 0, 0.01);
  group.add(left);

  const right = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(FRAME_W, sideH, FRAME_D)),
    frameMat,
  );
  right.position.set((POSTER_W + FRAME_W) / 2, 0, 0.01);
  group.add(right);

  // Soft wash off the print face
  screenGlow = new THREE.PointLight(0xfff5e8, 0.12, 4.2, 2.2);
  screenGlow.position.set(0, 0, 0.5);
  group.add(screenGlow);

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
    disposeSharedGeometries();
    room = null;
    screenMesh = null;
    screenGlow = null;
  }

  const colors = themeColors();
  scene.background = new THREE.Color(colors.bg);

  room = new THREE.Group();

  const floor = new THREE.Mesh(
    trackGeo(new THREE.CircleGeometry(5.0, 56)),
    mat(colors.floor, { roughness: 0.96 }),
  );
  floor.rotation.x = -Math.PI / 2;
  room.add(floor);

  const wall = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(7.2, 4.0)),
    mat(colors.wall, { roughness: 1 }),
  );
  wall.position.set(0, 1.95, -2.15);
  room.add(wall);

  const sideGeo = trackGeo(new THREE.PlaneGeometry(4.0, 4.0));
  const wallL = new THREE.Mesh(sideGeo, mat(colors.wall, { roughness: 1 }));
  wallL.position.set(-3.4, 1.95, -0.15);
  wallL.rotation.y = Math.PI / 2;
  room.add(wallL);

  const wallR = new THREE.Mesh(sideGeo, mat(colors.wall, { roughness: 1 }));
  wallR.position.set(3.4, 1.95, -0.15);
  wallR.rotation.y = -Math.PI / 2;
  room.add(wallR);

  room.add(buildCinemaPoster(colors));

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
    material.emissiveIntensity = 0.05;
    material.roughness = 0.86;
    material.needsUpdate = true;
    if (screenGlow) screenGlow.intensity = 0.08;
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
      material.emissive.setHex(0x0a0a0a);
      material.emissiveIntensity = 0.06;
      material.roughness = 0.78;
      material.needsUpdate = true;
      if (screenGlow) screenGlow.intensity = 0.1;
    },
    undefined,
    () => {
      if (!screenMesh) return;
      material.map = null;
      material.color.setHex(themeColors().screenFallback);
      material.emissiveIntensity = 0.05;
      material.roughness = 0.86;
      material.needsUpdate = true;
      if (screenGlow) screenGlow.intensity = 0.08;
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
  phi.value = Math.max(1.08, Math.min(1.5, phi.value + dy * 0.0028));
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
      const t = (now - clockStart) * 0.00028;
      const homeTheta = DEFAULT_THETA + Math.sin(t) * 0.07;
      const homePhi = DEFAULT_PHI + Math.sin(t * 0.7) * 0.02;
      theta.value += (homeTheta - theta.value) * 0.035;
      phi.value += (homePhi - phi.value) * 0.035;
    }
  }

  theta.value = Math.max(-0.85, Math.min(0.95, theta.value));

  updateCamera();

  if (!reducedMotion.value) {
    const t = (now - clockStart) * 0.001;
    if (screenMesh) {
      const m = screenMesh.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = m.map ? 0.06 : 0.05;
    }
    if (screenGlow) {
      const baseGlow = currentTexture ? 0.1 : 0.07;
      screenGlow.intensity = baseGlow + Math.sin(t * 1.1) * 0.01;
    }
    if (dust) {
      dust.rotation.y = t * 0.025;
      const positions = dust.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      for (let i = 0; i < positions.count; i++) {
        const y = positions.getY(i) + Math.sin(t * 0.4 + i) * 0.0003;
        positions.setY(i, y > 3.4 ? 0.4 : y);
      }
      positions.needsUpdate = true;
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
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x3a3a3a, 0.65);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(2.0, 4.0, 3.6);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.32);
  fill.position.set(-2.6, 2.4, 1.8);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 0.2);
  rim.position.set(0.4, 2.8, -3.2);
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
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  room = null;
  screenMesh = null;
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
