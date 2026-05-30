import { CareersPanel } from "./CareersPanel";
import { SectionHeader } from "./SectionHeader";

export function CareersSection() {
  return (
    <section
      id="careers"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="careers-heading"
    >
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Careers"
          title="Join the Nexus"
          subtitle="Why build with us?"
          titleId="careers-heading"
        />
        <div className="mt-10">
          <CareersPanel />
        </div>
      </div>
    </section>
  );
}
