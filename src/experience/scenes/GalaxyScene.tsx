import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import {
  starSprite,
  glowSprite,
  hiiRegionSprite,
  coreGlowSprite,
  companionGlowSprite,
  tidalBridgeSprite,
} from "../galaxyTextures";
import {
  diskQuat,
  armLocal,
  CORE_RADIUS,
  companionPosition,
  companionRadius,
} from "../m51";
import {
  NebulaCollapse,
  Nova,
  Hypernova,
  GalacticMerger,
  BlackHoleMerger,
  Kilonova,
  GammaRayBurst,
  TidalDisruptionEvent,
  AGNFlicker,
} from "./galaxyEvents";

type Quality = "ultra" | "standard";

const ADD = THREE.AdditiveBlending;

const STAR_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vColor = aColor;
    float tw = 0.65 + 0.35 * sin(uTime * 1.6 + aPhase);
    vTw = tw;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = clamp(aSize * tw * (uScale / -mv.z), 0.5, 36.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAG = /* glsl */ `
  uniform sampler2D uTex;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec4 t = texture2D(uTex, gl_PointCoord);
    if (t.a < 0.01) discard;
    gl_FragColor = vec4(vColor * vTw, t.a);
  }
`;

type StarData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  phases: Float32Array;
};

function buildM51Arms(count: number): StarData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const coreColor = new THREE.Color("#ffe8c0");
  const hiiColor = new THREE.Color("#ff90c0");
  const obColor = new THREE.Color("#8ac8ff");
  const c = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const arm = i % 2;
    const t = Math.pow(Math.random(), 0.65);
    const loc = armLocal(arm, t);
    
    // Wider arms for the larger scale
    const armWidth = 5 + t * 12;
    const jitterX = (Math.random() - 0.5) * armWidth;
    const jitterY = (Math.random() - 0.5) * armWidth;
    const thickness = (1 - t) * 4 + 1;
    const jitterZ = (Math.random() - 0.5) * thickness;
    
    const localPos = new THREE.Vector3(
      loc.x + jitterX,
      loc.y + jitterY,
      jitterZ
    );
    const worldPos = localPos.applyQuaternion(diskQuat);
    
    positions[i * 3] = worldPos.x;
    positions[i * 3 + 1] = worldPos.y;
    positions[i * 3 + 2] = worldPos.z;

    if (t < 0.3) {
      c.copy(coreColor).lerp(hiiColor, t / 0.3);
    } else if (t < 0.7) {
      c.copy(hiiColor).lerp(obColor, (t - 0.3) / 0.4);
    } else {
      c.copy(obColor);
    }

    const bright = 0.5 + Math.random() * 0.5;
    colors[i * 3] = c.r * bright;
    colors[i * 3 + 1] = c.g * bright;
    colors[i * 3 + 2] = c.b * bright;

    sizes[i] = 0.8 + Math.random() * 2.0;
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

function buildCoreBulge(count: number): StarData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const c = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Larger core bulge for the scaled galaxy
    const r = Math.pow(Math.random(), 0.5) * CORE_RADIUS * 1.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI * 0.5;
    
    const localPos = new THREE.Vector3(
      r * Math.cos(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(phi) * 0.5
    );
    const worldPos = localPos.applyQuaternion(diskQuat);
    
    positions[i * 3] = worldPos.x;
    positions[i * 3 + 1] = worldPos.y;
    positions[i * 3 + 2] = worldPos.z;

    const t = r / (CORE_RADIUS * 1.5);
    c.setRGB(
      1.0,
      0.85 + t * 0.1,
      0.65 + t * 0.2
    );

    const bright = 0.6 + Math.random() * 0.4;
    colors[i * 3] = c.r * bright;
    colors[i * 3 + 1] = c.g * bright;
    colors[i * 3 + 2] = c.b * bright;

    sizes[i] = 0.7 + Math.random() * 1.5;
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

function buildScatter(count: number, radius: number): StarData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const c = new THREE.Color();
  const SCATTER_PALETTE = ["#ffffff", "#dbe7ff", "#ffe9cf", "#cfe0ff", "#ffd9d2"];

  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const rr = radius * (0.55 + Math.random() * 0.45);
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = rr * s * Math.cos(theta);
    positions[i * 3 + 1] = rr * u;
    positions[i * 3 + 2] = rr * s * Math.sin(theta);

    c.set(SCATTER_PALETTE[(Math.random() * SCATTER_PALETTE.length) | 0]);
    const b = 0.7 + Math.random() * 0.3;
    colors[i * 3] = c.r * b;
    colors[i * 3 + 1] = c.g * b;
    colors[i * 3 + 2] = c.b * b;

    sizes[i] = Math.random() < 0.08 ? 3 + Math.random() * 4 : 1 + Math.random() * 1.6;
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

function ShaderStars({
  data,
  uScale,
}: {
  data: StarData;
  uScale: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScale: { value: uScale },
      uTex: { value: starSprite() },
    }),
    [uScale]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  const n = data.sizes.length;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={n} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={n} array={data.colors} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={n} array={data.sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aPhase" count={n} array={data.phases} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={STAR_VERT}
        fragmentShader={STAR_FRAG}
        transparent
        depthWrite={false}
        blending={ADD}
      />
    </points>
  );
}

