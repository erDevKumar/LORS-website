import { missionPillars } from "../content";

type MissionPillarGridProps = {
  compact?: boolean;
};

export function MissionPillarGrid({ compact = false }: MissionPillarGridProps) {
  return (
    <ul
      className={`grid gap-6 ${
        compact ? "mt-6 grid-cols-3 gap-3" : "mt-14 md:grid-cols-3"
      }`}
    >
      {missionPillars.map((pillar) => (
        <li
          key={pillar.title}
          className={`group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent transition hover:border-lors-glow/30 hover:shadow-lg hover:shadow-lors-accent/10 ${
            compact ? "p-3" : "p-6"
          }`}
        >
          <h3
            className={`font-display font-semibold text-white ${
              compact ? "text-sm" : "text-xl"
            }`}
          >
            {pillar.title}
          </h3>
          <p
            className={`mt-3 leading-relaxed text-white/65 ${
              compact ? "text-xs leading-snug" : "text-sm"
            }`}
          >
            {pillar.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
