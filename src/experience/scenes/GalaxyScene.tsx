import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Stars } from "@react-three/drei";
import {
  starSprite,
  glowSprite,
  spiralGalaxySprite,
  ellipticalGalaxySprite,
  cometTailSprite,
} from "../galaxyTextures";

type Quality = "ultra" | "standard";

const ADD = THREE.AdditiveBlending;

/* ------------------------------------------------------------------ */
/* Round, twinkling shader starfield                                   */
/* ------------------------------------------------------------------ */

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

function buildDisk(count: number): StarData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);

  const core = new THREE.Color("#ffe6b8");
  const mid = new THREE.Color("#8a6ff0");
  const rim = new THREE.Color("#2a4a8f");
  const maxR = 120;
  const arms = 2;
  const c = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * maxR;
    const t = r / maxR;
    const armAngle = (i % arms) * ((Math.PI * 2) / arms);
    const spin = t * 4.2;
    const jitter = (Math.random() - 0.5) * (0.6 + t * 1.4);
    const angle = armAngle + spin + jitter;

    const thickness = (1 - t) * 5 + 0.6;
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    positions[i * 3 + 1] = (Math.random() - 0.5) * thickness * Math.pow(1 - t, 0.5);

    if (t < 0.45) c.copy(core).lerp(mid, t / 0.45);
    else c.copy(mid).lerp(rim, (t - 0.45) / 0.55);

    const arm = 0.5 + 0.5 * Math.cos(angle * arms - spin * 2);
    const bright = (0.4 + 0.6 * arm) * (1 - t * 0.5);
    colors[i * 3] = c.r * bright;
    colors[i * 3 + 1] = c.g * bright;
    colors[i * 3 + 2] = c.b * bright;

    sizes[i] = 0.8 + Math.random() * 1.8;
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

const SCATTER_PALETTE = ["#ffffff", "#dbe7ff", "#ffe9cf", "#cfe0ff", "#ffd9d2"];

function buildScatter(count: number, radius: number): StarData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  const c = new THREE.Color();

  for (let i = 0; i < count; i++) {
    // Uniform on a sphere shell, with some radial depth.
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

    // A few bright hero stars, mostly small ones.
    sizes[i] = Math.random() < 0.08 ? 3 + Math.random() * 4 : 1 + Math.random() * 1.6;
    phases[i] = Math.random() * Math.PI * 2;
  }
  return { positions, colors, sizes, phases };
}

