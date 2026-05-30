import * as THREE from "three";

/**
 * Shared source of truth for the galaxy / solar-system layout.
 *
 * The Hero is the SUN at the origin (act 0). The remaining six sections are
 * PLANETS placed at fixed angles on a single ring tilted by ORBIT_TILT.
 * Both the scene (SolarSystem) and the camera (CameraController) import these
 * helpers so the bodies and the camera flight can never drift out of sync.
 *
 * Body order MUST match the DOM section order driving `activeAct`:
 *   0 hero · 1 mission · 2 it · 3 ecosystem · 4 products · 5 pipeline · 6 contact
 */

export const ORBIT_RADIUS = 24;
export const ORBIT_TILT = THREE.MathUtils.degToRad(16);

/** How far above its planet a content panel floats (orbit-plane up). */
export const PANEL_UP = 6.4;
/** Camera stand-off distance from the focused body along the radial line. */
export const CAM_DIST = 11;
/** Extra vertical lift so the camera looks slightly down on the body+panel. */
export const CAM_LIFT = 2.4;

const PLANET_ANGLE_STEP = THREE.MathUtils.degToRad(60);

export type BodyKind = "sun" | "planet";

export interface BodyDef {
  /** Matches the panelId consumed by HologramSectionPanel. */
  id: string;
  /** Scroll act 0..6. */
  act: number;
  kind: BodyKind;
  /** Sphere radius in world units. */
  size: number;
  /** Base surface color. */
  color: string;
  /** Emissive tint used for the glow when highlighted. */
  emissive: string;
  /** Additive atmosphere shell color. */
  atmosphere: string;
  hasRing?: boolean;
  ringColor?: string;
}

export const BODIES: BodyDef[] = [
  {
    id: "hero",
    act: 0,
    kind: "sun",
    size: 3.6,
    color: "#ffd27a",
    emissive: "#ff9a3c",
    atmosphere: "#ffb454",
  },
  {
    id: "mission",
    act: 1,
    kind: "planet",
    size: 1.6,
    color: "#19c8ff",
    emissive: "#0a7fb0",
    atmosphere: "#5fe0ff",
  },
  {
    id: "it",
    act: 2,
    kind: "planet",
    size: 1.45,
    color: "#36e0a4",
    emissive: "#0f7a5c",
    atmosphere: "#7af2c8",
  },
  {
    id: "ecosystem",
    act: 3,
    kind: "planet",
    size: 1.95,
    color: "#9a6bff",
    emissive: "#5326b8",
    atmosphere: "#c4a6ff",
    hasRing: true,
    ringColor: "#b794ff",
  },
  {
    id: "products",
    act: 4,
    kind: "planet",
    size: 1.7,
    color: "#7eb8ff",
    emissive: "#3567c4",
    atmosphere: "#aed1ff",
  },
  {
    id: "pipeline",
    act: 5,
    kind: "planet",
    size: 1.5,
    color: "#ff7ec2",
    emissive: "#b01f6f",
    atmosphere: "#ffadd9",
  },
  {
    id: "contact",
    act: 6,
    kind: "planet",
    size: 1.4,
    color: "#ffc24d",
    emissive: "#b9701a",
    atmosphere: "#ffd98a",
  },
];

export const MAX_ACT = BODIES.length - 1;

/** Angle of a planet around the ring. act 1..6 -> 0..300 deg, starting at front. */
export function planetAngle(act: number): number {
  return (act - 1) * PLANET_ANGLE_STEP - Math.PI / 2;
}

/** World position of a body's center (sun at origin; planets on the tilted ring). */
export function bodyPosition(act: number): THREE.Vector3 {
  if (act <= 0) return new THREE.Vector3(0, 0, 0);
  const theta = planetAngle(act);
  const flatX = ORBIT_RADIUS * Math.cos(theta);
  const flatZ = ORBIT_RADIUS * Math.sin(theta);
  // Tilt the ring around the X axis.
  const x = flatX;
  const y = -flatZ * Math.sin(ORBIT_TILT);
  const z = flatZ * Math.cos(ORBIT_TILT);
  return new THREE.Vector3(x, y, z);
}

/** World position of a body's content card (cards now sit at the orbital slots). */
export function panelPosition(act: number): THREE.Vector3 {
  return bodyPosition(act);
}

/** Outward radial direction from the sun to the body, in the tilted plane. */
export function radialOutward(act: number): THREE.Vector3 {
  const p = bodyPosition(act);
  if (p.lengthSq() < 1e-6) return new THREE.Vector3(0, 0, 1);
  return p.clone().normalize();
}

/** Camera framing for a single act: head-on to the body's floating panel. */
export function cameraForAct(act: number): {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
} {
  if (act <= 0) {
    // Head-on framing of the central hero card.
    return {
      position: new THREE.Vector3(0, 1.2, 16),
      lookAt: new THREE.Vector3(0, 0.2, 0),
    };
  }
  const body = bodyPosition(act);
  const radial = radialOutward(act);
  const position = body
    .clone()
    .add(radial.multiplyScalar(CAM_DIST))
    .add(new THREE.Vector3(0, CAM_LIFT, 0));
  return { position, lookAt: body.clone() };
}

function smoothstep(t: number): number {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/**
 * Smoothly interpolate the camera as it arcs from one body to the next while
 * the user scrolls. `scrollIndex` is the fractional act (scrollY / vh).
 */
export function cameraTransform(scrollIndex: number): {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
} {
  const s = THREE.MathUtils.clamp(scrollIndex, 0, MAX_ACT);
  const a = Math.floor(s);
  const b = Math.min(a + 1, MAX_ACT);
  const t = smoothstep(s - a);
  const ca = cameraForAct(a);
  const cb = cameraForAct(b);
  return {
    position: ca.position.lerp(cb.position, t),
    lookAt: ca.lookAt.lerp(cb.lookAt, t),
  };
}
