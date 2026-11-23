<script setup lang="ts">
/**
 * Direction: Three.js Switch-style game cart (front cover + back pins),
 * drag-to-spin with idle drift; CSS 3D replaced for correct depth/edges.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  Color,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  HemisphereLight,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { useSettings } from "~/composables/settings";

const props = defineProps<{
  src: string;
  title?: string;
  progressPercentage?: number;
}>();

const { reducedMotion } = useSettings();

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

/** Switch-ish proportions; thin black shell all around. */
const CART_W = 1.12;
const CART_H = 1.58;
const CART_D = 0.07;
const PIN_COUNT = 11;
const CART_SCALE = 0.7;

const cartTitle = computed(() => {
  const raw = (props.title ?? "").trim();
  if (!raw) return "";
  return raw.length > 48 ? `${raw.slice(0, 48)}…` : raw;
});

let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let cart: Group | null = null;
let progressRing: Mesh | null = null;
let dust: Points | null = null;
let frontTexture: CanvasTexture | null = null;
let backTexture: CanvasTexture | null = null;
let coverTexture: Texture | null = null;
let envMap: Texture | null = null;
let pmrem: PMREMGenerator | null = null;
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let clockStart = 0;

const rotY = ref(-0.55);
const velocity = ref(0);
const dragging = ref(false);
let lastX = 0;
let pointerId: number | null = null;

const TEX_W = 1536;
const TEX_H = Math.round(TEX_W * (CART_H / CART_W));

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

function paintBackFace(title = ""): CanvasTexture {
  const w = TEX_W;
  const h = TEX_H;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#141414";
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.globalAlpha = 0.045;
  for (let i = 0; i < 4200; i++) {
    const g = (Math.random() * 255) | 0;
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, 1.5, 1.5);
  }
  ctx.restore();

  const label = title.trim();
  if (label) {
    // Game name above the contact well (Switch cart back label area)
    const maxW = w * 0.78;
    const cx = w * 0.5;
    const cy = h * 0.26;
    let fontPx = Math.round(w * 0.055);
    ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;

    const words = label.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width <= maxW) {
        line = next;
      } else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    while (lines.length > 3) {
      lines.pop();
    }
    if (lines.length === 3) {
      const last = lines[2];
      if (ctx.measureText(last).width > maxW) {
        let clipped = last;
        while (
          clipped.length > 1 &&
          ctx.measureText(`${clipped}…`).width > maxW
        ) {
          clipped = clipped.slice(0, -1);
        }
        lines[2] = `${clipped}…`;
      }
    }

    while (fontPx > 22) {
      ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
      const widest = Math.max(...lines.map((l) => ctx.measureText(l).width));
      if (widest <= maxW) break;
      fontPx -= 2;
    }
    ctx.font = `600 ${fontPx}px ui-sans-serif, system-ui, sans-serif`;
    const lineH = fontPx * 1.2;
    const blockH = lines.length * lineH;
    let y = cy - blockH / 2 + lineH / 2;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const row of lines) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillText(row, cx + 1.5, y + 1.5);
      ctx.fillStyle = "rgba(220,220,220,0.88)";
      ctx.fillText(row, cx, y);
      y += lineH;
    }
  } else {
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    const lines = [
      [w * 0.09, h * 0.1, w * 0.38],
      [w * 0.09, h * 0.128, w * 0.26],
      [w * 0.09, h * 0.156, w * 0.32],
      [w * 0.09, h * 0.184, w * 0.2],
    ] as const;
    for (const [x, y, len] of lines) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + len, y);
      ctx.stroke();
    }
  }

  const rx = w * 0.09;
  const ry = h * 0.46;
  const rw = w * 0.82;
  const rh = h * 0.42;

  // Outer lip
  ctx.fillStyle = "#1c1c1c";
  ctx.beginPath();
  ctx.roundRect(rx - 4, ry - 4, rw + 8, rh + 8, 8);
  ctx.fill();

  // Inner well
  const wellGrad = ctx.createLinearGradient(rx, ry, rx, ry + rh);
  wellGrad.addColorStop(0, "#050505");
  wellGrad.addColorStop(0.5, "#0a0a0a");
  wellGrad.addColorStop(1, "#080808");
  ctx.fillStyle = wellGrad;
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 5);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(rx + 1.5, ry + 1.5, rw - 3, rh - 3);

  // Dark pin slots only — gold contacts are real meshes
  const padX = rw * 0.055;
  const padY = rh * 0.09;
  const gap = Math.max(3, rw * 0.012);
  const pinAreaW = rw - padX * 2;
  const pinSlotW = (pinAreaW - gap * (PIN_COUNT - 1)) / PIN_COUNT;
  const pinH = rh - padY * 2;
  const pinTop = ry + padY;

  for (let i = 0; i < PIN_COUNT; i++) {
    const x = rx + padX + i * (pinSlotW + gap);
    const slot = ctx.createLinearGradient(x, pinTop, x + pinSlotW, pinTop);
    slot.addColorStop(0, "#020202");
    slot.addColorStop(0.5, "#0c0c0c");
    slot.addColorStop(1, "#020202");
    ctx.fillStyle = slot;
    ctx.beginPath();
    ctx.roundRect(x, pinTop, pinSlotW, pinH, 2);
    ctx.fill();
  }

  return prepCanvasTexture(new CanvasTexture(c));
}

