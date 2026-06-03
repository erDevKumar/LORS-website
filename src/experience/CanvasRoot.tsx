import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useQualityTier } from "../hooks/useQualityTier";
import { CameraController } from "./CameraController";
import { GalaxyScene } from "./scenes/GalaxyScene";
import { SolarSystem } from "./scenes/SolarSystem";

function ResponsiveCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / size.height;
    // On portrait screens, increase the FOV so content isn't cropped.
    // 55 is the baseline FOV. We cap at 120 to allow tall phones to see the top of the cards.
    const fov = aspect < 1 ? Math.min(120, 55 / aspect) : 55;
    (camera as any).fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export function CanvasRoot() {
  const qualityTier = useQualityTier();

  if (qualityTier === "fallback") {
    return null;
  }

  const quality = qualityTier === "ultra" ? "ultra" : "standard";
  const dpr =
    qualityTier === "ultra"
      ? Math.min(window.devicePixelRatio, 2)
      : Math.min(window.devicePixelRatio, 1.5);
  const enablePost = qualityTier === "ultra";

  return (
    <div className="fixed inset-0 z-0 h-[100dvh] w-[100dvw] overflow-hidden bg-black pointer-events-auto">
      <Canvas
        gl={{
          antialias: qualityTier === "ultra",
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={dpr}
        camera={{ fov: 55, near: 0.1, far: 500, position: [0, 3, 28] }}
      >
        <ResponsiveCamera />
        <color attach="background" args={["#010308"]} />
        <fog attach="fog" args={["#010308", 150, 450]} />

        <ambientLight intensity={0.35} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} color="#9fd8ff" />
        <directionalLight position={[-10, -8, -5]} intensity={0.4} color="#b794ff" />

        <CameraController />

        <GalaxyScene quality={quality} />
        <SolarSystem quality={quality} />

        {enablePost && (
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.85} intensity={0.9} mipmapBlur />
            <Vignette offset={0.25} darkness={0.95} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
export default CanvasRoot;
