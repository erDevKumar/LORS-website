import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

export function HeroScene() {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const activeAct = useStore((state) => state.activeAct);

  // Generate particle positions
  const positions = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      // Create a spherical distribution of particles
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.0 + Math.random() * 4.0; // Radius between 2 and 6
      
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate core
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.2;
    }

    // Rotate particle system slowly
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -time * 0.05;
      particlesRef.current.rotation.x = Math.sin(time * 0.03) * 0.1;
    }
  });

  // Calculate scaling/opacity based on act
  // If user scrolls past Ecosystem (Act 2), let's fade out the Hero Scene
  const opacity = activeAct <= 2 ? 1.0 - (activeAct / 2.0) : 0;

  if (opacity <= 0.01) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* Nexus core wireframe */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 2]} />
        <meshBasicMaterial
          color="#00ddff"
          wireframe
          transparent
          opacity={0.25 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner glowing core */}
      <mesh>
        <dodecahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial
          color="#7c3aed"
          wireframe
          transparent
          opacity={0.4 * opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Particle Swarm */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#7eb8ff"
          transparent
          opacity={0.6 * opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle outer particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions.slice(0, 300), 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#00ddff"
          transparent
          opacity={0.8 * opacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
