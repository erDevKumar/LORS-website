import * as THREE from "three";

/**
 * Procedurally generated canvas textures for the galaxy backdrop.
 *
 * Everything is drawn at runtime (no image assets) and cached, so each texture
 * is created at most once and shared across all instances. Textures use a
 * transparent background and are meant for additive blending.
 */

function makeCanvas(size: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  return tex;
}

let _star: THREE.CanvasTexture | null = null;
/** Soft round star: bright core fading smoothly to transparent. */
export function starSprite(): THREE.CanvasTexture {
  if (_star) return _star;
  const size = 128;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.18, "rgba(255,255,255,0.95)");
  g.addColorStop(0.42, "rgba(200,225,255,0.45)");
  g.addColorStop(0.75, "rgba(120,170,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _star = toTexture(canvas);
  return _star;
}

let _glow: THREE.CanvasTexture | null = null;
/** Wide soft halo for nebulae, comet heads and flares. */
export function glowSprite(): THREE.CanvasTexture {
  if (_glow) return _glow;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(0.55, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _glow = toTexture(canvas);
  return _glow;
}

let _spiral: THREE.CanvasTexture | null = null;
/** Distant spiral galaxy: glowing core + two logarithmic arms with falloff. */
export function spiralGalaxySprite(): THREE.CanvasTexture {
  if (_spiral) return _spiral;
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;

  // Core glow.
  const core = ctx.createRadialGradient(c, c, 0, c, c, c);
  core.addColorStop(0, "rgba(255,245,220,0.95)");
  core.addColorStop(0.12, "rgba(255,225,180,0.55)");
  core.addColorStop(0.4, "rgba(150,130,220,0.18)");
  core.addColorStop(1, "rgba(40,40,90,0)");
  ctx.fillStyle = core;
  ctx.fillRect(0, 0, size, size);

  // Spiral arms made of many soft star specks along two log-spirals.
  ctx.globalCompositeOperation = "lighter";
  const arms = 2;
  const maxR = c * 0.92;
  for (let a = 0; a < arms; a++) {
    const base = (a / arms) * Math.PI * 2;
    for (let i = 0; i < 1400; i++) {
      const t = i / 1400;
      const r = Math.pow(t, 0.85) * maxR;
      const angle = base + t * 5.2 + (Math.random() - 0.5) * 0.5;
      const spread = (1 - t) * 6 + 2;
      const x = c + Math.cos(angle) * r + (Math.random() - 0.5) * spread;
      const y = c + Math.sin(angle) * r + (Math.random() - 0.5) * spread;
      const alpha = (1 - t) * 0.5 + 0.05;
      // Warm core -> cool rim.
      const cr = Math.round(255 - t * 90);
      const cg = Math.round(220 - t * 40);
      const cb = Math.round(190 + t * 60);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
      const dot = Math.max(0.6, (1 - t) * 2.2);
      ctx.beginPath();
      ctx.arc(x, y, dot, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.globalCompositeOperation = "source-over";
  _spiral = toTexture(canvas);
  return _spiral;
}

let _elliptical: THREE.CanvasTexture | null = null;
/** Distant elliptical galaxy: smooth elongated gaussian blob. */
export function ellipticalGalaxySprite(): THREE.CanvasTexture {
  if (_elliptical) return _elliptical;
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  ctx.translate(c, c);
  ctx.scale(1, 0.6);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c);
  g.addColorStop(0, "rgba(255,240,215,0.85)");
  g.addColorStop(0.2, "rgba(240,215,190,0.4)");
  g.addColorStop(0.5, "rgba(170,150,210,0.14)");
  g.addColorStop(1, "rgba(40,40,80,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, c, 0, Math.PI * 2);
  ctx.fill();
  _elliptical = toTexture(canvas);
  return _elliptical;
}

let _beam: THREE.CanvasTexture | null = null;
/** Bright bipolar beam/jet: long axis is vertical, brightest at center, feathered sides. */
export function beamSprite(): THREE.CanvasTexture {
  if (_beam) return _beam;
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const lin = ctx.createLinearGradient(0, 0, 0, h);
  lin.addColorStop(0, "rgba(255,255,255,0)");
  lin.addColorStop(0.5, "rgba(255,255,255,1)");
  lin.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);

  const feather = ctx.createLinearGradient(0, 0, w, 0);
  feather.addColorStop(0, "rgba(0,0,0,1)");
  feather.addColorStop(0.5, "rgba(0,0,0,0)");
  feather.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = feather;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _beam = tex;
  return _beam;
}

let _aurora: THREE.CanvasTexture | null = null;
/** Aurora ribbon: tall vertical green -> cyan -> violet gradient, feathered sides. */
export function auroraRibbon(): THREE.CanvasTexture {
  if (_aurora) return _aurora;
  const w = 128;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const lin = ctx.createLinearGradient(0, h, 0, 0);
  lin.addColorStop(0, "rgba(60,255,160,0)");
  lin.addColorStop(0.15, "rgba(60,255,160,0.55)");
  lin.addColorStop(0.5, "rgba(60,230,255,0.5)");
  lin.addColorStop(0.85, "rgba(150,120,255,0.3)");
  lin.addColorStop(1, "rgba(150,120,255,0)");
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);

  const feather = ctx.createLinearGradient(0, 0, w, 0);
  feather.addColorStop(0, "rgba(0,0,0,1)");
  feather.addColorStop(0.5, "rgba(0,0,0,0)");
  feather.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = feather;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _aurora = tex;
  return _aurora;
}

let _accretion: THREE.CanvasTexture | null = null;
/** Bright thin ring (accretion disc glow) with transparent center and edge. */
export function accretionSprite(): THREE.CanvasTexture {
  if (_accretion) return _accretion;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.45, "rgba(255,255,255,0)");
  g.addColorStop(0.62, "rgba(255,224,184,0.9)");
  g.addColorStop(0.75, "rgba(255,172,112,0.5)");
  g.addColorStop(0.9, "rgba(255,140,90,0.12)");
  g.addColorStop(1, "rgba(255,140,90,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _accretion = toTexture(canvas);
  return _accretion;
}

let _tail: THREE.CanvasTexture | null = null;
/** Comet/meteor tail: bright rounded head fading to a transparent point. */
export function cometTailSprite(): THREE.CanvasTexture {
  if (_tail) return _tail;
  const w = 256;
  const h = 64;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Horizontal gradient: bright head on the right -> transparent tail left.
  const g = ctx.createLinearGradient(0, 0, w, 0);
  g.addColorStop(0, "rgba(180,215,255,0)");
  g.addColorStop(0.65, "rgba(190,220,255,0.12)");
  g.addColorStop(0.92, "rgba(225,240,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0.95)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Vertical feather so the streak has soft edges.
  const v = ctx.createLinearGradient(0, 0, 0, h);
  v.addColorStop(0, "rgba(0,0,0,1)");
  v.addColorStop(0.5, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _tail = tex;
  return _tail;
}

let _hii: THREE.CanvasTexture | null = null;
/** Soft pink/magenta HII emission nebula for star-forming regions. */
export function hiiRegionSprite(): THREE.CanvasTexture {
  if (_hii) return _hii;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(255,140,180,0.9)");
  g.addColorStop(0.2, "rgba(255,100,160,0.6)");
  g.addColorStop(0.45, "rgba(220,80,140,0.3)");
  g.addColorStop(0.7, "rgba(180,60,120,0.12)");
  g.addColorStop(1, "rgba(150,40,100,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _hii = toTexture(canvas);
  return _hii;
}

let _dust: THREE.CanvasTexture | null = null;
/** Dark dust lane texture (meant for normal blending, not additive). */
export function dustStrandSprite(): THREE.CanvasTexture {
  if (_dust) return _dust;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(10,8,15,0.7)");
  g.addColorStop(0.3, "rgba(15,12,20,0.5)");
  g.addColorStop(0.6, "rgba(20,15,25,0.25)");
  g.addColorStop(1, "rgba(25,20,30,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _dust = toTexture(canvas);
  return _dust;
}

let _coreGlow: THREE.CanvasTexture | null = null;
/** Warm yellow-orange glow for the galactic core/bulge. */
export function coreGlowSprite(): THREE.CanvasTexture {
  if (_coreGlow) return _coreGlow;
  const size = 512;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  const g = ctx.createRadialGradient(c, c, 0, c, c, c);
  g.addColorStop(0, "rgba(255,245,200,1)");
  g.addColorStop(0.08, "rgba(255,230,180,0.95)");
  g.addColorStop(0.2, "rgba(255,210,140,0.7)");
  g.addColorStop(0.4, "rgba(255,180,100,0.35)");
  g.addColorStop(0.65, "rgba(200,140,80,0.12)");
  g.addColorStop(1, "rgba(150,100,60,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _coreGlow = toTexture(canvas);
  return _coreGlow;
}

let _companionGlow: THREE.CanvasTexture | null = null;
/** Yellowish glow for the NGC 5195 companion galaxy. */
export function companionGlowSprite(): THREE.CanvasTexture {
  if (_companionGlow) return _companionGlow;
  const size = 256;
  const { canvas, ctx } = makeCanvas(size);
  const c = size / 2;
  ctx.translate(c, c);
  ctx.scale(1, 0.75);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, c);
  g.addColorStop(0, "rgba(255,235,190,0.9)");
  g.addColorStop(0.2, "rgba(255,220,170,0.6)");
  g.addColorStop(0.45, "rgba(230,190,140,0.3)");
  g.addColorStop(0.7, "rgba(200,160,110,0.1)");
  g.addColorStop(1, "rgba(150,120,80,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, c, 0, Math.PI * 2);
  ctx.fill();
  _companionGlow = toTexture(canvas);
  return _companionGlow;
}

let _tidalBridge: THREE.CanvasTexture | null = null;
/** Elongated dust/gas bridge connecting M51 to NGC 5195. */
export function tidalBridgeSprite(): THREE.CanvasTexture {
  if (_tidalBridge) return _tidalBridge;
  const w = 512;
  const h = 64;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const lin = ctx.createLinearGradient(0, 0, w, 0);
  lin.addColorStop(0, "rgba(80,60,50,0)");
  lin.addColorStop(0.2, "rgba(100,80,70,0.3)");
  lin.addColorStop(0.5, "rgba(120,100,90,0.5)");
  lin.addColorStop(0.8, "rgba(100,80,70,0.3)");
  lin.addColorStop(1, "rgba(80,60,50,0)");
  ctx.fillStyle = lin;
  ctx.fillRect(0, 0, w, h);

  const v = ctx.createLinearGradient(0, 0, 0, h);
  v.addColorStop(0, "rgba(0,0,0,1)");
  v.addColorStop(0.5, "rgba(0,0,0,0)");
  v.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  _tidalBridge = tex;
  return _tidalBridge;
}
