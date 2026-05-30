import { engineeringCulture } from "../content";

type EngineeringPrinciplesGridProps = {
  compact?: boolean;
};

export function EngineeringPrinciplesGrid({ compact = false }: EngineeringPrinciplesGridProps) {
  return (
    <ul
      className={`grid gap-4 sm:grid-cols-1 lg:grid-cols-3 ${
        compact ? "mt-4 gap-2" : "mt-10"
      }`}
    >
      {engineeringCulture.principles.map((principle) => (
        <li
          key={principle.title}
          className={`rounded-xl border border-white/10 bg-lors-deep/60 backdrop-blur-sm transition hover:border-lors-accent/40 ${
            compact ? "p-3" : "p-5"
          }`}
        >
          <h3
            className={`font-display font-semibold text-lors-glow ${
              compact ? "text-sm" : "text-lg"
            }`}
          >
            {principle.title}
          </h3>
          <p
            className={`mt-2 leading-relaxed text-white/65 ${
              compact ? "text-xs leading-snug" : "text-sm"
            }`}
          >
            {principle.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