function paintFrontFrame(
  art: HTMLImageElement | null,
  title = "",
): CanvasTexture {
  const w = TEX_W;
  const h = TEX_H;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;

  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(0, 0, w, h);

  const sheen = ctx.createLinearGradient(0, 0, w * 0.7, h);
  sheen.addColorStop(0, "rgba(255,255,255,0.12)");
  sheen.addColorStop(0.35, "rgba(255,255,255,0.03)");
  sheen.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Quiet plastic grain on the shell face
  ctx.save();
  ctx.globalAlpha = 0.05;
  for (let i = 0; i < 2800; i++) {
    const g = (Math.random() * 255) | 0;
    ctx.fillStyle = `rgb(${g},${g},${g})`;
    ctx.fillRect((Math.random() * w) | 0, (Math.random() * h) | 0, 1.5, 1.5);
  }
  ctx.restore();

  const notchW = w * 0.13;
  const notchH = h * 0.015;
  const nx = (w - notchW) / 2;
  const ny = h * 0.024;
  ctx.fillStyle = "#050505";
  ctx.beginPath();
  ctx.roundRect(nx, ny, notchW, notchH, 3);
  ctx.fill();

  const insetX = w * 0.078;
  const insetTop = h * 0.068;
  const insetBottom = h * 0.11;
  const labelW = w - insetX * 2;
  const labelH = h - insetTop - insetBottom;

  // Recessed label well rim
  ctx.fillStyle = "#0e0e0e";
  ctx.beginPath();
  ctx.roundRect(insetX - 5, insetTop - 5, labelW + 10, labelH + 10, 8);
  ctx.fill();

  ctx.fillStyle = "#f2f2f2";
  ctx.beginPath();
  ctx.roundRect(insetX, insetTop, labelW, labelH, 6);
  ctx.fill();

  const hasArt = !!(art && art.complete && art.naturalWidth > 0);
  if (hasArt) {
    const scale = Math.max(
      labelW / art!.naturalWidth,
      labelH / art!.naturalHeight,
    );
    const dw = art!.naturalWidth * scale;
    const dh = art!.naturalHeight * scale;
    const dx = insetX + (labelW - dw) / 2;
    const dy = insetTop + (labelH - dh) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(insetX, insetTop, labelW, labelH, 6);
    ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(art!, dx, dy, dw, dh);
    ctx.restore();
  } else if (title) {
    ctx.fillStyle = "#111111";
    ctx.beginPath();
    ctx.roundRect(insetX, insetTop, labelW, labelH, 6);
    ctx.fill();

    const pad = labelW * 0.1;
    ctx.fillStyle = "#f5f5f5";
    ctx.font = `600 ${Math.round(labelW * 0.085)}px system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    wrapTitle(ctx, title, w / 2, insetTop + labelH * 0.42, labelW - pad * 2);
  }

  // Soft inner shadow on the label well
  const wellShade = ctx.createLinearGradient(insetX, insetTop, insetX, insetTop + 28);
  wellShade.addColorStop(0, "rgba(0,0,0,0.35)");
  wellShade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = wellShade;
  ctx.beginPath();
  ctx.roundRect(insetX, insetTop, labelW, 28, 6);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(insetX + 1.5, insetTop + 1.5, labelW - 3, labelH - 3, 5);
  ctx.stroke();

  // Insert arrow — recessed pocket + molded chevron
  const cx = w / 2;
  const cy = h * 0.948;
  const s = w * 0.032;

  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.roundRect(cx - s * 1.55, cy - s * 1.15, s * 3.1, s * 2.35, 4);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy + s * 0.95);
  ctx.lineTo(cx - s * 1.05, cy - s * 0.65);
  ctx.lineTo(cx - s * 0.28, cy - s * 0.65);
  ctx.lineTo(cx, cy + s * 0.15);
  ctx.lineTo(cx + s * 0.28, cy - s * 0.65);
  ctx.lineTo(cx + s * 1.05, cy - s * 0.65);
  ctx.closePath();

  const arrowFill = ctx.createLinearGradient(cx, cy - s, cx, cy + s);
  arrowFill.addColorStop(0, "#4a4a4a");
  arrowFill.addColorStop(0.55, "#2e2e2e");
  arrowFill.addColorStop(1, "#1f1f1f");
  ctx.fillStyle = arrowFill;
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(cx - s * 1.05, cy - s * 0.65);
  ctx.lineTo(cx - s * 0.28, cy - s * 0.65);
  ctx.lineTo(cx, cy + s * 0.15);
  ctx.lineTo(cx + s * 0.28, cy - s * 0.65);
  ctx.lineTo(cx + s * 1.05, cy - s * 0.65);
  ctx.stroke();

  return prepCanvasTexture(new CanvasTexture(c));
}

function wrapTitle(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  const lineH = Math.round(maxW * 0.12);
  const startY = y - ((lines.length - 1) * lineH) / 2;
  lines.slice(0, 4).forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineH);
  });
}

function paintContactShadow(): CanvasTexture {
  const s = 256;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 8, s / 2, s / 2, s * 0.48);
  g.addColorStop(0, "rgba(0,0,0,0.55)");
  g.addColorStop(0.35, "rgba(0,0,0,0.22)");
  g.addColorStop(0.7, "rgba(0,0,0,0.06)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

function makeSideMaterial(hex: string) {
  return new MeshPhysicalMaterial({
    color: new Color(hex),
    roughness: 0.42,
    metalness: 0.08,
    clearcoat: 0.72,
    clearcoatRoughness: 0.22,
    envMapIntensity: 0.85,
  });
}

function makeFaceMaterial(map: CanvasTexture, rough: number) {
  return new MeshPhysicalMaterial({
    map,
    roughness: rough,
    metalness: 0.06,
    clearcoat: 0.55,
    clearcoatRoughness: 0.28,
    envMapIntensity: 0.7,
  });
}

function makeGoldPinMaterial() {
  return new MeshPhysicalMaterial({
    color: new Color("#d4b05a"),
    roughness: 0.22,
    metalness: 1,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
    envMapIntensity: 1.35,
  });
}

function buildDustField(): Points {
  const count = 48;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4.2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
    positions[i * 3 + 2] = -1.2 - Math.random() * 1.8;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(positions, 3));
  const mat = new PointsMaterial({
    color: 0xffffff,
    size: 0.028,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const points = new Points(geo, mat);
  points.renderOrder = -2;
  return points;
}

function buildProgressRing(pct: number): Mesh {
  const clamped = Math.max(0, Math.min(100, pct)) / 100;
  const geo = new PlaneGeometry(1.55, 1.55);
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;
  const mid = 256;
  const r = 220;

  ctx.clearRect(0, 0, 512, 512);
  ctx.lineCap = "round";
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(mid, mid, r, 0, Math.PI * 2);
  ctx.stroke();

  if (clamped > 0.01) {
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.arc(
      mid,
      mid,
      r,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * clamped,
    );
    ctx.stroke();
  }

  const map = prepCanvasTexture(new CanvasTexture(canvas));
  const mesh = new Mesh(
    geo,
    new MeshStandardMaterial({
      map,
      transparent: true,
      opacity: 0.85,
      roughness: 1,
      metalness: 0,
      depthWrite: false,
    }),
  );
  mesh.position.set(0, 0, -0.22);
  mesh.renderOrder = -1;
  return mesh;
}

function buildCart(front: CanvasTexture, back: CanvasTexture): Group {
  const group = new Group();

  const frontMat = makeFaceMaterial(front, 0.52);
  const backMat = makeFaceMaterial(back, 0.62);

  // Materials: +x, -x, +y, -y, +z (front / cover), -z (back / pins)
  const body = new Mesh(new BoxGeometry(CART_W, CART_H, CART_D), [
    makeSideMaterial("#1a1a1a"),
    makeSideMaterial("#151515"),
    makeSideMaterial("#1c1c1c"),
    makeSideMaterial("#101010"),
    frontMat,
    backMat,
  ]);
  body.name = "body";
  group.add(body);

  // Thin raised bezel around the label (open center — does not cover art)
  const bezelMat = makeSideMaterial("#121212");
  const bezelZ = CART_D / 2 + 0.003;
  const labelW = CART_W * 0.844;
  const labelH = CART_H * 0.822;
  const labelY = CART_H * 0.021;
  const bt = 0.014;
  const top = new Mesh(new BoxGeometry(labelW + bt * 2, bt, 0.007), bezelMat);
  top.position.set(0, labelY + labelH / 2 + bt / 2, bezelZ);
  group.add(top);
  const bottom = new Mesh(new BoxGeometry(labelW + bt * 2, bt, 0.007), bezelMat);
  bottom.position.set(0, labelY - labelH / 2 - bt / 2, bezelZ);
  group.add(bottom);
  const left = new Mesh(new BoxGeometry(bt, labelH, 0.007), bezelMat);
  left.position.set(-labelW / 2 - bt / 2, labelY, bezelZ);
  group.add(left);
  const right = new Mesh(new BoxGeometry(bt, labelH, 0.007), bezelMat);
  right.position.set(labelW / 2 + bt / 2, labelY, bezelZ);
  group.add(right);

  // Top insert notch (Switch cart cue)
  const notch = new Mesh(
    new BoxGeometry(CART_W * 0.14, CART_H * 0.018, CART_D * 0.55),
    makeSideMaterial("#050505"),
  );
  notch.position.set(0, CART_H / 2 - CART_H * 0.012, CART_D * 0.08);
  group.add(notch);

  // Physical contact well + gold pins on the back face
  const wellW = CART_W * 0.78;
  const wellH = CART_H * 0.38;
  const wellY = -CART_H * 0.08;
  const well = new Mesh(
    new BoxGeometry(wellW, wellH, 0.02),
    makeSideMaterial("#060606"),
  );
  well.position.set(0, wellY, -CART_D / 2 - 0.008);
  group.add(well);

  const wellLip = new Mesh(
    new BoxGeometry(wellW + 0.024, wellH + 0.024, 0.005),
    makeSideMaterial("#1a1a1a"),
  );
  wellLip.position.set(0, wellY, -CART_D / 2 - 0.001);
  group.add(wellLip);

  const goldMat = makeGoldPinMaterial();
  const pinGap = wellW * 0.014;
  const pinW = (wellW * 0.86 - pinGap * (PIN_COUNT - 1)) / PIN_COUNT;
  const pinH = wellH * 0.76;
  const pinDepth = 0.018;
  const pinGeo = new BoxGeometry(pinW, pinH, pinDepth);
  const pinStartX = -((PIN_COUNT - 1) * (pinW + pinGap)) / 2;
  for (let i = 0; i < PIN_COUNT; i++) {
    const pin = new Mesh(pinGeo, goldMat);
    pin.position.set(
      pinStartX + i * (pinW + pinGap),
      wellY,
      -CART_D / 2 - 0.018,
    );
    group.add(pin);
  }

  // Soft elliptical contact shadow
  const shadowMap = paintContactShadow();
  const shadow = new Mesh(
    new PlaneGeometry(1, 1),
    new MeshBasicMaterial({
      map: shadowMap,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, -CART_H / 2 - 0.02, 0.04);
  shadow.scale.set(CART_W * 1.15, CART_W * 0.55, 1);
  shadow.name = "shadow";
  group.add(shadow);

  group.scale.setScalar(CART_SCALE);
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

function resolveCoverUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  try {
    const host = new URL(src).hostname;
    if (
      host === "howlongtobeat.com" ||
      host === "www.howlongtobeat.com" ||
      host.endsWith(".scdn.co") ||
      host === "image.tmdb.org" ||
      host === "images.igdb.com"
    ) {
      return `/api/image-proxy?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return src;
  }
  return src;
}

