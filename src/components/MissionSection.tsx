import { siteContent } from "../content";
import { MissionPillarGrid } from "./MissionPillarGrid";
import { SectionHeader } from "./SectionHeader";

export function MissionSection() {
  return (
    <section
      id="mission"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="mission-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Our mission"
          title="Technology for real life"
          subtitle={siteContent.about}
          titleId="mission-heading"
        />
        <MissionPillarGrid />
      </div>
    </section>
  );
}
