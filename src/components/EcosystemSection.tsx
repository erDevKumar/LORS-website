import { siteContent } from "../content";
import { EcosystemDiagram } from "./EcosystemDiagram";
import { SectionHeader } from "./SectionHeader";

export function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="ecosystem-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Ecosystem"
          title="One nexus, many products"
          subtitle={siteContent.ecosystemIntro}
          titleId="ecosystem-heading"
        />
        <EcosystemDiagram />
      </div>
    </section>
  );
}
