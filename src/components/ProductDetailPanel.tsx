import type { Project } from "../content";
import { statusLabels } from "../content";

type ProductDetailPanelProps = {
  project: Project;
  compact?: boolean;
  titleId?: string;
};

function statusCls(status: Project["status"]): string {
  switch (status) {
    case "live":          return "status-live";
    case "beta":          return "status-beta";
    case "coming-soon":   return "status-coming-soon";
    default:              return "status-concept";
  }
}

export function ProductDetailPanel({ project, compact = false, titleId }: ProductDetailPanelProps) {
  const fullLabel  = project.statusLabel ?? statusLabels[project.status];
  const badgeLabel = fullLabel.length > 20 ? statusLabels[project.status] : fullLabel;

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-5"}`}>
      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3
          id={titleId}
          className={`font-display font-bold text-white leading-tight ${
            compact ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {project.name}
        </h3>
        <span className={`status-badge shrink-0 ${statusCls(project.status)}`}>
          {badgeLabel}
        </span>
      </div>

      {project.platforms && (
        <p className={`text-white/50 ${compact ? "text-[10px]" : "text-xs"}`}>
          {project.platforms}
        </p>
      )}

      {(project.pitch ?? project.description) && (
        <p
          className={`leading-relaxed text-white/70 ${
            compact ? "text-xs leading-snug" : "text-sm sm:text-base"
          }`}
        >
          {project.pitch ?? project.description}
        </p>
      )}

      {project.features && project.features.length > 0 && (
        <div>
          <p
            className={`panel-eyebrow mb-2 ${
              compact ? "" : "text-xs"
            }`}
          >
            Core features
          </p>
          <ul
            className={`grid gap-2 ${
              compact ? "grid-cols-1" : "sm:grid-cols-2"
            }`}
          >
            {project.features.map((f) => (
              <li
                key={f.title}
                className={`nexus-card flex items-start gap-2.5 ${
                  compact ? "p-2.5" : "p-3"
                }`}
              >
                <span
                  className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: "var(--pa, #7eb8ff)" }}
                />
                <div>
                  <p
                    className={`font-display font-semibold text-white leading-tight ${
                      compact ? "text-[11px]" : "text-xs sm:text-sm"
                    }`}
                  >
                    {f.title}
                  </p>
                  <p
                    className={`mt-1 leading-snug text-white/55 ${
                      compact ? "text-[10px]" : "text-xs"
                    }`}
                  >
                    {f.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-fit font-semibold panel-accent hover:opacity-75 transition-opacity ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          Open {project.name} →
        </a>
      )}
    </div>
  );
}
