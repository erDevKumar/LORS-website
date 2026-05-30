import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, Sparkles } from "@react-three/drei";

function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const [active, setActive] = useState(false);
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  const progress = useRef(0);
  const speed = useRef(0.05);

  useEffect(() => {
    const trySpawn = () => {
      if (!active && Math.random() > 0.4) {
        // Random spawn location high up and far away
        const startX = (Math.random() - 0.5) * 60;
        const startY = Math.random() * 20 + 10;
        const startZ = -15 - Math.random() * 20;

        startPos.current.set(startX, startY, startZ);
        
        // Target position lower and further across
        const dirX = (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 20);
        endPos.current.set(startX + dirX, startY - 30 - Math.random() * 10, startZ - Math.random() * 20);
        
        progress.current = 0;
        speed.current = 0.015 + Math.random() * 0.02;
        
        if (ref.current) {
          ref.current.position.copy(startPos.current);
          ref.current.lookAt(endPos.current);
          ref.current.rotateX(Math.PI / 2); // align cylinder with direction
        }
        
        setActive(true);
      }
    };

    const interval = setInterval(trySpawn, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [active]);

  useFrame(() => {
    if (active && ref.current) {
      progress.current += speed.current;
      ref.current.position.lerpVectors(startPos.current, endPos.current, progress.current);
      if (progress.current >= 1) {
        setActive(false);
      }
    }
  });

  return (
    <mesh ref={ref} visible={active}>
      <cylinderGeometry args={[0.01, 0.08, 4, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </mesh>
  );
}

export function GalaxyScene() {
  const galaxyRef = useRef<THREE.Group>(null);
  const nebulaRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  // Generate nebula particles
  const nebulaParticles = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorA = new THREE.Color("#7c3aed"); // Purple
    const colorB = new THREE.Color("#00ddff"); // Cyan

    for (let i = 0; i < count; i++) {
      // Spiral galaxy distribution
      const radius = Math.random() * 20 + 2;
      const spinAngle = radius * 0.5;
      const branchAngle = (i % 3) * ((Math.PI * 2) / 3); // 3 arms
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 1.5;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 2;

      const x = Math.cos(branchAngle + spinAngle) * radius + randomX;
      const y = randomY;
      const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Mix colors based on radius
      const mixedColor = colorA.clone().lerp(colorB, radius / 22);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (galaxyRef.current) {
      // Slow rotation for the entire galaxy
      galaxyRef.current.rotation.y = time * 0.05;
      galaxyRef.current.rotation.z = Math.sin(time * 0.02) * 0.1;
    }
    
    // Nebula pulsing effect
    if (materialRef.current) {
      // Pulse opacity between 0.5 and 0.9
      materialRef.current.opacity = 0.7 + Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <>
      <group ref={galaxyRef} position={[0, -5, -15]} rotation={[0.2, 0, 0]}>
        {/* Dense background stars */}
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
        
        {/* Floating sparkles */}
        <Sparkles count={400} scale={30} size={2} speed={0.4} opacity={0.6} color="#ffffff" />
        
        {/* Custom nebula spiral */}
        <points ref={nebulaRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={nebulaParticles.positions.length / 3}
              array={nebulaParticles.positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={nebulaParticles.colors.length / 3}
              array={nebulaParticles.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            ref={materialRef}
            size={0.15}
            vertexColors
            transparent
            opacity={0.8}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
      
      {/* Dynamic Galactic Activities */}
      <ShootingStar />
      <ShootingStar />
      <ShootingStar />
    </>
  );
}
