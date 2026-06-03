import { techStack } from "../content";

type TechStackTableProps = {
  compact?: boolean;
};

export function TechStackTable({ compact = false }: TechStackTableProps) {
  return (
    <div className={`w-full min-w-0 break-words ${compact ? "mt-4" : "mt-8"}`}>
      {/* Mobile Card Layout (hidden on md and up) */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-4 md:hidden">
        {techStack.layers.map((row) => (
          <div
            key={row.layer}
            className="w-full min-w-0 rounded-xl border border-white/10 bg-lors-deep/80 p-4"
          >
            <div className="mb-2 border-b border-white/10 pb-2">
              <h5 className="font-display text-sm font-semibold text-lors-glow">
                {row.layer}
              </h5>
            </div>
            <div className="mb-2">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/50">Technologies</p>
              <p className="text-sm text-white/80 break-words [text-wrap:balance]">{row.technologies}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/50">Purpose</p>
              <p className="text-sm text-white/60 break-words">{row.purpose}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Layout (hidden on screens smaller than md) */}
      <div className="hidden w-full min-w-0 overflow-x-auto rounded-xl border border-white/10 md:block">
        <table className="w-full min-w-max border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 bg-lors-deep/80">
              <th
                className={`font-display font-semibold text-lors-glow ${
                  compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                }`}
              >
                Layer
              </th>
              <th
                className={`font-display font-semibold text-lors-glow ${
                  compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                }`}
              >
                Technologies
              </th>
              <th
                className={`font-display font-semibold text-lors-glow ${
                  compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                }`}
              >
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            {techStack.layers.map((row) => (
              <tr
                key={row.layer}
                className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
              >
                <td
                  className={`align-top font-medium text-white ${
                    compact ? "px-3 py-2 text-xs" : "px-4 py-3 text-sm"
                  }`}
                >
                  {row.layer}
                </td>
                <td
                  className={`align-top text-white/75 ${
                    compact ? "px-3 py-2 text-[11px] leading-snug" : "px-4 py-3 text-sm"
                  }`}
                >
                  {row.technologies}
                </td>
                <td
                  className={`align-top text-white/60 ${
                    compact ? "px-3 py-2 text-[11px] leading-snug" : "px-4 py-3 text-sm"
                  }`}
                >
                  {row.purpose}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
