import type { Project } from "../content";
import { statusLabels } from "../content";
import { ProjectIcon } from "./ProjectIcon";

type PortfolioProductCardProps = {
  project: Project;
  compact?: boolean;
};

function statusCls(status: Project["status"]): string {
  switch (status) {
    case "live":          return "status-live";
    case "beta":          return "status-beta";
    case "coming-soon":   return "status-coming-soon";
    default:              return "status-concept";
  }
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max).trimEnd()}…`;
}

export function PortfolioProductCard({ project, compact = false }: PortfolioProductCardProps) {
  const fullLabel  = project.statusLabel ?? statusLabels[project.status];
  const badgeLabel = fullLabel.length > 20 ? statusLabels[project.status] : fullLabel;
  const summary    = truncate(project.pitch ?? project.description, compact ? 110 : 160);
  const featureCount = project.features?.length ?? 0;

  return (
    <li
      className={`nexus-card group cursor-default ${compact ? "p-3" : "p-4 sm:p-5"}`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex flex-shrink-0 items-center justify-center rounded-xl border border-lors-glow/20 bg-lors-glow/8 text-lors-glow ${
            compact ? "h-9 w-9" : "h-11 w-11"
          }`}
        >
          <ProjectIcon category={project.category} compact={compact} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3
              className={`font-display font-bold text-white leading-tight ${
                compact ? "text-sm" : "text-base sm:text-lg"
              }`}
            >
              {project.name}
            </h3>
            <span className={`status-badge shrink-0 ${statusCls(project.status)}`}>
              {badgeLabel}
            </span>
          </div>
          {project.platforms && (
            <p className={`mt-0.5 text-white/45 ${compact ? "text-[10px]" : "text-xs"}`}>
              {project.platforms}
            </p>
          )}
        </div>
      </div>

      <p
        className={`mt-2 leading-relaxed text-white/65 ${
          compact ? "text-[11px] leading-snug" : "text-sm"
        }`}
      >
        {summary}
      </p>

      {featureCount > 0 && (
        <p className={`mt-1.5 text-lors-glow/70 ${compact ? "text-[10px]" : "text-xs"}`}>
          {featureCount} core features
        </p>
      )}
    </li>
  );
}
