import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { HologramSectionPanel } from "../../components/HologramSectionPanel";
import {
  BODIES,
  ORBIT_RADIUS,
  ORBIT_TILT,
  panelPosition,
  type BodyDef,
} from "../galaxyLayout";

type Quality = "ultra" | "standard";

const RING_SEG = { ultra: 96, standard: 48 } as const;

/** Faint HUD-style orbit ring marking where the cards sit. */
function OrbitRing({ quality }: { quality: Quality }) {
  const seg = RING_SEG[quality];
  return (
    <group rotation={[-Math.PI / 2 + ORBIT_TILT, 0, 0]}>
      <mesh>
        <ringGeometry args={[ORBIT_RADIUS - 0.06, ORBIT_RADIUS + 0.06, seg]} />
        <meshBasicMaterial
          color="#3fb6ff"
          transparent
          opacity={0.16}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh>
        <ringGeometry args={[ORBIT_RADIUS - 1.6, ORBIT_RADIUS - 1.55, seg]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.07}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/** A content card floating at its orbital slot, billboarded to stay head-on. */
function Panel({ body }: { body: BodyDef }) {
  const activeAct = useStore((s) => s.activeAct);
  const pos = useMemo(() => panelPosition(body.act), [body.act]);
  const groupRef = useRef<THREE.Group>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const active = useRef(0);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const target = body.act === activeAct ? 1 : 0;
    active.current = THREE.MathUtils.damp(active.current, target, 5, dt);
    const a = active.current;
    if (groupRef.current) {
      groupRef.current.quaternion.copy(state.camera.quaternion);
      // Gentle drift so idle cards feel alive without skewing.
      groupRef.current.position.y = pos.y + Math.sin(t * 0.5 + phase) * 0.18;
    }
    if (domRef.current) {
      domRef.current.style.opacity = a.toFixed(3);
      domRef.current.style.pointerEvents = a > 0.6 ? "auto" : "none";
      domRef.current.style.transform = `scale(${0.96 + a * 0.04})`;
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, pos.y, pos.z]}>
      <Html
        transform
        className="hologram-panel-container"
        scale={0.42}
        style={{
          width: "920px",
          height: "680px",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <div
          ref={domRef}
          style={{ opacity: 0, pointerEvents: "none" }}
          className="planet-panel flex h-full w-full overflow-hidden rounded-3xl"
        >
          <HologramSectionPanel panelId={body.id} />
        </div>
      </Html>
    </group>
  );
}

export function SolarSystem({ quality = "ultra" }: { quality?: Quality }) {
  return (
    <group>
      <OrbitRing quality={quality} />
      {BODIES.map((body) => (
        <Panel key={`panel-${body.id}`} body={body} />
      ))}
    </group>
  );
}

export default SolarSystem;
