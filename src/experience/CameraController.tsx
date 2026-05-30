import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

export function CameraController() {
  const qualityTier = useStore((state) => state.qualityTier);
  const scrollProgress = useStore((state) => state.scrollProgress);
  
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3(0, 0, 7.5));
  
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    // Base position
    const baseX = 0;
    const baseY = 0; // slightly above center
    const baseZ = 7.5;

    // Add mouse parallax (more pronounced on ultra)
    const parallaxStrength = qualityTier === "ultra" ? 1.5 : 0.5;
    const targetX = baseX + mouse.current.x * parallaxStrength;
    const targetY = baseY + mouse.current.y * parallaxStrength - (scrollProgress * 2); // Slight downward drift on scroll
    
    targetPos.current.set(targetX, targetY, baseZ);

    const lerpFactor = qualityTier === "ultra" ? 0.05 : 0.08;

    // Smooth camera position
    state.camera.position.lerp(targetPos.current, lerpFactor);

    // Look at origin, with slight offset based on scroll
    const lookAtTarget = new THREE.Vector3(0, -(scrollProgress * 2), -5);
    currentLookAt.current.lerp(lookAtTarget, lerpFactor);
    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}

