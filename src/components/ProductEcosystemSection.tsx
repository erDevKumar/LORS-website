import { siteContent } from "../content";
import { PortfolioEcosystemPanel } from "./PortfolioEcosystemPanel";
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
        <div className="mt-10">
          <PortfolioEcosystemPanel />
        </div>
      </div>
    </section>
  );
}
