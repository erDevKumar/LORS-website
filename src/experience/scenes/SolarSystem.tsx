import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../../store/useStore";
import { HologramSectionPanel } from "../../components/HologramSectionPanel";
import { glowSprite } from "../galaxyTextures";
import {
  BODIES,
  ORBIT_RADIUS,
  ORBIT_TILT,
  panelPosition,
  type BodyDef,
} from "../galaxyLayout";

type Quality = "ultra" | "standard";

const RING_SEG = { ultra: 96, standard: 48 } as const;

function OrbitRing({ quality }: { quality: Quality }) {
  const seg = RING_SEG[quality];
  return (
    <group rotation={[-Math.PI / 2 + ORBIT_TILT, 0, 0]}>
      {/* Main orbit ring */}
      <mesh>
        <ringGeometry args={[ORBIT_RADIUS - 0.15, ORBIT_RADIUS + 0.15, seg]} />
        <meshBasicMaterial
          color="#3fb6ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner accent ring */}
      <mesh>
        <ringGeometry args={[ORBIT_RADIUS - 4, ORBIT_RADIUS - 3.8, seg]} />
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Outer accent ring */}
      <mesh>
        <ringGeometry args={[ORBIT_RADIUS + 3.8, ORBIT_RADIUS + 4, seg]} />
        <meshBasicMaterial
          color="#00ddff"
          transparent
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function usePanelLayout() {
  const { size } = useThree();
  return useMemo(() => {
    const isMobile = size.width < 768;
    return {
      width: isMobile ? "350px" : "920px",
      height: isMobile ? "700px" : "680px",
      scale: isMobile ? 1.35 : 0.95,
      glow: (isMobile ? [25, 45] : [42, 33]) as [number, number],
    };
  }, [size.width]);
}

function ActiveGlow({ body }: { body: BodyDef }) {
  const activeAct = useStore((s) => s.activeAct);
  const pos = useMemo(() => panelPosition(body.act), [body.act]);
  const matRef = useRef<THREE.SpriteMaterial>(null);
  const tex = useMemo(() => glowSprite(), []);
  const layout = usePanelLayout();
  const glow = layout.glow;

  useFrame((state, dt) => {
    if (!matRef.current) return;
    const isActive = body.act === activeAct;
    const target = isActive ? 0.35 : 0;
    matRef.current.opacity = THREE.MathUtils.damp(matRef.current.opacity, target, 4, dt);
    
    if (isActive) {
      const pulse = 0.95 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      matRef.current.opacity *= pulse;
    }
  });

  return (
    <sprite position={[pos.x, pos.y, pos.z - 1]} scale={[glow[0], glow[1], 1]}>
      <spriteMaterial
        ref={matRef}
        map={tex}
        color={body.color}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  );
}

function Panel({ body }: { body: BodyDef }) {
  const activeAct = useStore((s) => s.activeAct);
  const pos = useMemo(() => panelPosition(body.act), [body.act]);
  const layout = usePanelLayout();
  const groupRef = useRef<THREE.Group>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const active = useRef(0);

  useFrame((state, dt) => {
    const target = body.act === activeAct ? 1 : 0;
    active.current = THREE.MathUtils.damp(active.current, target, 5, dt);
    const a = active.current;
    if (groupRef.current) {
      groupRef.current.quaternion.copy(state.camera.quaternion);
    }
    if (domRef.current) {
      domRef.current.style.opacity = a.toFixed(3);
      domRef.current.style.pointerEvents = a > 0.6 ? "auto" : "none";
    }
  });

  return (
    <group ref={groupRef} position={[pos.x, pos.y, pos.z]}>
      <Html
        transform
        className="hologram-panel-container"
        scale={layout.scale}
        style={{
          width: layout.width,
          height: layout.height,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <div
          ref={domRef}
          data-galaxy-panel-id={body.id}
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
        <ActiveGlow key={`glow-${body.id}`} body={body} />
      ))}
      {BODIES.map((body) => (
        <Panel key={`panel-${body.id}`} body={body} />
      ))}
    </group>
  );
}

export default SolarSystem;
