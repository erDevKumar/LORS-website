import { upcomingProjects } from "../content";
import { ProjectHologramCard } from "./ProjectHologramCard";

export function UpcomingPipelineSection() {
  return (
    <section
      id="pipeline"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="pipeline-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          Pipeline
        </p>
        <h2 id="pipeline-heading" className="section-heading mt-2">
          Upcoming utilities
        </h2>
        <p className="section-sub">
          Holographic previews of what we&apos;re shaping next — trip tools, document management,
          dual-camera recording, and more experiments from Nexus Lab.
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {upcomingProjects.map((project) => (
            <ProjectHologramCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