function ShaderStars({
  data,
  uScale,
  spin = 0,
}: {
  data: StarData;
  uScale: number;
  spin?: number;
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

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (spin && ref.current) ref.current.rotation.y += dt * spin;
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

/* ------------------------------------------------------------------ */
/* Soft rounded nebula                                                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* Distant galaxies                                                    */
/* ------------------------------------------------------------------ */

function DistantGalaxy({
  texture,
  position,
  size,
  color,
  spin,
  tilt = 0,
  opacity = 0.8,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  size: number;
  color: string;
  spin: number;
  tilt?: number;
  opacity?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * spin;
  });
  return (
    <mesh ref={ref} position={position} rotation={[tilt, 0, Math.random() * Math.PI]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={ADD}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* Streaks: meteors + comets                                           */
/* ------------------------------------------------------------------ */

const X_AXIS = new THREE.Vector3(1, 0, 0);

function Streak({
  length,
  width,
  headSize,
  color,
  speed,
  minDelay,
  maxDelay,
  spawn,
}: {
  length: number;
  width: number;
  headSize: number;
  color: string;
  speed: number;
  minDelay: number;
  maxDelay: number;
  spawn: () => { start: THREE.Vector3; dir: THREE.Vector3; distance: number };
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const tailTex = useMemo(() => cometTailSprite(), []);

  const state = useRef({
    active: false,
    nextAt: 1 + Math.random() * maxDelay,
    start: new THREE.Vector3(),
    dir: new THREE.Vector3(1, 0, 0),
    travelled: 0,
    distance: 0,
  });

  useFrame((s, dt) => {
    const st = state.current;
    const time = s.clock.elapsedTime;
    const g = groupRef.current;
    if (!g) return;

    if (!st.active) {
      g.visible = false;
      if (time >= st.nextAt) {
        const cfg = spawn();
        st.start.copy(cfg.start);
        st.dir.copy(cfg.dir).normalize();
        st.distance = cfg.distance;
        st.travelled = 0;
        st.active = true;
        g.position.copy(st.start);
        if (tailRef.current) {
          tailRef.current.quaternion.setFromUnitVectors(X_AXIS, st.dir);
        }
      }
      return;
    }

    g.visible = true;
    st.travelled += speed * dt * 60;
    g.position.addScaledVector(st.dir, speed * dt * 60);
    const p = st.travelled / st.distance;
    // Fade in then out across the flight.
    const fade = Math.sin(Math.min(1, Math.max(0, p)) * Math.PI);
    g.scale.setScalar(0.6 + fade * 0.6);
    if (p >= 1) {
      st.active = false;
      st.nextAt = time + minDelay + Math.random() * (maxDelay - minDelay);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <group ref={tailRef}>
        <mesh position={[-length / 2, 0, 0]}>
          <planeGeometry args={[length, width]} />
          <meshBasicMaterial
            map={tailTex}
            color={color}
            transparent
            depthWrite={false}
            blending={ADD}
            toneMapped={false}
          />
        </mesh>
      </group>
      <sprite scale={[headSize, headSize, 1]}>
        <spriteMaterial
          map={glowSprite()}
          color={color}
          transparent
          depthWrite={false}
          blending={ADD}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

function meteorSpawn() {
  const startX = (Math.random() - 0.5) * 110;
  const startY = 20 + Math.random() * 30;
  const startZ = -35 - Math.random() * 35;
  const start = new THREE.Vector3(startX, startY, startZ);
  const dir = new THREE.Vector3(
    (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.5),
    -1,
    -(Math.random() * 0.3)
  );
  return { start, dir, distance: 60 + Math.random() * 30 };
}

function cometSpawn() {
  const side = Math.random() > 0.5 ? 1 : -1;
  const start = new THREE.Vector3(side * (70 + Math.random() * 20), 10 + Math.random() * 20, -55 - Math.random() * 20);
  const dir = new THREE.Vector3(-side * (0.9 + Math.random() * 0.2), -0.25 - Math.random() * 0.2, 0.15);
  return { start, dir, distance: 150 + Math.random() * 40 };
}

/* ------------------------------------------------------------------ */
/* Supernova flare + shockwave                                         */
/* ------------------------------------------------------------------ */

function Supernova({ minDelay, maxDelay }: { minDelay: number; maxDelay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const flareRef = useRef<THREE.Sprite>(null);
  const flareMat = useRef<THREE.SpriteMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);

  const st = useRef({ active: false, nextAt: 4 + Math.random() * maxDelay, t: 0 });

  useFrame((s, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const time = s.clock.elapsedTime;

    if (!st.current.active) {
      g.visible = false;
      if (time >= st.current.nextAt) {
        g.position.set(
          (Math.random() - 0.5) * 90,
          (Math.random() - 0.5) * 50,
          -45 - Math.random() * 40
        );
        g.quaternion.copy(s.camera.quaternion);
        st.current.active = true;
        st.current.t = 0;
      }
      return;
    }

    g.visible = true;
    g.quaternion.copy(s.camera.quaternion);
    st.current.t += dt;
    const T = 1.8;
    const p = Math.min(1, st.current.t / T);
    // Fast spike up, slow decay.
    const flare = p < 0.12 ? p / 0.12 : Math.pow(1 - (p - 0.12) / 0.88, 1.6);
    const fs = 3 + flare * 14;
    if (flareRef.current) flareRef.current.scale.setScalar(fs);
    if (flareMat.current) flareMat.current.opacity = Math.max(0, flare);

    const ringScale = 1 + p * 20;
    if (ringRef.current) ringRef.current.scale.setScalar(ringScale);
    if (ringMat.current) ringMat.current.opacity = Math.max(0, (1 - p) * 0.5);

    if (p >= 1) {
      st.current.active = false;
      st.current.nextAt = time + minDelay + Math.random() * (maxDelay - minDelay);
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <sprite ref={flareRef} scale={3}>
        <spriteMaterial
          ref={flareMat}
          map={glowSprite()}
          color="#dfeaff"
          transparent
          opacity={0}
          depthWrite={false}
          blending={ADD}
          toneMapped={false}
        />
      </sprite>
      <mesh ref={ringRef}>
        <ringGeometry args={[0.85, 1, 64]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#bcd6ff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={ADD}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Distant planet / moon                                               */
/* ------------------------------------------------------------------ */

function DistantPlanet({ quality }: { quality: Quality }) {
  const ref = useRef<THREE.Mesh>(null);
  const seg = quality === "ultra" ? 48 : 24;
  useFrame((s, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.04;
      ref.current.position.x = -60 + Math.sin(s.clock.elapsedTime * 0.02) * 4;
    }
  });
  return (
    <group position={[-60, 22, -95]}>
      {/* atmosphere rim */}
      <mesh scale={1.12}>
        <sphereGeometry args={[7, seg, seg]} />
        <meshBasicMaterial color="#5b8bd0" transparent opacity={0.12} side={THREE.BackSide} blending={ADD} depthWrite={false} />
      </mesh>
      <mesh ref={ref}>
        <sphereGeometry args={[7, seg, seg]} />
        <meshStandardMaterial color="#3a5a86" emissive="#16243f" emissiveIntensity={0.5} roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

export function GalaxyScene({ quality = "ultra" }: { quality?: Quality }) {
  const backdropRef = useRef<THREE.Group>(null);
  const ultra = quality === "ultra";

  const diskData = useMemo(() => buildDisk(ultra ? 7000 : 3500), [ultra]);
  const scatterData = useMemo(() => buildScatter(ultra ? 2600 : 1300, 150), [ultra]);

  const spiralTex = useMemo(() => spiralGalaxySprite(), []);
  const ellipticalTex = useMemo(() => ellipticalGalaxySprite(), []);

  useFrame((state) => {
    if (backdropRef.current) {
      const px = state.pointer.x * 0.04;
      const py = state.pointer.y * 0.03;
      backdropRef.current.rotation.y = THREE.MathUtils.lerp(backdropRef.current.rotation.y, px, 0.04);
      backdropRef.current.rotation.x = THREE.MathUtils.lerp(backdropRef.current.rotation.x, -py, 0.04);
    }
  });

  const nebulaCount = ultra ? 220 : 110;

  return (
    <group ref={backdropRef}>
      {/* Faint far pinpoint base layer. */}
      <Stars radius={150} depth={70} count={ultra ? 4000 : 2000} factor={3} saturation={0.5} fade speed={0.5} />

      {/* Scattered round, twinkling, colored stars all around. */}
      <ShaderStars data={scatterData} uScale={ultra ? 230 : 200} />

      {/* Tilted galactic disk band far behind the system. */}
      <group position={[0, -8, -52]} rotation={[0.95, 0, 0.18]}>
        <ShaderStars data={diskData} uScale={ultra ? 230 : 200} spin={0.012} />
      </group>

      {/* Soft rounded nebulae. */}
      <NebulaCloud color="#1aa7d8" position={[-32, 8, -42]} spread={16} count={nebulaCount} />
      <NebulaCloud color="#7c3aed" position={[34, -10, -46]} spread={18} count={nebulaCount} />

      {/* Distant galaxies. */}
      <DistantGalaxy texture={spiralTex} position={[58, 26, -100]} size={48} color="#cdbfff" spin={0.02} tilt={0.5} opacity={0.85} />
      {ultra && (
        <>
          <DistantGalaxy texture={spiralTex} position={[-70, -30, -110]} size={40} color="#bfe4ff" spin={-0.015} tilt={-0.7} opacity={0.7} />
          <DistantGalaxy texture={ellipticalTex} position={[20, 40, -120]} size={34} color="#ffe7c9" spin={0.008} tilt={0.2} opacity={0.6} />
        </>
      )}

      {/* Distant drifting planet. */}
      <DistantPlanet quality={quality} />

      {/* Common space events. */}
      <Streak length={9} width={0.5} headSize={1.6} color="#dcebff" speed={0.85} minDelay={2} maxDelay={7} spawn={meteorSpawn} />
      <Streak length={7} width={0.4} headSize={1.3} color="#cfe6ff" speed={1.05} minDelay={3} maxDelay={9} spawn={meteorSpawn} />
      {ultra && (
        <Streak length={6} width={0.35} headSize={1.1} color="#ffe0d6" speed={0.7} minDelay={4} maxDelay={11} spawn={meteorSpawn} />
      )}

      {/* Comet with a long glowing tail. */}
      <Streak length={26} width={1.6} headSize={3.4} color="#bfe0ff" speed={0.32} minDelay={14} maxDelay={28} spawn={cometSpawn} />

      {/* Supernova flares. */}
      <Supernova minDelay={ultra ? 16 : 26} maxDelay={ultra ? 34 : 50} />
    </group>
  );
}