function loadCover(src: string) {
  const url = resolveCoverUrl(src);
  if (!url) {
    applyFront(null);
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
      applyFront(tex.image as HTMLImageElement);
    },
    undefined,
    () => applyFront(null),
  );
}

function applyFront(img: HTMLImageElement | null) {
  if (!cart) return;
  disposeTexture(frontTexture);
  frontTexture = paintFrontFrame(img, cartTitle.value);

  const body = cart.getObjectByName("body") as Mesh | undefined;
  if (!body || !Array.isArray(body.material)) return;

  const mats = body.material as MeshPhysicalMaterial[];
  const prev = mats[4];
  mats[4] = makeFaceMaterial(frontTexture, 0.52);
  prev.map = null;
  prev.dispose();
}

function applyBack(title = cartTitle.value) {
  if (!cart) return;
  disposeTexture(backTexture);
  backTexture = paintBackFace(title);

  const body = cart.getObjectByName("body") as Mesh | undefined;
  if (!body || !Array.isArray(body.material)) return;

  const mats = body.material as MeshPhysicalMaterial[];
  const prev = mats[5];
  mats[5] = makeFaceMaterial(backTexture, 0.66);
  prev.map = null;
  prev.dispose();
}

function syncProgressRing(pct?: number) {
  if (!scene || !cart) return;
  if (progressRing) {
    scene.remove(progressRing);
    progressRing.geometry.dispose();
    const mat = progressRing.material as MeshStandardMaterial;
    mat.map?.dispose();
    mat.dispose();
    progressRing = null;
  }
  if (typeof pct === "number" && pct > 0) {
    progressRing = buildProgressRing(pct);
    progressRing.rotation.y = rotY.value;
    scene.add(progressRing);
  }
}

