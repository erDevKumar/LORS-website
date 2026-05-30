import { ITCapabilityGrid } from "./ITCapabilityGrid";
import { SectionHeader } from "./SectionHeader";

export function ITSolutionsSection() {
  return (
    <section
      id="it"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="it-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lors-indigo/20 via-transparent to-transparent"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="IT solutions"
          title="Built by engineers, delivered with care"
          subtitle="LORS Nexus pairs product craft with professional IT delivery — from mobile clients and cloud APIs to security, DevOps, and consulting partnerships."
          titleId="it-heading"
        />
        <ITCapabilityGrid />
      </div>
    </section>
  );
}
