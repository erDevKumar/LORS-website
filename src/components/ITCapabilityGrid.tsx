import { itCapabilities } from "../content";

type ITCapabilityGridProps = {
  compact?: boolean;
};

export function ITCapabilityGrid({ compact = false }: ITCapabilityGridProps) {
  return (
    <ul
      className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${
        compact ? "mt-6 gap-2 sm:grid-cols-2 lg:grid-cols-3" : "mt-14"
      }`}
    >
      {itCapabilities.map((cap) => (
        <li
          key={cap.title}
          className={`rounded-xl border border-white/10 bg-lors-deep/60 backdrop-blur-sm transition hover:border-lors-accent/40 ${
            compact ? "p-3" : "p-5"
          }`}
        >
          <h3
            className={`font-display font-semibold text-lors-glow ${
              compact ? "text-sm" : "text-lg"
            }`}
          >
            {cap.title}
          </h3>
          <p
            className={`mt-2 leading-relaxed text-white/60 ${
              compact ? "text-xs leading-snug" : "text-sm"
            }`}
          >
            {cap.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
