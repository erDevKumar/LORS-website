import { featuredProjects } from "../content";
import { ProjectHologramCard } from "./ProjectHologramCard";

export function FeaturedProjectsSection() {
  return (
    <section
      id="projects"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="projects-heading"
    >
      <div className="pointer-events-none absolute inset-0 hero-bg-gradient opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          Flagship products
        </p>
        <h2 id="products-heading" className="section-heading mt-2">
          Highlighted projects
        </h2>
        <p className="section-sub">
          Our most visible utilities — built for everyday impact and engineered to grow with your
          life.
        </p>
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {featuredProjects.map((project) => (
            <ProjectHologramCard key={project.id} project={project} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
