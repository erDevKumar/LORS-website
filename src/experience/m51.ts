import * as THREE from "three";

/**
 * Shared geometric model of the Whirlpool Galaxy (M51 / NGC 5194) and its
 * companion NGC 5195.
 *
 * This is the single source of truth for everything M51-shaped:
 *   - the rendered galaxy   (GalaxyScene.tsx)
 *   - the card anchors       (galaxyLayout.ts -> camera + panels)
 *   - the event sites        (galaxyEvents.tsx)
 *
 * Real-data informed (NASA/ESA Hubble, Wikipedia):
 *   - Grand-design spiral with TWO prominent arms winding clockwise.
 *   - Nearly face-on (~20deg inclination).
 *   - Warm yellow core (older stars) + Seyfert-2 active nucleus.
 *   - Arm star-formation gradient: inner dust lane -> pink HII regions ->
 *     bright blue OB clusters on the outer edge.
 *   - Yellowish dwarf companion NGC 5195 at the tip of one arm, passing BEHIND,
 *     joined by a dust-rich tidal bridge.
 *
 * SCALE: The galaxy is large enough that the orbital cards (radius ~65) travel
 * THROUGH the spiral arms. You are inside this galaxy, traveling through it.
 */

/* ----------------------------- constants -------------------------------- */

/** Galaxy tilt - matches the orbit tilt so arms align with card path */
export const INCLINATION = THREE.MathUtils.degToRad(35);
/** Small roll so the galaxy is not perfectly axis-aligned (more natural framing). */
export const DISK_ROLL = THREE.MathUtils.degToRad(5);

/** Logarithmic-spiral pitch angle of the arms. */
export const ARM_PITCH = THREE.MathUtils.degToRad(22);
const B = Math.tan(ARM_PITCH);

/** Radius where the arms begin (just outside the bulge). */
export const CORE_RADIUS = 12;
/** Angular sweep of each arm in radians */
export const ARM_TURNS = 5.5;
/** Visible stellar disk extent - large enough to surround the orbit */
export const DISK_RADIUS = 120;

/** Disk orientation: incline about X, slight roll about Z. */
export const diskQuat = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(INCLINATION, 0, DISK_ROLL, "XYZ")
);

/** Unit normal of the disk plane in world space (points roughly toward +Z). */
export const diskNormal = new THREE.Vector3(0, 0, 1)
  .applyQuaternion(diskQuat)
  .normalize();

/* ------------------------------ helpers --------------------------------- */

/** Convert a disk-local planar point (z = out-of-plane) to world space. */
export function diskToWorld(localX: number, localY: number, localZ = 0): THREE.Vector3 {
  return new THREE.Vector3(localX, localY, localZ).applyQuaternion(diskQuat);
}

export interface ArmLocal {
  x: number;
  y: number;
  r: number;
  theta: number;
}

/**
 * Point on a clockwise logarithmic-spiral arm.
 * @param arm 0 or 1 (the two grand-design arms, offset by 180deg)
 * @param t   0..1 along the arm (0 = inner, 1 = outer tip)
 */
export function armLocal(arm: number, t: number): ArmLocal {
  const theta = t * ARM_TURNS;
  const r = CORE_RADIUS * Math.exp(B * theta);
  const phi = arm * Math.PI - theta; // minus -> clockwise winding
  return { x: r * Math.cos(phi), y: r * Math.sin(phi), r, theta };
}

/** World-space point on an arm. */
export function armPoint(arm: number, t: number): THREE.Vector3 {
  const a = armLocal(arm, t);
  return diskToWorld(a.x, a.y, 0);
}

/* --------------------------- companion NGC 5195 -------------------------- */

const _compTip = armLocal(1, 1.0);
/** Companion centre in disk-local coords (beyond arm B tip, pushed behind). */
export const companionLocal = new THREE.Vector3(
  _compTip.x * 1.12,
  _compTip.y * 1.12,
  -15
);
/** Companion centre in world space */
export const companionPosition = companionLocal
  .clone()
  .applyQuaternion(diskQuat);
export const companionRadius = 14;

/* ---------------------- card (information pivot) anchors ----------------- */

/**
 * World anchors for the 7 content cards, mapped to M51's signature features:
 *   0 hero      -> galactic nucleus / brand identity
 *   1 ecosystem -> product portfolio intro
 *   2 routemates -> RouteMates product card
 *   3 familyos  -> FamilyOS product card
 *   4 tech      -> tech stack & engineering culture
 *   5 careers   -> careers / join the nexus
 *   6 contact   -> contact & support
 */
export const FEATURE_ANCHORS: THREE.Vector3[] = [
  new THREE.Vector3(0, 0, 0),
  armPoint(0, 0.22),
  armPoint(0, 0.56),
  armPoint(1, 0.3),
  armPoint(1, 0.64),
  armPoint(0, 0.86),
  companionPosition.clone(),
];

/* ----------------------------- event sites ------------------------------ */

/**
 * Widely-separated locations where cosmic events may occur.
 * Events happen throughout the galaxy as you travel through it.
 */
export const EVENT_SITES: THREE.Vector3[] = [
  diskToWorld(-55, 40, 8),
  diskToWorld(65, -30, -5),
  diskToWorld(-70, -15, 12),
  diskToWorld(25, 60, -8),
  diskToWorld(80, 25, 6),
  diskToWorld(-35, -55, -10),
  diskToWorld(50, 50, 10),
  diskToWorld(-65, 30, -6),
  diskToWorld(70, -45, 8),
];

/** Convenience accessor with wraparound. */
export function eventSite(i: number): THREE.Vector3 {
  return EVENT_SITES[((i % EVENT_SITES.length) + EVENT_SITES.length) % EVENT_SITES.length].clone();
}
