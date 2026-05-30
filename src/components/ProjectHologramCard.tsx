import { useRef } from "react";
import type { Project } from "../content";
import { statusLabels } from "../content";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ProjectIcon } from "./ProjectIcon";

type ProjectHologramCardProps = {
  project: Project;
  featured?: boolean;
};

function statusClass(status: Project["status"]): string {
  switch (status) {
    case "live":
      return "status-live";
    case "beta":
      return "status-beta";
    case "coming-soon":
      return "status-coming-soon";
    default:
      return "status-concept";
  }
}

export function ProjectHologramCard({ project, featured = false }: ProjectHologramCardProps) {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLDivElement>();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const tiltX = -y * 12; // tilt max 12 degrees
    const tiltY = x * 12;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(12px)`;
    card.style.transition = "transform 0.1s ease-out";
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = "";
    card.style.transition = "transform 0.5s ease-out";
  };

  const inner = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`hologram-card ${featured ? "hologram-card--featured" : ""} ${isVisible ? "is-visible" : ""}`}
    >
      <div className={`hologram-frame ${featured ? "hologram-frame--featured" : ""}`}>
        <div className="hologram-inner">
          <div className="hologram-scanlines" aria-hidden />
          <div className="hologram-shimmer" aria-hidden />
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-lors-glow/30 bg-lors-accent/10 text-lors-glow">
                  <ProjectIcon category={project.category} />
                </div>
                <div>
                  {featured && (
                    <span className="flagship-badge mb-2">Flagship</span>
                  )}
                  <h3
                    className={`font-display font-bold text-white ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}
                  >
                    {project.name}
                  </h3>
                  <p className="text-sm font-medium text-lors-glow/90">{project.tagline}</p>
                </div>
              </div>
              <span className={`status-badge shrink-0 ${statusClass(project.status)}`}>
                {statusLabels[project.status]}
              </span>
            </div>
            <p
              className={`leading-relaxed text-white/70 ${featured ? "text-base sm:text-lg" : "text-sm"}`}
            >
              {project.description}
            </p>
            {project.href && (
              <span className="text-sm font-medium text-lors-glow hover:underline">
                Learn more →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={revealRef} className="hologram-stage w-full">
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block outline-none focus-visible:ring-2 focus-visible:ring-lors-glow focus-visible:ring-offset-2 focus-visible:ring-offset-lors-navy rounded-2xl"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
