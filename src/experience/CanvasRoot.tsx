import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useQualityTier } from "../hooks/useQualityTier";
import { CameraController } from "./CameraController";
import { GalaxyScene } from "./scenes/GalaxyScene";
import { HologramHelix } from "./scenes/HologramHelix";

export function CanvasRoot() {
  const qualityTier = useQualityTier();

  if (qualityTier === "fallback") {
    return null;
  }

  // Optimize canvas performance parameters based on tier
  const dpr = qualityTier === "ultra" ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 1.5);
  const enablePost = qualityTier === "ultra";

  return (
    <div className="fixed inset-0 z-0 h-screen w-screen overflow-hidden bg-black pointer-events-auto">
      <Canvas
        gl={{
          antialias: qualityTier === "ultra",
          alpha: false,
          powerPreference: "high-performance",
        }}
        dpr={dpr}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 7.5] }}
      >
        {/* Deep space color match */}
        <color attach="background" args={["#02040a"]} />
        
        {/* Ambient illumination */}
        <ambientLight intensity={0.6} />
        
        {/* Subtle cyan and purple accent directional lights */}
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00ddff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#7c3aed" />

        {/* Dynamic camera timeline driven by scroll progress */}
        <CameraController />

        {/* The new Galaxy background and Holographic Helix */}
        <GalaxyScene />
        <HologramHelix />

        {/* Volumetric glow effects for Ultra desktop tier */}
        {enablePost && (
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.15} 
              luminanceSmoothing={0.8} 
              intensity={1.2} 
            />
            <Vignette 
              offset={0.2} 
              darkness={1.0} 
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
export default CanvasRoot;