function tick() {
  if (!renderer || !scene || !camera || !cart) return;

  const now = (performance.now() - clockStart) * 0.001;

  if (!dragging.value) {
    if (reducedMotion.value) {
      velocity.value = 0;
    } else if (Math.abs(velocity.value) > 0.0004) {
      rotY.value += velocity.value;
      velocity.value *= 0.93;
    } else {
      velocity.value = 0;
      rotY.value += 0.0035;
    }
  }

  cart.rotation.y = rotY.value;
  if (reducedMotion.value) {
    cart.rotation.x = 0.12;
    cart.position.y = 0;
  } else {
    cart.rotation.x = 0.12 + Math.sin(now * 0.85) * 0.035;
    cart.position.y = Math.sin(now * 1.05) * 0.045;
  }

  const shadow = cart.getObjectByName("shadow") as Mesh | undefined;
  if (shadow) {
    const lift = Math.abs(cart.position.y);
    shadow.scale.set(
      CART_W * 1.15 * (1 + lift * 0.35),
      CART_W * 0.55 * (1 + lift * 0.3),
      1,
    );
    const mat = shadow.material as MeshBasicMaterial;
    mat.opacity = Math.max(0.28, 0.85 - lift * 1.4);
  }

  if (progressRing) {
    progressRing.rotation.y = rotY.value;
    progressRing.position.y = cart.position.y;
    if (!reducedMotion.value) {
      const mat = progressRing.material as MeshStandardMaterial;
      mat.opacity = 0.72 + Math.sin(now * 1.4) * 0.1;
    }
  }

  if (dust && !reducedMotion.value) {
    dust.rotation.z = now * 0.04;
    const mat = dust.material as PointsMaterial;
    mat.opacity = 0.18 + Math.sin(now * 0.6) * 0.08;
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
  camera = new PerspectiveCamera(26, 1, 0.1, 40);
  camera.position.set(0, 0.04, 4.15);

  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  pmrem = new PMREMGenerator(renderer);
  envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envMap;
  scene.environmentIntensity = 0.55;

  scene.add(new AmbientLight(0xffffff, 0.28));
  scene.add(new HemisphereLight(0xfff8f0, 0x8a8a90, 0.48));

  const key = new DirectionalLight(0xfff6ee, 1.12);
  key.position.set(2.4, 3.6, 3.6);
  scene.add(key);

  const fill = new DirectionalLight(0xe8eef8, 0.38);
  fill.position.set(-3.2, 0.8, 2.2);
  scene.add(fill);

  const sideKick = new DirectionalLight(0xffffff, 0.32);
  sideKick.position.set(3.8, 1.4, 0.6);
  scene.add(sideKick);

  const rim = new DirectionalLight(0xffffff, 0.42);
  rim.position.set(-0.2, 1.8, -3.4);
  scene.add(rim);

  backTexture = paintBackFace(cartTitle.value);
  frontTexture = paintFrontFrame(null, cartTitle.value);
  cart = buildCart(frontTexture, backTexture);
  scene.add(cart);

  dust = buildDustField();
  scene.add(dust);
  syncProgressRing(props.progressPercentage);

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

  if (cart) {
    const disposedMats = new Set<object>();
    cart.traverse((obj) => {
      if (obj instanceof Mesh) {
        obj.geometry.dispose();
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          if (disposedMats.has(m)) continue;
          disposedMats.add(m);
          if (m.map && m.map !== frontTexture && m.map !== backTexture) {
            m.map.dispose();
          }
          m.dispose();
        }
      }
    });
    cart = null;
  }

  if (progressRing) {
    progressRing.geometry.dispose();
    const mat = progressRing.material as MeshStandardMaterial;
    mat.map?.dispose();
    mat.dispose();
    progressRing = null;
  }

  if (dust) {
    dust.geometry.dispose();
    (dust.material as PointsMaterial).dispose();
    dust = null;
  }

  disposeTexture(frontTexture);
  disposeTexture(backTexture);
  disposeTexture(coverTexture);
  frontTexture = null;
  backTexture = null;
  coverTexture = null;

  if (envMap) {
    envMap.dispose();
    envMap = null;
  }
  pmrem?.dispose();
  pmrem = null;

  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
}

watch(cartTitle, (title) => {
  if (!scene || !cart) return;
  applyBack(title);
  // Refresh title fallback on the front only when cover art is missing
  if (!coverTexture) applyFront(null);
});

watch(
  () => props.src,
  (src) => {
    if (scene) loadCover(src);
  },
);

watch(
  () => props.progressPercentage,
  (pct) => {
    if (scene) syncProgressRing(pct);
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
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.18)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]"
      aria-hidden="true"
    />
  </div>
</template>
