import { engineeringCulture } from "../content";

type EngineeringPrinciplesGridProps = { compact?: boolean };

export function EngineeringPrinciplesGrid({ compact = false }: EngineeringPrinciplesGridProps) {
  return (
    <ul
      className={`grid w-full min-w-0 gap-3 ${
        compact ? "mt-3 grid-cols-1" : "mt-8 sm:grid-cols-3"
      }`}
    >
      {engineeringCulture.principles.map((p) => (
        <li
          key={p.title}
          className={`nexus-card--accent ${compact ? "p-3" : "p-5"}`}
        >
          <h3
            className={`font-display font-bold text-lors-glow leading-tight ${
              compact ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            {p.title}
          </h3>
          <p
            className={`mt-2 leading-relaxed text-white/60 ${
              compact ? "text-[10px] leading-snug" : "text-xs sm:text-sm"
            }`}
          >
            {p.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
