import { ecosystemContent, featuredProjects } from "../content";
import { PortfolioProductCard } from "./PortfolioProductCard";

type PortfolioEcosystemPanelProps = {
  compact?: boolean;
};

export function PortfolioEcosystemPanel({ compact = false }: PortfolioEcosystemPanelProps) {
  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-8"}`}>
      <div>
        <h4
          className={`font-display font-semibold text-lors-glow ${
            compact ? "mb-2 text-sm" : "mb-3 text-base"
          }`}
        >
          Flagship products
        </h4>
        <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
          {featuredProjects.map((project) => (
            <PortfolioProductCard key={project.id} project={project} compact={compact} />
          ))}
        </ul>
      </div>

      {ecosystemContent.highlights.length > 0 && (
        <div>
          <h4
            className={`font-display font-semibold text-lors-glow ${
              compact ? "mb-2 text-sm" : "mb-3 text-base"
            }`}
          >
            How we build
          </h4>
          <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
            {ecosystemContent.highlights.map((item) => (
              <li
                key={item.title}
                className={`rounded-xl border border-white/10 bg-lors-deep/50 ${
                  compact ? "p-3" : "p-4"
                }`}
              >
                <h5
                  className={`font-display font-semibold text-white ${
                    compact ? "text-xs" : "text-sm"
                  }`}
                >
                  {item.title}
                </h5>
                <p
                  className={`mt-1.5 leading-relaxed text-white/65 ${
                    compact ? "text-[11px] leading-snug" : "text-xs"
                  }`}
                >
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
