import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";

type Quality = "ultra" | "standard";

/** A thin, fast, infrequent meteor streak far behind the system. */
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const progress = useRef(0);
  const speed = useRef(0.04);

  useEffect(() => {
    const trySpawn = () => {
      if (!active && Math.random() > 0.55) {
        const startX = (Math.random() - 0.5) * 90;
        const startY = Math.random() * 30 + 12;
        const startZ = -40 - Math.random() * 25;
        startPos.current.set(startX, startY, startZ);

        const dirX = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 25);
        endPos.current.set(
          startX + dirX,
          startY - 40 - Math.random() * 12,
          startZ - Math.random() * 15
        );

        progress.current = 0;
        speed.current = 0.03 + Math.random() * 0.025;

        if (ref.current) {
          ref.current.position.copy(startPos.current);
          ref.current.lookAt(endPos.current);
          ref.current.rotateX(Math.PI / 2);
        }
        setActive(true);
      }
    };

    const interval = setInterval(trySpawn, 4500 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, [active]);

  useFrame(() => {
    if (active && ref.current) {
      progress.current += speed.current;
      ref.current.position.lerpVectors(startPos.current, endPos.current, progress.current);
      if (progress.current >= 1) setActive(false);
    }
  });

  return (
    <mesh ref={ref} visible={active}>
      <cylinderGeometry args={[0.005, 0.05, 3.4, 4]} />
      <meshBasicMaterial color="#cfeaff" transparent opacity={0.7} toneMapped={false} />
    </mesh>
  );
}

/** Big, slowly rotating galactic disk band: color-graded core -> rim with arms. */
function GalacticDisk({ quality }: { quality: Quality }) {
  const diskRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = quality === "ultra" ? 7000 : 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const core = new THREE.Color("#ffcf8a");
    const mid = new THREE.Color("#6d4bd8");
    const rim = new THREE.Color("#14224f");
    const maxR = 120;
    const arms = 2;

    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * maxR;
      const t = r / maxR;
      const armAngle = (i % arms) * ((Math.PI * 2) / arms);
      const spin = t * 4.2;
      const jitter = (Math.random() - 0.5) * (0.6 + t * 1.4);
      const angle = armAngle + spin + jitter;

      const thickness = (1 - t) * 5 + 0.6;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * thickness * Math.pow(1 - t, 0.5);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = new THREE.Color();
      if (t < 0.45) c.copy(core).lerp(mid, t / 0.45);
      else c.copy(mid).lerp(rim, (t - 0.45) / 0.55);

      // Dust-lane / arm brightness modulation.
      const arm = 0.5 + 0.5 * Math.cos(angle * arms - spin * 2);
      const bright = (0.35 + 0.65 * arm) * (1 - t * 0.55);
      colors[i * 3] = c.r * bright;
      colors[i * 3 + 1] = c.g * bright;
      colors[i * 3 + 2] = c.b * bright;
    }
    return { positions, colors };
  }, [quality]);

  useFrame((state) => {
    if (diskRef.current) diskRef.current.rotation.y = state.clock.elapsedTime * 0.012;
  });

  return (
    <points ref={diskRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.45}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Soft additive nebula cloud in a brand color. */
function NebulaCloud({
  color,
  position,
  spread,
  count,
}: {
  color: string;
  position: [number, number, number];
  spread: number;
  count: number;
}) {
  const matRef = useRef<THREE.PointsMaterial>(null);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Gaussian-ish clustering toward the center.
      const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * spread;
      arr[i * 3] = g();
      arr[i * 3 + 1] = g() * 0.6;
      arr[i * 3 + 2] = g();
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.06;
    }
  });

  return (
    <points position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color={color}
        size={3.2}
        sizeAttenuation
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function GalaxyScene({ quality = "ultra" }: { quality?: Quality }) {
  const backdropRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (backdropRef.current) {
      // Gentle mouse parallax across the whole backdrop.
      const px = state.pointer.x * 0.04;
      const py = state.pointer.y * 0.03;
      backdropRef.current.rotation.y = THREE.MathUtils.lerp(
        backdropRef.current.rotation.y,
        px,
        0.04
      );
      backdropRef.current.rotation.x = THREE.MathUtils.lerp(
        backdropRef.current.rotation.x,
        -py,
        0.04
      );
    }
  });

  const nebulaCount = quality === "ultra" ? 600 : 280;

  return (
    <group ref={backdropRef}>
      {/* Far pinpoint starfield. */}
      <Stars radius={140} depth={70} count={quality === "ultra" ? 6000 : 3000} factor={4} saturation={0.6} fade speed={0.6} />

      {/* Tilted galactic disk band, pushed far back so it never washes out the system. */}
      <group position={[0, -8, -52]} rotation={[0.95, 0, 0.18]}>
        <GalacticDisk quality={quality} />
      </group>

      {/* Depth nebulae in brand cyan / violet. */}
      <NebulaCloud color="#1aa7d8" position={[-32, 8, -40]} spread={16} count={nebulaCount} />
      <NebulaCloud color="#7c3aed" position={[34, -10, -44]} spread={18} count={nebulaCount} />

      <ShootingStar />
      <ShootingStar />
    </group>
  );
}
