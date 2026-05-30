import type { Project } from "../content";
import { statusLabels } from "../content";

type ProductDetailPanelProps = {
  project: Project;
  compact?: boolean;
  titleId?: string;
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

export function ProductDetailPanel({ project, compact = false, titleId }: ProductDetailPanelProps) {
  const badgeLabel = project.statusLabel ?? statusLabels[project.status];

  return (
    <div className={`flex flex-col ${compact ? "gap-3" : "gap-5"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3
          id={titleId}
          className={`font-display font-bold text-white ${
            compact ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {project.name}
        </h3>
        <span className={`status-badge shrink-0 ${statusClass(project.status)}`}>
          {badgeLabel}
        </span>
      </div>

      {project.platforms && (
        <p className={`text-white/60 ${compact ? "text-xs" : "text-sm"}`}>
          <span className="font-medium text-white/75">Target platforms:</span>{" "}
          {project.platforms}
        </p>
      )}

      {(project.pitch || project.description) && (
        <p
          className={`leading-relaxed text-white/75 ${
            compact ? "text-xs leading-snug" : "text-sm sm:text-base"
          }`}
        >
          {project.pitch ?? project.description}
        </p>
      )}

      {project.features && project.features.length > 0 && (
        <div>
          <h4
            className={`font-display font-semibold text-lors-glow ${
              compact ? "mb-2 text-sm" : "mb-3 text-base"
            }`}
          >
            Core high-utility features
          </h4>
          <ul className={`space-y-2 ${compact ? "space-y-1.5" : "space-y-3"}`}>
            {project.features.map((feature) => (
              <li
                key={feature.title}
                className={`rounded-lg border border-white/10 bg-lors-deep/50 ${
                  compact ? "p-2.5" : "p-3.5"
                }`}
              >
                <p
                  className={`font-medium text-white ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  {feature.title}
                </p>
                <p
                  className={`mt-1 leading-relaxed text-white/65 ${
                    compact ? "text-[11px] leading-snug" : "text-xs sm:text-sm"
                  }`}
                >
                  {feature.body}
                </p>
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
          className={`inline-flex w-fit font-medium text-lors-glow hover:underline ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          Learn more →
        </a>
      )}
    </div>
  );
}
