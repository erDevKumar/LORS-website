import type { Project } from "../content";
import { statusLabels } from "../content";
import { ProjectIcon } from "./ProjectIcon";

type PortfolioProductCardProps = {
  project: Project;
  compact?: boolean;
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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function PortfolioProductCard({ project, compact = false }: PortfolioProductCardProps) {
  const badgeLabel = project.statusLabel ?? statusLabels[project.status];
  const summary = truncate(project.pitch ?? project.description, compact ? 110 : 160);
  const featureCount = project.features?.length ?? 0;

  return (
    <li
      className={`rounded-xl border border-white/10 bg-lors-deep/60 backdrop-blur-sm transition hover:border-lors-accent/40 ${
        compact ? "p-3" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl border border-lors-glow/30 bg-lors-accent/10 text-lors-glow ${
            compact ? "h-9 w-9" : "h-12 w-12"
          }`}
        >
          <ProjectIcon category={project.category} compact={compact} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`font-display font-bold text-white ${
                compact ? "text-sm" : "text-lg"
              }`}
            >
              {project.name}
            </h3>
            <span
              className={`status-badge shrink min-w-0 ${statusClass(project.status)} ${
                compact ? "!px-2 !py-0.5 !text-[10px]" : ""
              }`}
            >
              {badgeLabel}
            </span>
          </div>
          {project.platforms && (
            <p className={`mt-1 text-white/55 ${compact ? "text-[10px]" : "text-xs"}`}>
              {project.platforms}
            </p>
          )}
        </div>
      </div>
      <p
        className={`mt-2 leading-relaxed text-white/70 ${
          compact ? "text-[11px] leading-snug" : "text-sm"
        }`}
      >
        {summary}
      </p>
      {featureCount > 0 && (
        <p className={`mt-2 text-lors-glow/80 ${compact ? "text-[10px]" : "text-xs"}`}>
          {featureCount} core features · scroll to explore
        </p>
      )}
    </li>
  );
}