function CoreGlow() {
  const matRef = useRef<THREE.SpriteMaterial>(null);
  const tex = useMemo(() => coreGlowSprite(), []);
  
  useFrame((state) => {
    if (matRef.current) {
      const t = state.clock.elapsedTime;
      matRef.current.opacity = 0.7 + Math.sin(t * 0.4) * 0.1;
    }
  });

  return (
    <sprite scale={[35, 35, 1]}>
      <spriteMaterial
        ref={matRef}
        map={tex}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={ADD}
        toneMapped={false}
      />
    </sprite>
  );
}

function HIIRegions({ quality }: { quality: Quality }) {
  const count = quality === "ultra" ? 30 : 18;
  const tex = useMemo(() => hiiRegionSprite(), []);
  
  const regions = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const arm = i % 2;
      const t = 0.2 + Math.random() * 0.6;
      const loc = armLocal(arm, t);
      // Larger jitter for the scaled galaxy
      const jitter = 4 + t * 6;
      const localPos = new THREE.Vector3(
        loc.x + (Math.random() - 0.5) * jitter,
        loc.y + (Math.random() - 0.5) * jitter,
        (Math.random() - 0.5) * 2
      );
      const worldPos = localPos.applyQuaternion(diskQuat);
      arr.push({
        position: [worldPos.x, worldPos.y, worldPos.z] as [number, number, number],
        scale: 5 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  return (
    <group>
      {regions.map((r, i) => (
        <HIISprite key={i} tex={tex} position={r.position} scale={r.scale} phase={r.phase} />
      ))}
    </group>
  );
}

function HIISprite({
  tex,
  position,
  scale,
  phase,
}: {
  tex: THREE.Texture;
  position: [number, number, number];
  scale: number;
  phase: number;
}) {
  const matRef = useRef<THREE.SpriteMaterial>(null);
  
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.1;
    }
  });

  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial
        ref={matRef}
        map={tex}
        color="#ff90c0"
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={ADD}
        toneMapped={false}
      />
    </sprite>
  );
}

function Companion() {
  const tex = useMemo(() => companionGlowSprite(), []);
  const pos = companionPosition;
  
  return (
    <group position={[pos.x, pos.y, pos.z]}>
      <sprite scale={[companionRadius * 2.8, companionRadius * 2.2, 1]}>
        <spriteMaterial
          map={tex}
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={ADD}
          toneMapped={false}
        />
      </sprite>
      <sprite scale={[companionRadius * 1.0, companionRadius * 1.0, 1]}>
        <spriteMaterial
          map={glowSprite()}
          color="#fff0d0"
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={ADD}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

function TidalBridge() {
  const tex = useMemo(() => tidalBridgeSprite(), []);
  const armTip = armLocal(1, 0.92);
  const startPos = new THREE.Vector3(armTip.x, armTip.y, 0).applyQuaternion(diskQuat);
  const endPos = companionPosition;
  
  const midPos = startPos.clone().lerp(endPos, 0.5);
  const dir = endPos.clone().sub(startPos);
  const length = dir.length();
  const angle = Math.atan2(dir.y, dir.x);

  return (
    <mesh position={[midPos.x, midPos.y, midPos.z - 3]} rotation={[0, 0, angle]}>
      <planeGeometry args={[length, 8]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.35}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

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
      const g = () => (Math.random() + Math.random() + Math.random() - 1.5) * spread;
      arr[i * 3] = g();
      arr[i * 3 + 1] = g() * 0.6;
      arr[i * 3 + 2] = g();
    }
    return arr;
  }, [count, spread]);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.opacity = 0.14 + Math.sin(state.clock.elapsedTime * 0.35 + phase) * 0.05;
    }
  });

  return (
    <points position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        map={glowSprite()}
        color={color}
        size={14}
        sizeAttenuation
        transparent
        opacity={0.16}
        depthWrite={false}
        blending={ADD}
      />
    </points>
  );
}

