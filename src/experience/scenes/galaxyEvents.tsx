import { useCallback, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  starSprite,
  glowSprite,
  beamSprite,
  accretionSprite,
  spiralGalaxySprite,
} from "../galaxyTextures";
import { eventSite } from "../m51";

const ADD = THREE.AdditiveBlending;

type DelayProps = { minDelay: number; maxDelay: number; siteIndex?: number };

const bump = (t: number) => Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);

type Phase = { active: boolean; justSpawned: boolean; p: number };

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

export function AGNFlicker({ minDelay, maxDelay }: { minDelay: number; maxDelay: number }) {
  const sp = useRef<THREE.Sprite>(null);
  const m = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 3.5);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    if (!sp.current || !m.current) return;
    
    if (ph.active) {
      const flare = bump(ph.p);
      sp.current.scale.setScalar(5 + flare * 12);
      m.current.opacity = 0.4 + flare * 0.5;
    } else {
      sp.current.scale.setScalar(5);
      m.current.opacity = 0.3 + Math.sin(s.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <sprite ref={sp} position={[0, 0, 0.2]} scale={5}>
      <spriteMaterial
        ref={m}
        map={glowSprite()}
        color="#fff8e0"
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={ADD}
        toneMapped={false}
      />
    </sprite>
  );
}

