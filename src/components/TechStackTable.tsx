import { techStack } from "../content";

type TechStackTableProps = {
  compact?: boolean;
};

export function TechStackTable({ compact = false }: TechStackTableProps) {
  return (
    <div className={compact ? "mt-4" : "mt-8"}>
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[480px] border-collapse text-left">
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
