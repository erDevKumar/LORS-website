import { techStack } from "../content";

type TechStackTableProps = { compact?: boolean };

export function TechStackTable({ compact = false }: TechStackTableProps) {
  return (
    <div className={`w-full min-w-0 ${compact ? "mt-3" : "mt-6"}`}>
      <ul className="flex flex-col gap-2">
        {techStack.layers.map((row) => (
          <li
            key={row.layer}
            className={`nexus-card flex items-start gap-3 ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}
          >
            {/* Layer label */}
            <div
              className={`flex-shrink-0 ${
                compact ? "w-24" : "w-32"
              } font-display font-semibold text-lors-glow leading-tight ${
                compact ? "text-[10px]" : "text-xs"
              }`}
            >
              {row.layer}
            </div>
            {/* Technologies */}
            <div className="flex-1 min-w-0">
              <p
                className={`font-medium text-white/85 leading-snug ${
                  compact ? "text-[10px]" : "text-xs sm:text-sm"
                }`}
              >
                {row.technologies}
              </p>
              <p
                className={`mt-0.5 text-white/50 leading-snug ${
                  compact ? "text-[9px]" : "text-xs"
                }`}
              >
                {row.purpose}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
