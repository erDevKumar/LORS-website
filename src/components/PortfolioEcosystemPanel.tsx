import { ecosystemContent, featuredProjects } from "../content";
import { PortfolioProductCard } from "./PortfolioProductCard";

type PortfolioEcosystemPanelProps = { compact?: boolean };

export function PortfolioEcosystemPanel({ compact = false }: PortfolioEcosystemPanelProps) {
  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-8"}`}>
      {/* Products */}
      <div>
        <p
          className={`panel-eyebrow mb-3 ${
            compact ? "text-[9px]" : "text-[10px]"
          }`}
        >
          Flagship products
        </p>
        <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          {featuredProjects.map((p) => (
            <PortfolioProductCard key={p.id} project={p} compact={compact} />
          ))}
        </ul>
      </div>

      {/* Studio DNA */}
      {ecosystemContent.highlights.length > 0 && (
        <div>
          <p
            className={`panel-eyebrow mb-3 ${
              compact ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Studio DNA
          </p>
          <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
            {ecosystemContent.highlights.map((h) => (
              <li
                key={h.title}
                className={`nexus-card ${compact ? "p-3" : "p-4"}`}
              >
                <h5
                  className={`font-display font-semibold text-white leading-tight ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  {h.title}
                </h5>
                <p
                  className={`mt-1.5 leading-relaxed text-white/60 ${
                    compact ? "text-[10px] leading-snug" : "text-xs"
                  }`}
                >
                  {h.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
