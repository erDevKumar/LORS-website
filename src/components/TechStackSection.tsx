import { engineeringCulture, techStack } from "../content";
import { EngineeringPrinciplesGrid } from "./EngineeringPrinciplesGrid";
import { SectionHeader } from "./SectionHeader";
import { TechStackTable } from "./TechStackTable";

export function TechStackSection() {
  return (
    <section
      id="tech"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="tech-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Tech stack"
          title={techStack.title}
          subtitle={techStack.subtitle}
          titleId="tech-heading"
        />
        <TechStackTable />
        <SectionHeader
          className="mt-16"
          eyebrow="Engineering culture"
          title={engineeringCulture.title}
        />
        <EngineeringPrinciplesGrid />
      </div>
    </section>
  );
}
