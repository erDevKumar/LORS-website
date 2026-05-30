import { useCallback, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  starSprite,
  glowSprite,
  beamSprite,
  auroraRibbon,
  accretionSprite,
  cometTailSprite,
  spiralGalaxySprite,
} from "../galaxyTextures";

const ADD = THREE.AdditiveBlending;
const X_AXIS = new THREE.Vector3(1, 0, 0);
const Z_AXIS = new THREE.Vector3(0, 0, 1);

type DelayProps = { minDelay: number; maxDelay: number };

/** 0 -> 1 -> 0 hump. */
const bump = (t: number) => Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);

function randFar(out: THREE.Vector3) {
  out.set((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 55, -45 - Math.random() * 45);
}

type Phase = { active: boolean; justSpawned: boolean; p: number };

/**
 * Independent randomized event lifecycle. Returns a `tick(time, dt)` to call
 * inside the component's own useFrame; it stays hidden for a random delay, runs
 * once over `duration`, then reschedules. Ref-based (no React re-renders).
 */
function useEventTimer(minDelay: number, maxDelay: number, duration: number) {
  const st = useRef({ active: false, nextAt: 1 + Math.random() * maxDelay, t: 0 });
  return useCallback(
    (time: number, dt: number): Phase => {
      const s = st.current;
      if (!s.active) {
        if (time >= s.nextAt) {
          s.active = true;
          s.t = 0;
          return { active: true, justSpawned: true, p: 0 };
        }
        return { active: false, justSpawned: false, p: 0 };
      }
      s.t += dt;
      const p = s.t / duration;
      if (p >= 1) {
        s.active = false;
        s.nextAt = time + minDelay + Math.random() * (maxDelay - minDelay);
        return { active: false, justSpawned: false, p: 1 };
      }
      return { active: true, justSpawned: false, p };
    },
    [minDelay, maxDelay, duration]
  );
}

/* =================================================================== */
/* Star life & death                                                   */
/* =================================================================== */

/** Nebula collapses inward and ignites a newborn star. */
export function NebulaCollapse({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Sprite>(null);
  const cloudM = useRef<THREE.SpriteMaterial>(null);
  const core = useRef<THREE.Sprite>(null);
  const coreM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 5.5);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (cloud.current) cloud.current.scale.setScalar(THREE.MathUtils.lerp(12, 1.6, p));
    if (cloudM.current) cloudM.current.opacity = 0.3 * (1 - p);
    const flash = p < 0.85 ? Math.pow(p / 0.85, 2) : Math.max(0, 1 - (p - 0.85) / 0.15);
    if (core.current) core.current.scale.setScalar(0.5 + flash * 5);
    if (coreM.current) coreM.current.opacity = flash;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={cloud}>
        <spriteMaterial ref={cloudM} map={glowSprite()} color="#8a5cff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={core}>
        <spriteMaterial ref={coreM} map={starSprite()} color="#cfe6ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/** A dead star briefly flares up. */
export function Nova({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const sp = useRef<THREE.Sprite>(null);
  const m = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 2.2);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const b = bump(ph.p);
    if (sp.current) sp.current.scale.setScalar(1 + b * 4);
    if (m.current) m.current.opacity = 0.15 + b * 0.85;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={sp}>
        <spriteMaterial ref={m} map={glowSprite()} color="#eaf2ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/** Hypernova: oversized flare + bipolar jets + double shockwave, collapses to a black hole. */
export function Hypernova({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const flare = useRef<THREE.Sprite>(null);
  const flareM = useRef<THREE.SpriteMaterial>(null);
  const jet = useRef<THREE.Group>(null);
  const jetM = useRef<THREE.MeshBasicMaterial>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring1M = useRef<THREE.MeshBasicMaterial>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring2M = useRef<THREE.MeshBasicMaterial>(null);
  const hole = useRef<THREE.Sprite>(null);
  const holeM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 2.9);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
      if (jet.current) jet.current.rotation.z = Math.random() * Math.PI;
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const flareB = p < 0.1 ? p / 0.1 : Math.pow(1 - (p - 0.1) / 0.9, 1.7);
    if (flare.current) flare.current.scale.setScalar(4 + flareB * 24);
    if (flareM.current) flareM.current.opacity = Math.max(0, flareB);
    const jetB = p < 0.45 ? bump(p / 0.45) : 0;
    if (jet.current) jet.current.scale.set(1, 0.4 + jetB * 4, 1);
    if (jetM.current) jetM.current.opacity = jetB * 0.9;
    if (ring1.current) ring1.current.scale.setScalar(1 + p * 26);
    if (ring1M.current) ring1M.current.opacity = Math.max(0, (1 - p) * 0.5);
    const p2 = Math.max(0, p - 0.12);
    if (ring2.current) ring2.current.scale.setScalar(1 + p2 * 20);
    if (ring2M.current) ring2M.current.opacity = Math.max(0, (1 - p2) * 0.35);
    const holeB = p > 0.7 ? (p - 0.7) / 0.3 : 0;
    if (hole.current) hole.current.scale.setScalar(2 + holeB * 2.5);
    if (holeM.current) holeM.current.opacity = holeB * 0.85;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={flare}>
        <spriteMaterial ref={flareM} map={glowSprite()} color="#ffe9d0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <group ref={jet}>
        <mesh>
          <planeGeometry args={[2.6, 60]} />
          <meshBasicMaterial ref={jetM} map={beamSprite()} color="#cfe0ff" transparent opacity={0} depthWrite={false} blending={ADD} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={ring1}>
        <ringGeometry args={[0.85, 1, 64]} />
        <meshBasicMaterial ref={ring1M} color="#bcd6ff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial ref={ring2M} color="#ffd2b0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <sprite ref={hole}>
        <spriteMaterial ref={holeM} map={accretionSprite()} color="#ffcaa0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/* =================================================================== */
/* Cosmic crashes                                                      */
/* =================================================================== */

/** Two galaxies converge, distort, and merge. */
export function GalacticMerger({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const am = useRef<THREE.MeshBasicMaterial>(null);
  const b = useRef<THREE.Mesh>(null);
  const bm = useRef<THREE.MeshBasicMaterial>(null);
  const core = useRef<THREE.Sprite>(null);
  const coreM = useRef<THREE.SpriteMaterial>(null);
  const tex = useMemo(() => spiralGalaxySprite(), []);
  const tick = useEventTimer(minDelay, maxDelay, 11);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      pos.current.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 40, -105 - Math.random() * 25);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    const p = ph.p;
    const e = p * p * (3 - 2 * p);
    const sep = THREE.MathUtils.lerp(30, 2, e);
    if (a.current) {
      a.current.position.x = -sep;
      a.current.rotation.z += dt * 0.3;
    }
    if (b.current) {
      b.current.position.x = sep;
      b.current.rotation.z -= dt * 0.3;
    }
    const op = bump(Math.min(1, p * 1.1)) * 0.85 + 0.12;
    if (am.current) am.current.opacity = op;
    if (bm.current) bm.current.opacity = op * 0.85;
    const cb = p > 0.45 ? bump((p - 0.45) / 0.55) : 0;
    if (core.current) core.current.scale.setScalar(4 + cb * 10);
    if (coreM.current) coreM.current.opacity = cb * 0.8;
  });

  return (
    <group ref={g} visible={false}>
      <mesh ref={a} position={[-30, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial ref={am} map={tex} color="#cdbfff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <mesh ref={b} position={[30, 0, 0]}>
        <planeGeometry args={[34, 34]} />
        <meshBasicMaterial ref={bm} map={tex} color="#bfe4ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <sprite ref={core}>
        <spriteMaterial ref={coreM} map={glowSprite()} color="#fff0d6" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

function HoleBody({ groupRef }: { groupRef: RefObject<THREE.Group> }) {
  return (
    <group ref={groupRef}>
      <sprite scale={3}>
        <spriteMaterial map={accretionSprite()} color="#ffb070" transparent opacity={0.9} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh renderOrder={4}>
        <circleGeometry args={[0.7, 32]} />
        <meshBasicMaterial color="#000000" transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Two black holes spiral in and merge with a gravitational-wave ripple. */
export function BlackHoleMerger({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const h1 = useRef<THREE.Group>(null);
  const h2 = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleM = useRef<THREE.MeshBasicMaterial>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 6);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const inspiral = Math.min(1, p / 0.75);
    const radius = THREE.MathUtils.lerp(7, 0.1, inspiral * inspiral);
    if (orb.current) orb.current.rotation.z += dt * (1 + inspiral * 6);
    if (h1.current) h1.current.position.x = radius;
    if (h2.current) h2.current.position.x = -radius;
    const merged = p > 0.75;
    const fl = merged ? Math.max(0, 1 - (p - 0.75) / 0.25) : 0;
    if (flash.current) flash.current.scale.setScalar(2 + fl * 10);
    if (flashM.current) flashM.current.opacity = fl;
    const rp = merged ? (p - 0.75) / 0.25 : 0;
    if (ripple.current) ripple.current.scale.setScalar(1 + rp * 24);
    if (rippleM.current) rippleM.current.opacity = Math.max(0, (1 - rp) * 0.4);
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb}>
        <HoleBody groupRef={h1} />
        <HoleBody groupRef={h2} />
      </group>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#eaf2ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh ref={ripple}>
        <ringGeometry args={[0.94, 1, 64]} />
        <meshBasicMaterial ref={rippleM} color="#9fd0ff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Two neutron stars inspiral and detonate as a kilonova with a colored ejecta shell. */
export function Kilonova({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const p1 = useRef<THREE.Sprite>(null);
  const p2 = useRef<THREE.Sprite>(null);
  const p1M = useRef<THREE.SpriteMaterial>(null);
  const p2M = useRef<THREE.SpriteMaterial>(null);
  const shell = useRef<THREE.Sprite>(null);
  const shellM = useRef<THREE.SpriteMaterial>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 3);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const insp = Math.min(1, p / 0.45);
    const radius = THREE.MathUtils.lerp(4, 0.05, insp * insp);
    if (orb.current) orb.current.rotation.z += dt * (2 + insp * 10);
    if (p1.current) p1.current.position.x = radius;
    if (p2.current) p2.current.position.x = -radius;
    const beforeMerge = 1 - insp * 0.2;
    if (p1M.current) p1M.current.opacity = p < 0.45 ? beforeMerge : 0;
    if (p2M.current) p2M.current.opacity = p < 0.45 ? beforeMerge : 0;
    const merged = p > 0.45;
    const fl = merged ? Math.max(0, 1 - (p - 0.45) / 0.2) : 0;
    if (flash.current) flash.current.scale.setScalar(2 + fl * 9);
    if (flashM.current) flashM.current.opacity = fl;
    const sh = merged ? (p - 0.45) / 0.55 : 0;
    if (shell.current) shell.current.scale.setScalar(1 + sh * 14);
    if (shellM.current) shellM.current.opacity = Math.max(0, (1 - sh) * 0.7);
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb}>
        <sprite ref={p1} scale={1.1}>
          <spriteMaterial ref={p1M} map={glowSprite()} color="#dff0ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
        </sprite>
        <sprite ref={p2} scale={1.1}>
          <spriteMaterial ref={p2M} map={glowSprite()} color="#dff0ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
        </sprite>
      </group>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#ffe6f0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={shell}>
        <spriteMaterial ref={shellM} map={glowSprite()} color="#ff5c8a" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/* =================================================================== */
/* High-energy blasts                                                  */
/* =================================================================== */

/** Gamma-ray burst: very brief intense flash with thin bipolar jets. */
export function GammaRayBurst({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashM = useRef<THREE.SpriteMaterial>(null);
  const jet = useRef<THREE.Group>(null);
  const jetM = useRef<THREE.MeshBasicMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 1.0);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
      if (jet.current) jet.current.rotation.z = Math.random() * Math.PI;
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const b = p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2.2);
    if (flash.current) flash.current.scale.setScalar(3 + b * 16);
    if (flashM.current) flashM.current.opacity = b;
    if (jet.current) jet.current.scale.set(1, 0.5 + b * 5, 1);
    if (jetM.current) jetM.current.opacity = b * 0.95;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#f0f6ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <group ref={jet}>
        <mesh>
          <planeGeometry args={[1.4, 90]} />
          <meshBasicMaterial ref={jetM} map={beamSprite()} color="#e6f0ff" transparent opacity={0} depthWrite={false} blending={ADD} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** A black hole shreds a passing star into an accreting stream. */
export function TidalDisruptionEvent({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const stream = useRef<THREE.Mesh>(null);
  const streamM = useRef<THREE.MeshBasicMaterial>(null);
  const disc = useRef<THREE.Sprite>(null);
  const discM = useRef<THREE.SpriteMaterial>(null);
  const tailTex = useMemo(() => cometTailSprite(), []);
  const tick = useEventTimer(minDelay, maxDelay, 4.2);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (orb.current) orb.current.rotation.z += dt * (1.5 + p * 4);
    const len = THREE.MathUtils.lerp(10, 2, p);
    if (stream.current) {
      stream.current.scale.x = len / 10;
      stream.current.position.x = -len / 2 - 1;
    }
    if (streamM.current) streamM.current.opacity = bump(Math.min(1, p * 1.2)) * 0.8;
    const acc = p < 0.85 ? Math.pow(p / 0.85, 1.3) : Math.max(0, 1 - (p - 0.85) / 0.15);
    if (disc.current) disc.current.scale.setScalar(2 + acc * 3);
    if (discM.current) discM.current.opacity = acc * 0.9;
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb}>
        <mesh ref={stream} position={[-6, 0, 0]}>
          <planeGeometry args={[10, 0.9]} />
          <meshBasicMaterial ref={streamM} map={tailTex} color="#ffd9a0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
        </mesh>
      </group>
      <sprite ref={disc}>
        <spriteMaterial ref={discM} map={accretionSprite()} color="#ffd0a0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/** A star erupts a bright coronal loop off its limb. */
export function SolarFlare({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const arc = useRef<THREE.Mesh>(null);
  const arcM = useRef<THREE.MeshBasicMaterial>(null);
  const star = useRef<THREE.Sprite>(null);
  const starM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 2.2);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
      if (arc.current) arc.current.rotation.z = Math.random() * Math.PI * 2;
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const b = bump(p);
    if (star.current) star.current.scale.setScalar(1.4 + b * 0.6);
    if (starM.current) starM.current.opacity = 0.6 + b * 0.4;
    if (arc.current) arc.current.scale.setScalar(0.8 + p * 2.2);
    if (arcM.current) arcM.current.opacity = b * 0.85;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={star}>
        <spriteMaterial ref={starM} map={glowSprite()} color="#ffcf8a" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh ref={arc}>
        <ringGeometry args={[1.0, 1.22, 48, 1, 0, Math.PI]} />
        <meshBasicMaterial ref={arcM} color="#ffb24d" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A coronal mass ejection: a plasma bubble blasted away from a star. */
export function CoronalMassEjection({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const star = useRef<THREE.Sprite>(null);
  const bubble = useRef<THREE.Sprite>(null);
  const bubbleM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 3);
  const pos = useRef(new THREE.Vector3());
  const dir = useRef(new THREE.Vector2(1, 0));

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
      const a = Math.random() * Math.PI * 2;
      dir.current.set(Math.cos(a), Math.sin(a));
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (star.current) star.current.scale.setScalar(1.6);
    const d = 1 + p * 9;
    if (bubble.current) {
      bubble.current.position.set(dir.current.x * d, dir.current.y * d, 0);
      bubble.current.scale.setScalar(2 + p * 6);
    }
    if (bubbleM.current) bubbleM.current.opacity = (1 - p) * 0.6;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={star}>
        <spriteMaterial map={glowSprite()} color="#ffd28a" transparent opacity={0.8} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={bubble}>
        <spriteMaterial ref={bubbleM} map={glowSprite()} color="#ffb070" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

/* =================================================================== */
/* Space motion & weather                                              */
/* =================================================================== */

/** A burst of meteors radiating from a shared radiant point. */
export function MeteorShower({ minDelay, maxDelay, count = 6 }: DelayProps & { count?: number }) {
  const g = useRef<THREE.Group>(null);
  const childRefs = useRef<(THREE.Group | null)[]>([]);
  const tailTex = useMemo(() => cometTailSprite(), []);
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        delay: Math.random() * 0.5,
        ang: (Math.random() - 0.5) * 0.7,
        len: 6 + Math.random() * 5,
        dist: 50 + Math.random() * 30,
      })),
    [count]
  );
  const tick = useEventTimer(minDelay, maxDelay, 3.5);
  const base = useRef({ start: new THREE.Vector3(), dir: new THREE.Vector3() });
  const tmp = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      base.current.start.set((Math.random() - 0.5) * 60, 30 + Math.random() * 20, -40 - Math.random() * 30);
      base.current.dir.set((Math.random() > 0.5 ? 1 : -1) * 0.7, -1, -0.2).normalize();
      gg.position.copy(base.current.start);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    const p = ph.p;
    items.forEach((it, i) => {
      const cr = childRefs.current[i];
      if (!cr) return;
      const lp = (p - it.delay) / (1 - it.delay);
      if (lp <= 0 || lp >= 1) {
        cr.visible = false;
        return;
      }
      cr.visible = true;
      tmp.current.copy(base.current.dir).applyAxisAngle(Z_AXIS, it.ang);
      cr.position.copy(tmp.current).multiplyScalar(lp * it.dist);
      cr.quaternion.setFromUnitVectors(X_AXIS, tmp.current);
      cr.scale.setScalar(0.5 + bump(lp) * 0.7);
    });
  });

  return (
    <group ref={g} visible={false}>
      {items.map((it, i) => (
        <group
          key={i}
          ref={(el) => {
            childRefs.current[i] = el;
          }}
        >
          <mesh position={[-it.len / 2, 0, 0]}>
            <planeGeometry args={[it.len, 0.4]} />
            <meshBasicMaterial map={tailTex} color="#dcebff" transparent depthWrite={false} blending={ADD} toneMapped={false} />
          </mesh>
          <sprite scale={1.1}>
            <spriteMaterial map={glowSprite()} color="#eaf2ff" transparent depthWrite={false} blending={ADD} toneMapped={false} />
          </sprite>
        </group>
      ))}
    </group>
  );
}

/** A planet transits its host star, dipping the star's brightness. */
export function PlanetaryTransit({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const star = useRef<THREE.Sprite>(null);
  const starM = useRef<THREE.SpriteMaterial>(null);
  const planet = useRef<THREE.Mesh>(null);
  const tick = useEventTimer(minDelay, maxDelay, 5);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (planet.current) planet.current.position.x = THREE.MathUtils.lerp(-6, 6, p);
    // Light curve: dip while the planet is over the disc (~center).
    const dip = Math.exp(-((p - 0.5) * (p - 0.5)) / 0.012) * 0.4;
    const env = bump(p);
    if (star.current) star.current.scale.setScalar(3.2);
    if (starM.current) starM.current.opacity = Math.max(0, (0.4 + env * 0.55) - dip);
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={star}>
        <spriteMaterial ref={starM} map={glowSprite()} color="#ffe3b0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh ref={planet} renderOrder={4}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial color="#0a0e18" transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** A moon eclipses a star, revealing a corona ring at totality. */
export function SolarEclipse({ minDelay, maxDelay }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const sun = useRef<THREE.Sprite>(null);
  const sunM = useRef<THREE.SpriteMaterial>(null);
  const corona = useRef<THREE.Mesh>(null);
  const coronaM = useRef<THREE.MeshBasicMaterial>(null);
  const moon = useRef<THREE.Mesh>(null);
  const tick = useEventTimer(minDelay, maxDelay, 5.5);
  const pos = useRef(new THREE.Vector3());

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      randFar(pos.current);
      gg.position.copy(pos.current);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (moon.current) moon.current.position.x = THREE.MathUtils.lerp(-4.5, 4.5, p);
    const totality = Math.exp(-((p - 0.5) * (p - 0.5)) / 0.006);
    const env = bump(p);
    if (sun.current) sun.current.scale.setScalar(3);
    if (sunM.current) sunM.current.opacity = Math.max(0, (0.5 + env * 0.5) - totality * 0.75);
    if (corona.current) corona.current.scale.setScalar(1.4 + totality * 0.5);
    if (coronaM.current) coronaM.current.opacity = totality * 0.8 * env;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={sun}>
        <spriteMaterial ref={sunM} map={glowSprite()} color="#ffdca0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh ref={corona} renderOrder={3}>
        <ringGeometry args={[0.92, 1.05, 64]} />
        <meshBasicMaterial ref={coronaM} color="#fff2d6" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <mesh ref={moon} renderOrder={5}>
        <circleGeometry args={[1, 48]} />
        <meshBasicMaterial color="#05070d" transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Aurora shimmering around the distant planet during a geomagnetic storm. */
export function GeomagneticStorm({
  minDelay,
  maxDelay,
  position,
  ribbons = 3,
}: DelayProps & { position: [number, number, number]; ribbons?: number }) {
  const g = useRef<THREE.Group>(null);
  const ribbonRefs = useRef<(THREE.Mesh | null)[]>([]);
  const matRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const tex = useMemo(() => auroraRibbon(), []);
  const tick = useEventTimer(minDelay, maxDelay, 6.5);
  const cfg = useMemo(
    () =>
      Array.from({ length: ribbons }, (_, i) => ({
        x: (i - (ribbons - 1) / 2) * 4 + (Math.random() - 0.5) * 2,
        phase: Math.random() * Math.PI * 2,
        scale: 9 + Math.random() * 4,
      })),
    [ribbons]
  );

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    gg.visible = ph.active;
    if (!ph.active) return;
    const env = bump(ph.p);
    const t = s.clock.elapsedTime;
    cfg.forEach((rc, i) => {
      const r = ribbonRefs.current[i];
      const m = matRefs.current[i];
      if (r) {
        r.rotation.z = Math.sin(t * 0.6 + rc.phase) * 0.18;
        r.position.x = rc.x + Math.sin(t * 0.4 + rc.phase) * 0.8;
      }
      if (m) m.opacity = env * (0.4 + 0.3 * Math.sin(t * 1.4 + rc.phase));
    });
  });

  return (
    <group ref={g} position={position} visible={false}>
      {cfg.map((rc, i) => (
        <mesh
          key={i}
          position={[rc.x, 9, 0]}
          ref={(el) => {
            ribbonRefs.current[i] = el;
          }}
        >
          <planeGeometry args={[5, rc.scale]} />
          <meshBasicMaterial
            ref={(el) => {
              matRefs.current[i] = el;
            }}
            map={tex}
            transparent
            opacity={0}
            depthWrite={false}
            blending={ADD}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
