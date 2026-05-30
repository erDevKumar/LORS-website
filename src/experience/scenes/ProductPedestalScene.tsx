import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../../store/useStore";

interface HologramProjectorProps {
  color: string;
  opacity: number;
}

function HologramProjector({ color, opacity }: HologramProjectorProps) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, opacity]
  );

  // Sync opacity changes during scroll animation
  useEffect(() => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uOpacity.value = opacity;
    }
  }, [opacity]);

  return (
    <mesh position={[0, -0.1, 0]}>
      <cylinderGeometry args={[0.55, 0.75, 1.0, 32, 1, true]} />
      <shaderMaterial
        ref={shaderRef}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            // Speed up and scale moving laser lines
            float scan = sin(vUv.y * 22.0 - uTime * 6.5) * 0.5 + 0.5;
            // Vertical scan lines grid cross pattern
            float crossScan = cos(vUv.x * 40.0 + uTime * 2.0) * 0.3 + 0.7;
            // Fade intensity towards the top
            float fade = 1.0 - vUv.y;
            float alpha = (scan * crossScan * 0.45 + 0.15) * fade * uOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function ProductPedestalScene() {
  const routematesRef = useRef<THREE.Group>(null);
  const familyOsRef = useRef<THREE.Group>(null);
  
  const activeAct = useStore((state) => state.activeAct);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate RouteMates artifact
    if (routematesRef.current) {
      routematesRef.current.rotation.y = time * 0.4;
      routematesRef.current.rotation.x = Math.sin(time * 0.5) * 0.15;
      // Hover bobbing
      routematesRef.current.position.y = -10.1 + Math.sin(time * 1.5) * 0.08;
    }

    // Rotate Family OS artifact
    if (familyOsRef.current) {
      familyOsRef.current.rotation.y = -time * 0.3;
      familyOsRef.current.rotation.z = Math.cos(time * 0.4) * 0.12;
      // Hover bobbing
      familyOsRef.current.position.y = -10.1 + Math.cos(time * 1.3) * 0.08;
    }
  });

  // Fade in during Products section (Act 3) and fade out during Pipeline (Act 5)
  const opacity = activeAct >= 2 && activeAct <= 5
    ? activeAct === 2
      ? 0.5
      : activeAct === 5
        ? 0.5
        : 1.0
    : 0;

  if (opacity <= 0.01) return null;

  return (
    <group position={[0, 0, 0]}>
      {/* RouteMates Pedestal (Left) */}
      <group position={[-2.2, -10.5, 0]}>
        {/* Base projection rings */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial
            color="#00ddff"
            transparent
            opacity={0.3 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial
            color="#00ddff"
            transparent
            opacity={0.15 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Projection laser cone - Holographic shader */}
        <HologramProjector color="#00ddff" opacity={opacity} />

        {/* Floating RouteMates Artifact (Tetrahedron/Pyramid representing mapping) */}
        <group ref={routematesRef} position={[0, 0.4, 0]}>
          <mesh>
            <coneGeometry args={[0.55, 0.9, 4]} />
            <meshBasicMaterial
              color="#00ddff"
              wireframe
              transparent
              opacity={0.6 * opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <coneGeometry args={[0.3, 0.5, 4]} />
            <meshBasicMaterial
              color="#7eb8ff"
              transparent
              opacity={0.3 * opacity}
            />
          </mesh>
        </group>
      </group>

      {/* Family OS Pedestal (Right) */}
      <group position={[2.2, -10.5, 0]}>
        {/* Base projection rings */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.3 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial
            color="#7c3aed"
            transparent
            opacity={0.15 * opacity}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Projection laser cone - Holographic shader */}
        <HologramProjector color="#7c3aed" opacity={opacity} />

        {/* Floating Family OS Artifact (Nested cubes representing household/rooms structure) */}
        <group ref={familyOsRef} position={[0, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshBasicMaterial
              color="#7c3aed"
              wireframe
              transparent
              opacity={0.6 * opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial
              color="#ffffff"
              wireframe
              transparent
              opacity={0.4 * opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
