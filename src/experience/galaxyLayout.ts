import * as THREE from "three";

/**
 * Shared source of truth for the 3D orbital card layout.
 *
 * A large, dramatically tilted orbit creates an immersive galactic travel
 * experience. Cards are spread far apart so scrolling feels like traveling
 * vast distances through the galaxy.
 *
 * Body order MUST match the DOM section order driving `activeAct`:
 *   0 hero · 1 ecosystem · 2 routemates · 3 familyos · 4 tech · 5 careers · 6 contact
 */

/** Large orbit radius for vast inter-card distances */
export const ORBIT_RADIUS = 65;
/** Dramatic tilt for immersive galactic plane feel */
export const ORBIT_TILT = THREE.MathUtils.degToRad(35);

/** Camera stand-off distance - further back for the larger scale */
export const CAM_DIST = 22;
/** Vertical lift for cinematic framing */
export const CAM_LIFT = 5.0;

const PLANET_ANGLE_STEP = THREE.MathUtils.degToRad(60);

export type BodyKind = "sun" | "planet";

export interface BodyDef {
  id: string;
  act: number;
  kind: BodyKind;
  size: number;
  color: string;
  emissive: string;
  atmosphere: string;
  hasRing?: boolean;
  ringColor?: string;
}

export const BODIES: BodyDef[] = [
  {
    id: "hero",
    act: 0,
    kind: "sun",
    size: 4.5,
    color: "#ffd27a",
    emissive: "#ff9a3c",
    atmosphere: "#ffb454",
  },
  {
    id: "ecosystem",
    act: 1,
    kind: "planet",
    size: 2.0,
    color: "#19c8ff",
    emissive: "#0a7fb0",
    atmosphere: "#5fe0ff",
  },
  {
    id: "routemates",
    act: 2,
    kind: "planet",
    size: 1.8,
    color: "#36e0a4",
    emissive: "#0f7a5c",
    atmosphere: "#7af2c8",
  },
  {
    id: "familyos",
    act: 3,
    kind: "planet",
    size: 2.4,
    color: "#9a6bff",
    emissive: "#5326b8",
    atmosphere: "#c4a6ff",
    hasRing: true,
    ringColor: "#b794ff",
  },
  {
    id: "tech",
    act: 4,
    kind: "planet",
    size: 2.1,
    color: "#7eb8ff",
    emissive: "#3567c4",
    atmosphere: "#aed1ff",
  },
  {
    id: "careers",
    act: 5,
    kind: "planet",
    size: 1.9,
    color: "#ff7ec2",
    emissive: "#b01f6f",
    atmosphere: "#ffadd9",
  },
  {
    id: "contact",
    act: 6,
    kind: "planet",
    size: 1.7,
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
  const x = flatX;
  const y = -flatZ * Math.sin(ORBIT_TILT);
  const z = flatZ * Math.cos(ORBIT_TILT);
  return new THREE.Vector3(x, y, z);
}

/** World position of a body's content card (cards sit at the orbital slots). */
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
    return {
      position: new THREE.Vector3(0, 3, 28),
      lookAt: new THREE.Vector3(0, 0, 0),
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
    position: ca.position.clone().lerp(cb.position, t),
    lookAt: ca.lookAt.clone().lerp(cb.lookAt, t),
  };
}
