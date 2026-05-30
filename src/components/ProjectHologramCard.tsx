import { useRef } from "react";
import type { Project } from "../content";
import { statusLabels } from "../content";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { ProjectIcon } from "./ProjectIcon";

type ProjectHologramCardProps = {
  project: Project;
  featured?: boolean;
  compact?: boolean;
  staticVisible?: boolean;
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

export function ProjectHologramCard({
  project,
  featured = false,
  compact = false,
  staticVisible = false,
}: ProjectHologramCardProps) {
  const { ref: revealRef, isVisible } = useScrollReveal<HTMLDivElement>();
  const cardRef = useRef<HTMLDivElement>(null);
  const visible = staticVisible || isVisible;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (compact) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const tiltX = -y * 12;
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
      className={`hologram-card ${featured ? "hologram-card--featured" : ""} ${
        compact ? "hologram-card--compact" : ""
      } ${visible ? "is-visible" : ""}`}
    >
      <div className={`hologram-frame ${featured ? "hologram-frame--featured" : ""}`}>
        <div className={`hologram-inner ${compact ? "!p-4 sm:!p-4" : "max-sm:p-4 max-sm:px-4"}`}>
          <div className="hologram-scanlines" aria-hidden />
          <div className="hologram-shimmer" aria-hidden />
          <div className={`relative z-10 flex flex-col ${compact ? "gap-3" : "gap-4"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`flex shrink-0 items-center justify-center rounded-xl border border-lors-glow/30 bg-lors-accent/10 text-lors-glow ${
                    compact ? "h-10 w-10" : "h-14 w-14 max-sm:h-12 max-sm:w-12"
                  }`}
                >
                  <ProjectIcon category={project.category} compact={compact} />
                </div>
                <div className="min-w-0 text-left">
                  {featured && (
                    <span className={`flagship-badge mb-2 block w-fit ${compact ? "!text-[10px]" : ""}`}>
                      Flagship
                    </span>
                  )}
                  <h3
                    className={`font-display font-bold text-white ${
                      featured
                        ? compact
                          ? "text-lg"
                          : "text-2xl sm:text-3xl max-sm:text-xl"
                        : compact
                          ? "text-base"
                          : "text-xl max-sm:text-lg"
                    }`}
                  >
                    {project.name}
                  </h3>
                  <p
                    className={`font-medium text-lors-glow/90 ${
                      compact ? "text-xs" : "text-sm"
                    }`}
                  >
                    {project.tagline}
                  </p>
                </div>
              </div>
              <span
                className={`status-badge shrink-0 ${statusClass(project.status)} ${
                  compact ? "!px-2 !py-0.5 !text-[10px]" : ""
                }`}
              >
                {statusLabels[project.status]}
              </span>
            </div>

            <p
              className={`text-left leading-relaxed text-white/70 ${
                compact ? "text-xs leading-snug" : featured ? "text-base sm:text-lg max-sm:text-sm" : "text-sm max-sm:text-xs"
              }`}
            >
              {project.description}
            </p>

            {project.href && (
              <span className="text-left text-sm font-medium text-lors-glow hover:underline">
                Learn more →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={revealRef} className={`hologram-stage w-full ${compact ? "hologram-stage--compact" : ""}`}>
      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-lors-glow focus-visible:ring-offset-2 focus-visible:ring-offset-lors-navy"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </div>
  );
}
