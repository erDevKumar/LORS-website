import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useStore } from "../../store/useStore";
import { HologramCardUI } from "../../components/HologramCardUI";

const panels = [
  { id: "hero", label: "LORS Nexus", title: "Elevating Everyday Experiences", description: "Utility apps and IT solutions for everyday life — from trips and documents to the connected experiences families rely on." },
  { id: "mission", label: "Our Mission", title: "Technology for real life", description: "We build practical mobile utilities and dependable technology platforms that solve real problems in daily life." },
  { id: "ecosystem", label: "Ecosystem", title: "One nexus, many products", description: "A growing portfolio of apps and ventures. Products ship under their own identity; future child companies can emerge from the nexus as they mature." },
  { id: "projects", label: "Flagship Products", title: "Family OS & RouteMates", description: "Our most visible utilities — built for everyday impact and engineered to grow with your life." },
  { id: "it", label: "IT Solutions", title: "Built by engineers, delivered with care", description: "LORS Nexus pairs product craft with professional IT delivery — from mobile clients and cloud APIs to security, DevOps, and consulting partnerships." },
  { id: "pipeline", label: "Pipeline", title: "Upcoming utilities", description: "Holographic previews of what we're shaping next — trip tools, document management, dual-camera recording, and more experiments from Nexus Lab." },
  { id: "contact", label: "Contact", title: "Let's build what's next", description: "Partnerships, product inquiries, or IT consulting — reach out and we'll connect you with the right team at LORS Nexus." },
];

export function HologramHelix() {
  const activeAct = useStore((state) => state.activeAct);
  
  const groupRefs = useRef<(THREE.Group | null)[]>([]);
  const htmlRefs = useRef<(HTMLDivElement | null)[]>([]);
  const animatedIndex = useRef(0);

  const radius = 10; 
  const spacingY = 18; // Increased from 5
  const anglePerCard = Math.PI / 4; 

  useFrame(() => {
    // Fling instantly to the exact integer slot when the section crosses the threshold!
    const targetIndex = activeAct;
    
    // Fling effect using lerp
    animatedIndex.current = THREE.MathUtils.lerp(
      animatedIndex.current,
      targetIndex,
      0.08
    );

    groupRefs.current.forEach((group, index) => {
      if (!group) return;
      
      const d = index - animatedIndex.current;
      const absD = Math.abs(d);
      
      // Helix Math
      const y = -d * spacingY;
      const angle = d * anglePerCard;
      const x = Math.sin(angle) * radius;
      // Aggressively push back inactive cards so the massive front card fits
      const z = Math.cos(angle) * radius - radius - (absD * 20);
      
      group.position.set(x, y, z);
      
      // Keep cards always facing forward
      group.rotation.set(0, 0, 0);

      // Direct DOM mutation for opacity to avoid React re-renders in useFrame
      if (htmlRefs.current[index]) {
        const opacity = Math.max(0.1, 1 - absD * 0.6);
        htmlRefs.current[index]!.style.opacity = opacity.toString();
        
        // Disable pointer events if not the active card
        htmlRefs.current[index]!.style.pointerEvents = absD < 0.5 ? 'auto' : 'none';
      }
    });
  });

  return (
    <group position={[0, 0, -2]}>
      {panels.map((panel, index) => (
        <group 
          key={panel.id} 
          ref={(el) => { groupRefs.current[index] = el; }}
        >
          <Html
            transform
            className="hologram-panel-container"
            scale={0.405}
            style={{
              width: "800px",
              height: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.1s ease-out"
            }}
          >
            <div 
              ref={(el) => { htmlRefs.current[index] = el; }}
              className="hologram-glass-wrapper w-full h-full overflow-hidden rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,221,255,0.2)] flex"
            >
               <HologramCardUI panel={panel} />
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