export function GalaxyScene({ quality = "ultra" }: { quality?: Quality }) {
  const ultra = quality === "ultra";

  // Larger star counts for immersive environment
  const armData = useMemo(() => buildM51Arms(ultra ? 12000 : 6000), [ultra]);
  const coreData = useMemo(() => buildCoreBulge(ultra ? 3000 : 1500), [ultra]);
  const scatterData = useMemo(() => buildScatter(ultra ? 4000 : 2000, 200), [ultra]);

  const nebulaCount = ultra ? 280 : 140;

  return (
    <group>
      {/* Distant background stars - the universe beyond M51 */}
      <Stars radius={250} depth={100} count={ultra ? 6000 : 3000} factor={4} saturation={0.5} fade speed={0.4} />

      {/* M51 Whirlpool Galaxy - YOU ARE INSIDE THIS GALAXY */}
      {/* The galaxy is centered at origin, cards orbit within it */}
      
      {/* Scattered halo stars surrounding the entire galaxy */}
      <ShaderStars data={scatterData} uScale={ultra ? 280 : 240} />

      {/* The galactic core at the center - where Hero card sits */}
      <ShaderStars data={coreData} uScale={ultra ? 260 : 220} />
      <CoreGlow />
      <AGNFlicker minDelay={8} maxDelay={20} />

      {/* The grand spiral arms - cards travel through these */}
      <ShaderStars data={armData} uScale={ultra ? 300 : 260} />

      {/* Pink HII star-forming regions along the arms */}
      <HIIRegions quality={quality} />

      {/* NGC 5195 companion galaxy at the arm tip */}
      <Companion />
      <TidalBridge />

      {/* Nebula clouds embedded throughout the galaxy */}
      <NebulaCloud color="#6040a0" position={[-45, 12, -25]} spread={18} count={nebulaCount} />
      <NebulaCloud color="#4080c0" position={[50, -8, 15]} spread={20} count={nebulaCount} />
      <NebulaCloud color="#5030a0" position={[-30, -15, 35]} spread={16} count={nebulaCount} />
      <NebulaCloud color="#3060a0" position={[25, 20, -40]} spread={22} count={nebulaCount} />
      {ultra && (
        <>
          <NebulaCloud color="#a06080" position={[60, 15, -30]} spread={24} count={nebulaCount} />
          <NebulaCloud color="#3070b0" position={[-55, -20, 20]} spread={20} count={nebulaCount} />
          <NebulaCloud color="#7050a0" position={[35, -25, 45]} spread={18} count={nebulaCount} />
        </>
      )}

      {/* Galactic events happening around you as you travel - frequent and visible */}
      {/* Nebula collapses / star births */}
      <NebulaCollapse minDelay={ultra ? 4 : 8} maxDelay={ultra ? 10 : 18} siteIndex={0} />
      <NebulaCollapse minDelay={ultra ? 6 : 12} maxDelay={ultra ? 14 : 22} siteIndex={3} />
      
      {/* Nova flares - common stellar events */}
      <Nova minDelay={ultra ? 3 : 6} maxDelay={ultra ? 8 : 14} siteIndex={1} />
      <Nova minDelay={ultra ? 4 : 8} maxDelay={ultra ? 10 : 16} siteIndex={4} />
      <Nova minDelay={ultra ? 5 : 10} maxDelay={ultra ? 12 : 20} siteIndex={7} />
      
      {/* Hypernovae - dramatic but less frequent */}
      {ultra && <Hypernova minDelay={8} maxDelay={20} siteIndex={2} />}
      
      {/* Galaxy mergers in the distance */}
      {ultra && <GalacticMerger minDelay={15} maxDelay={35} siteIndex={3} />}
      
      {/* Black hole events */}
      <BlackHoleMerger minDelay={ultra ? 8 : 15} maxDelay={ultra ? 18 : 30} siteIndex={5} />
      
      {/* Kilonova - neutron star mergers */}
      <Kilonova minDelay={ultra ? 6 : 12} maxDelay={ultra ? 15 : 25} siteIndex={6} />
      <Kilonova minDelay={ultra ? 8 : 14} maxDelay={ultra ? 18 : 28} siteIndex={8} />
      
      {/* Gamma ray bursts - brief and bright */}
      <GammaRayBurst minDelay={ultra ? 5 : 10} maxDelay={ultra ? 12 : 22} siteIndex={0} />
      <GammaRayBurst minDelay={ultra ? 7 : 12} maxDelay={ultra ? 15 : 25} siteIndex={4} />
      
      {/* Tidal disruption events */}
      <TidalDisruptionEvent minDelay={ultra ? 10 : 18} maxDelay={ultra ? 22 : 38} siteIndex={7} />
    </group>
  );
}
