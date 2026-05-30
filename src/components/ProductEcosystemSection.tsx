import { siteContent } from "../content";
import { SectionHeader } from "./SectionHeader";

export function ProductEcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="ecosystem-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Our product ecosystem"
          title="Portfolio"
          subtitle={siteContent.ecosystemIntro}
          titleId="ecosystem-heading"
        />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/65">
          Our flagship products are built completely in-house — scroll to explore
          RouteMates and FamilyOS in detail.
        </p>
      </div>
    </section>
  );
}
