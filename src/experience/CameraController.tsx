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

    // Responsive damping — settles within ~0.8s so panels feel snappy
    const lambda = qualityTier === "ultra" ? 4.5 : 5.5;

    // Smooth camera position
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetPos.current.x, lambda, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetPos.current.y, lambda, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetPos.current.z, lambda, dt);

    // Look-at damps at the same rate so the camera looks at its destination throughout travel
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookAt.x, lambda, dt);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookAt.y, lambda, dt);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookAt.z, lambda, dt);

    state.camera.lookAt(currentLookAt.current);
  });

  return null;
}
