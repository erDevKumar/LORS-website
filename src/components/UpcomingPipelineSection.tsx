import { upcomingProjects } from "../content";
import { ProjectHologramCard } from "./ProjectHologramCard";
import { SectionHeader } from "./SectionHeader";

export function UpcomingPipelineSection() {
  return (
    <section
      id="pipeline"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="pipeline-heading"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Pipeline"
          title="Upcoming utilities"
          subtitle="Holographic previews of what we're shaping next — trip tools, document management, dual-camera recording, and more experiments from Nexus Lab."
          titleId="pipeline-heading"
        />
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {upcomingProjects.map((project) => (
            <ProjectHologramCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
