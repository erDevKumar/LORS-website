import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

const productNodes = [
  { label: "RouteMates", angle: 0, color: "#00ddff" },
  { label: "Family OS", angle: 72, color: "#7c3aed" },
  { label: "Utilities", angle: 144, color: "#7eb8ff" },
  { label: "Nexus Lab", angle: 216, color: "#7eb8ff" },
  { label: "Future ventures", angle: 288, color: "#4f5b7d", dashed: true },
];

export function EcosystemScene() {
  const groupRef = useRef<THREE.Group>(null);
  const activeAct = useStore((state) => state.activeAct);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Rotate ecosystem nodes slowly
      groupRef.current.rotation.y = time * 0.1;
    }
  });

  // Scale node lines
  const radius = 2.4;
  const linePoints = productNodes.map((node) => {
    const rad = (node.angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const z = radius * Math.sin(rad);
    return {
      points: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)],
      color: node.color,
      isDashed: !!node.dashed,
    };
  });

  // Visual fade-in and fade-out based on act
  // Active when scrolling between Mission (Act 1) and IT (Act 4)
  const opacity = activeAct >= 1 && activeAct <= 4 
    ? activeAct === 1 
      ? 0.5 
      : activeAct === 4 
        ? 0.5 
        : 1.0 
    : 0;

  if (opacity <= 0.01) return null;

  return (
    <group ref={groupRef} position={[0, -6, 0]}>
      {/* Central LORS Nexus node */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial
          color="#00ddff"
          transparent
          opacity={0.9 * opacity}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color="#00ddff"
          wireframe
          transparent
          opacity={0.3 * opacity}
        />
      </mesh>

      {/* Connection Lines & Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.06 * opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {linePoints.map((line, idx) => {
        const geo = new THREE.BufferGeometry().setFromPoints(line.points);
        const mat = new THREE.LineBasicMaterial({
          color: line.color,
          transparent: true,
          opacity: 0.35 * opacity,
        });
        const lineObj = new THREE.Line(geo, mat);
        return <primitive key={idx} object={lineObj} />;
      })}

      {/* Orbiting nodes */}
      {productNodes.map((node) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const z = radius * Math.sin(rad);

        return (
          <group key={node.label} position={[x, 0, z]}>
            {/* Outer wire mesh */}
            <mesh>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshBasicMaterial
                color={node.color}
                wireframe
                transparent
                opacity={0.4 * opacity}
              />
            </mesh>

            {/* Inner solid node core */}
            <mesh>
              <sphereGeometry args={[0.12, 12, 12]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.8 * opacity}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
