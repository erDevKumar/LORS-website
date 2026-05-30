import { featuredProjects } from "../content";
import { ProjectHologramCard } from "./ProjectHologramCard";
import { SectionHeader } from "./SectionHeader";

export function FeaturedProjectsSection() {
  return (
    <section
      id="products"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="products-heading"
    >
      <div className="pointer-events-none absolute inset-0 hero-bg-gradient opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Flagship products"
          title="Highlighted projects"
          subtitle="Our most visible utilities — built for everyday impact and engineered to grow with your life."
          titleId="products-heading"
        />
        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {featuredProjects.map((project) => (
            <ProjectHologramCard key={project.id} project={project} featured />
          ))}
        </div>
      </div>
    </section>
  );
}