export function NebulaCollapse({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const cloud = useRef<THREE.Sprite>(null);
  const cloudM = useRef<THREE.SpriteMaterial>(null);
  const core = useRef<THREE.Sprite>(null);
  const coreM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 6);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (cloud.current) cloud.current.scale.setScalar(THREE.MathUtils.lerp(25, 3, p));
    if (cloudM.current) cloudM.current.opacity = 0.35 * (1 - p);
    const flash = p < 0.85 ? Math.pow(p / 0.85, 2) : Math.max(0, 1 - (p - 0.85) / 0.15);
    if (core.current) core.current.scale.setScalar(1 + flash * 10);
    if (coreM.current) coreM.current.opacity = flash * 0.9;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={cloud}>
        <spriteMaterial ref={cloudM} map={glowSprite()} color="#7050b0" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={core}>
        <spriteMaterial ref={coreM} map={starSprite()} color="#c0d8ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

export function Nova({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const sp = useRef<THREE.Sprite>(null);
  const m = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 2.5);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const b = bump(ph.p);
    if (sp.current) sp.current.scale.setScalar(2 + b * 8);
    if (m.current) m.current.opacity = 0.2 + b * 0.75;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={sp}>
        <spriteMaterial ref={m} map={glowSprite()} color="#e8f0ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

export function Hypernova({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
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
  const tick = useEventTimer(minDelay, maxDelay, 3.5);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
      if (jet.current) jet.current.rotation.z = Math.random() * Math.PI;
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const flareB = p < 0.1 ? p / 0.1 : Math.pow(1 - (p - 0.1) / 0.9, 1.7);
    if (flare.current) flare.current.scale.setScalar(8 + flareB * 40);
    if (flareM.current) flareM.current.opacity = Math.max(0, flareB * 0.9);
    const jetB = p < 0.45 ? bump(p / 0.45) : 0;
    if (jet.current) jet.current.scale.set(2.5, 0.6 + jetB * 6, 1);
    if (jetM.current) jetM.current.opacity = jetB * 0.8;
    if (ring1.current) ring1.current.scale.setScalar(3 + p * 50);
    if (ring1M.current) ring1M.current.opacity = Math.max(0, (1 - p) * 0.5);
    const p2 = Math.max(0, p - 0.12);
    if (ring2.current) ring2.current.scale.setScalar(2 + p2 * 40);
    if (ring2M.current) ring2M.current.opacity = Math.max(0, (1 - p2) * 0.4);
    const holeB = p > 0.7 ? (p - 0.7) / 0.3 : 0;
    if (hole.current) hole.current.scale.setScalar(4 + holeB * 6);
    if (holeM.current) holeM.current.opacity = holeB * 0.8;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={flare}>
        <spriteMaterial ref={flareM} map={glowSprite()} color="#ffe8c8" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <group ref={jet}>
        <mesh>
          <planeGeometry args={[4, 100]} />
          <meshBasicMaterial ref={jetM} map={beamSprite()} color="#c8d8ff" transparent opacity={0} depthWrite={false} blending={ADD} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={ring1}>
        <ringGeometry args={[0.85, 1, 64]} />
        <meshBasicMaterial ref={ring1M} color="#a8c8ff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <mesh ref={ring2}>
        <ringGeometry args={[0.9, 1, 64]} />
        <meshBasicMaterial ref={ring2M} color="#ffc8a0" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <sprite ref={hole}>
        <spriteMaterial ref={holeM} map={accretionSprite()} color="#ffc090" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

export function GalacticMerger({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const a = useRef<THREE.Mesh>(null);
  const am = useRef<THREE.MeshBasicMaterial>(null);
  const b = useRef<THREE.Mesh>(null);
  const bm = useRef<THREE.MeshBasicMaterial>(null);
  const core = useRef<THREE.Sprite>(null);
  const coreM = useRef<THREE.SpriteMaterial>(null);
  const tex = useMemo(() => spiralGalaxySprite(), []);
  const tick = useEventTimer(minDelay, maxDelay, 14);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    const p = ph.p;
    const e = p * p * (3 - 2 * p);
    const sep = THREE.MathUtils.lerp(50, 3, e);
    if (a.current) {
      a.current.position.x = -sep;
      a.current.rotation.z += dt * 0.25;
    }
    if (b.current) {
      b.current.position.x = sep;
      b.current.rotation.z -= dt * 0.25;
    }
    const op = bump(Math.min(1, p * 1.1)) * 0.8 + 0.15;
    if (am.current) am.current.opacity = op;
    if (bm.current) bm.current.opacity = op * 0.85;
    const cb = p > 0.45 ? bump((p - 0.45) / 0.55) : 0;
    if (core.current) core.current.scale.setScalar(8 + cb * 20);
    if (coreM.current) coreM.current.opacity = cb * 0.75;
  });

  return (
    <group ref={g} visible={false}>
      <mesh ref={a} position={[-50, 0, 0]}>
        <planeGeometry args={[55, 55]} />
        <meshBasicMaterial ref={am} map={tex} color="#c0b0e8" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <mesh ref={b} position={[50, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshBasicMaterial ref={bm} map={tex} color="#a0d0ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
      <sprite ref={core}>
        <spriteMaterial ref={coreM} map={glowSprite()} color="#ffe8c8" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

function HoleBody({ groupRef }: { groupRef: RefObject<THREE.Group> }) {
  return (
    <group ref={groupRef}>
      <sprite scale={6}>
        <spriteMaterial map={accretionSprite()} color="#ffa060" transparent opacity={0.8} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh renderOrder={4}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#000000" transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function BlackHoleMerger({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const h1 = useRef<THREE.Group>(null);
  const h2 = useRef<THREE.Group>(null);
  const ripple = useRef<THREE.Mesh>(null);
  const rippleM = useRef<THREE.MeshBasicMaterial>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 7);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const inspiral = Math.min(1, p / 0.75);
    const radius = THREE.MathUtils.lerp(15, 0.2, inspiral * inspiral);
    if (orb.current) orb.current.rotation.z += dt * (1 + inspiral * 5);
    if (h1.current) h1.current.position.x = radius;
    if (h2.current) h2.current.position.x = -radius;
    const merged = p > 0.75;
    const fl = merged ? Math.max(0, 1 - (p - 0.75) / 0.25) : 0;
    if (flash.current) flash.current.scale.setScalar(4 + fl * 20);
    if (flashM.current) flashM.current.opacity = fl * 0.9;
    const rp = merged ? (p - 0.75) / 0.25 : 0;
    if (ripple.current) ripple.current.scale.setScalar(3 + rp * 50);
    if (rippleM.current) rippleM.current.opacity = Math.max(0, (1 - rp) * 0.45);
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb}>
        <HoleBody groupRef={h1} />
        <HoleBody groupRef={h2} />
      </group>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#e0f0ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <mesh ref={ripple}>
        <ringGeometry args={[0.94, 1, 64]} />
        <meshBasicMaterial ref={rippleM} color="#90c0ff" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} blending={ADD} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function Kilonova({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
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
  const tick = useEventTimer(minDelay, maxDelay, 3.5);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const insp = Math.min(1, p / 0.45);
    const radius = THREE.MathUtils.lerp(8, 0.1, insp * insp);
    if (orb.current) orb.current.rotation.z += dt * (2 + insp * 8);
    if (p1.current) p1.current.position.x = radius;
    if (p2.current) p2.current.position.x = -radius;
    const beforeMerge = 1 - insp * 0.2;
    if (p1M.current) p1M.current.opacity = p < 0.45 ? beforeMerge * 0.85 : 0;
    if (p2M.current) p2M.current.opacity = p < 0.45 ? beforeMerge * 0.85 : 0;
    const merged = p > 0.45;
    const fl = merged ? Math.max(0, 1 - (p - 0.45) / 0.2) : 0;
    if (flash.current) flash.current.scale.setScalar(4 + fl * 18);
    if (flashM.current) flashM.current.opacity = fl * 0.9;
    const sh = merged ? (p - 0.45) / 0.55 : 0;
    if (shell.current) shell.current.scale.setScalar(3 + sh * 30);
    if (shellM.current) shellM.current.opacity = Math.max(0, (1 - sh) * 0.65);
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb}>
        <sprite ref={p1} scale={2.2}>
          <spriteMaterial ref={p1M} map={glowSprite()} color="#d8e8ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
        </sprite>
        <sprite ref={p2} scale={2.2}>
          <spriteMaterial ref={p2M} map={glowSprite()} color="#d8e8ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
        </sprite>
      </group>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#ffd8e8" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <sprite ref={shell}>
        <spriteMaterial ref={shellM} map={glowSprite()} color="#ff5080" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}

export function GammaRayBurst({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const flash = useRef<THREE.Sprite>(null);
  const flashM = useRef<THREE.SpriteMaterial>(null);
  const jet = useRef<THREE.Group>(null);
  const jetM = useRef<THREE.MeshBasicMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 1.2);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
      if (jet.current) jet.current.rotation.z = Math.random() * Math.PI;
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    const b = p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2.2);
    if (flash.current) flash.current.scale.setScalar(5 + b * 30);
    if (flashM.current) flashM.current.opacity = b * 0.9;
    if (jet.current) jet.current.scale.set(2.5, 0.8 + b * 8, 1);
    if (jetM.current) jetM.current.opacity = b * 0.85;
  });

  return (
    <group ref={g} visible={false}>
      <sprite ref={flash}>
        <spriteMaterial ref={flashM} map={glowSprite()} color="#e8f4ff" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
      <group ref={jet}>
        <mesh>
          <planeGeometry args={[3, 140]} />
          <meshBasicMaterial ref={jetM} map={beamSprite()} color="#d8e8ff" transparent opacity={0} depthWrite={false} blending={ADD} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export function TidalDisruptionEvent({ minDelay, maxDelay, siteIndex = 0 }: DelayProps) {
  const g = useRef<THREE.Group>(null);
  const orb = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Sprite>(null);
  const discM = useRef<THREE.SpriteMaterial>(null);
  const tick = useEventTimer(minDelay, maxDelay, 5);
  const site = useMemo(() => eventSite(siteIndex), [siteIndex]);

  useFrame((s, dt) => {
    const ph = tick(s.clock.elapsedTime, dt);
    const gg = g.current;
    if (!gg) return;
    if (ph.justSpawned) {
      gg.position.copy(site);
    }
    gg.visible = ph.active;
    if (!ph.active) return;
    gg.quaternion.copy(s.camera.quaternion);
    const p = ph.p;
    if (orb.current) orb.current.rotation.z += dt * (1.5 + p * 3);
    const acc = p < 0.85 ? Math.pow(p / 0.85, 1.3) : Math.max(0, 1 - (p - 0.85) / 0.15);
    if (disc.current) disc.current.scale.setScalar(4 + acc * 8);
    if (discM.current) discM.current.opacity = acc * 0.85;
  });

  return (
    <group ref={g} visible={false}>
      <group ref={orb} />
      <sprite ref={disc}>
        <spriteMaterial ref={discM} map={accretionSprite()} color="#ffc890" transparent opacity={0} depthWrite={false} blending={ADD} toneMapped={false} />
      </sprite>
    </group>
  );
}
