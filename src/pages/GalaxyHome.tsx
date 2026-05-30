import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStore } from "../store/useStore";
import { WebGLFallbackBoundary } from "../components/WebGLFallbackBoundary";
import { CanvasRoot } from "../experience/CanvasRoot";
import { ScrollSpy } from "../components/ScrollSpy";
import { GalaxyScrollNav } from "../components/GalaxyScrollNav";
import { SiteNav } from "../components/SiteNav";
import { Hero } from "../components/Hero";
import { ProductEcosystemSection } from "../components/ProductEcosystemSection";
import { RouteMatesSection } from "../components/RouteMatesSection";
import { FamilyOSSection } from "../components/FamilyOSSection";
import { TechStackSection } from "../components/TechStackSection";
import { CareersSection } from "../components/CareersSection";
import { ContactSection } from "../components/ContactSection";
import { GalaxyAudio } from "../components/GalaxyAudio";

const HASH_TO_ACT: Record<string, number> = {
  hero: 0,
  ecosystem: 1,
  routemates: 2,
  familyos: 3,
  tech: 4,
  careers: 5,
  contact: 6,
};

export function GalaxyHome() {
  const qualityTier = useStore((state) => state.qualityTier);
  const location = useLocation();

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (qualityTier !== "fallback") {
      htmlEl.classList.add("is-webgl");
      htmlEl.classList.remove("is-fallback");
    } else {
      htmlEl.classList.add("is-fallback");
      htmlEl.classList.remove("is-webgl");
    }

    return () => {
      htmlEl.classList.remove("is-webgl", "is-fallback");
    };
  }, [qualityTier]);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const act = HASH_TO_ACT[hash];
    if (act === undefined) return;

    const vh = window.innerHeight || 1;
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: act * vh, behavior: "auto" });
    });
  }, [location.hash]);

  return (
    <div className="relative flex flex-col">
      <GalaxyAudio />
      <ScrollSpy />
      <GalaxyScrollNav />
      <WebGLFallbackBoundary>
        <CanvasRoot />
      </WebGLFallbackBoundary>
      <SiteNav />
      <main className="scroll-driver relative z-10">
        <Hero />
        <ProductEcosystemSection />
        <RouteMatesSection />
        <FamilyOSSection />
        <TechStackSection />
        <CareersSection />
        <ContactSection />
      </main>
    </div>
  );
}
