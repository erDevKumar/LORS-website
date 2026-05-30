import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { WebGLFallbackBoundary } from "./components/WebGLFallbackBoundary";
import { CanvasRoot } from "./experience/CanvasRoot";
import { ScrollSpy } from "./components/ScrollSpy";
import { GalaxyScrollNav } from "./components/GalaxyScrollNav";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { Hero } from "./components/Hero";
import { ProductEcosystemSection } from "./components/ProductEcosystemSection";
import { RouteMatesSection } from "./components/RouteMatesSection";
import { FamilyOSSection } from "./components/FamilyOSSection";
import { TechStackSection } from "./components/TechStackSection";
import { CareersSection } from "./components/CareersSection";
import { ContactSection } from "./components/ContactSection";
import { GalaxyAudio } from "./components/GalaxyAudio";

export default function App() {
  const qualityTier = useStore((state) => state.qualityTier);

  useEffect(() => {
    const htmlEl = document.documentElement;
    if (qualityTier !== "fallback") {
      htmlEl.classList.add("is-webgl");
      htmlEl.classList.remove("is-fallback");
    } else {
      htmlEl.classList.add("is-fallback");
      htmlEl.classList.remove("is-webgl");
    }
  }, [qualityTier]);

  return (
    <div className="flex flex-col relative">
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
      <div className="w-full relative z-20 pointer-events-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
