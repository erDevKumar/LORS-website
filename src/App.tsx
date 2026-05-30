import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { WebGLFallbackBoundary } from "./components/WebGLFallbackBoundary";
import { CanvasRoot } from "./experience/CanvasRoot";
import { ScrollSpy } from "./components/ScrollSpy";
import { SiteFooter } from "./components/SiteFooter";
import { SiteNav } from "./components/SiteNav";
import { Hero } from "./components/Hero";
import { MissionSection } from "./components/MissionSection";
import { ITSolutionsSection } from "./components/ITSolutionsSection";
import { EcosystemSection } from "./components/EcosystemSection";
import { FeaturedProjectsSection } from "./components/FeaturedProjectsSection";
import { UpcomingPipelineSection } from "./components/UpcomingPipelineSection";
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
      <WebGLFallbackBoundary>
        <CanvasRoot />
      </WebGLFallbackBoundary>
      <SiteNav />
      {/* 
        The main content sections act as the scroll driver in WebGL mode,
        providing natural height and anchor link targets.
        They are visually hidden via CSS when WebGL is active.
        In fallback mode, they are fully visible.
      */}
      <main className="scroll-driver relative z-10">
        <Hero />
        <MissionSection />
        <ITSolutionsSection />
        <EcosystemSection />
        <FeaturedProjectsSection />
        <UpcomingPipelineSection />
        <ContactSection />
      </main>
      <div className="w-full relative z-20 pointer-events-auto">
        <SiteFooter />
      </div>
    </div>
  );
}
