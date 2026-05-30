import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";
import { cameraTransform } from "./galaxyLayout";

export function CameraController() {
  const qualityTier = useStore((state) => state.qualityTier);

  const currentLookAt = useRef(new THREE.Vector3(0, 2.6, 0));
  const targetPos = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useFrame((state, dt) => {
    const scrollIndex = useStore.getState().scrollIndex;
    const { position, lookAt } = cameraTransform(scrollIndex);

    // Tier-aware mouse parallax for immersive feel
    const parallax = qualityTier === "ultra" ? 1.8 : 1.0;
    position.x += state.pointer.x * parallax;
    position.y += state.pointer.y * parallax * 0.5;
    targetPos.current.copy(position);

    if (!initialized.current) {
      state.camera.position.copy(targetPos.current);
      currentLookAt.current.copy(lookAt);
      initialized.current = true;
    }

    // Smoother damping for cinematic galactic travel
    const lambda = qualityTier === "ultra" ? 2.5 : 3.5;

    // Smooth camera position
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetPos.current.x, lambda, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetPos.current.y, lambda, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetPos.current.z, lambda, dt);

    // Smooth look-at target
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookAt.x, lambda * 0.8, dt);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookAt.y, lambda * 0.8, dt);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookAt.z, lambda * 0.8, dt);

    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
