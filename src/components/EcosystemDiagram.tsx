import { siteContent } from "../content";

const productNodes = [
  { label: "RouteMates" },
  { label: "Family OS" },
  { label: "Utilities" },
  { label: "Nexus Lab" },
  { label: "Future ventures", dashed: true },
];

type EcosystemDiagramProps = {
  compact?: boolean;
};

export function EcosystemDiagram({ compact = false }: EcosystemDiagramProps) {
  return (
    <div
      className={`mx-auto flex w-full flex-col items-center ${
        compact ? "mt-6 max-w-[560px]" : "mt-14 max-w-3xl"
      }`}
    >
      {/* Nucleus core */}
      <div
        className={`relative flex items-center justify-center ${compact ? "h-24 w-24" : "h-36 w-36"}`}
        aria-hidden
      >
        <div
          className={`absolute rounded-full border border-lors-glow/20 ${
            compact ? "h-24 w-24" : "h-36 w-36"
          }`}
        />
        <div
          className={`absolute rounded-full border border-lors-accent/25 ${
            compact ? "h-16 w-16" : "h-24 w-24"
          }`}
        />
        <div
          className={`absolute animate-pulse rounded-full bg-lors-accent/30 blur-xl ${
            compact ? "h-14 w-14" : "h-20 w-20"
          }`}
        />
        <div
          className={`relative rounded-full bg-gradient-to-br from-lors-glow to-lors-accent shadow-[0_0_30px_rgba(0,221,255,0.65)] ${
            compact ? "h-9 w-9" : "h-14 w-14"
          }`}
        />
      </div>

      {/* Connector from hub down to the product rail */}
      <div
        className={`w-px bg-gradient-to-b from-lors-glow/60 to-lors-glow/10 ${
          compact ? "h-5" : "h-8"
        }`}
      />

      {/* Product nodes branching off a shared rail */}
      <div className="relative w-full">
        <div className="mx-auto h-px w-[90%] bg-gradient-to-r from-transparent via-lors-glow/40 to-transparent" />
        <ul className={`grid grid-cols-5 ${compact ? "gap-2" : "gap-4"}`}>
          {productNodes.map((node) => (
            <li key={node.label} className="flex flex-col items-center">
              <div
                className={`w-px ${node.dashed ? "bg-white/25" : "bg-lors-glow/50"} ${
                  compact ? "h-3" : "h-4"
                }`}
              />
              <div
                className={`flex w-full items-center justify-center whitespace-nowrap rounded-xl border text-center font-medium transition ${
                  compact ? "px-2 py-2 text-[10px]" : "px-3 py-3 text-sm"
                } ${
                  node.dashed
                    ? "border-dashed border-white/25 bg-white/[0.03] text-white/55"
                    : "border-lors-glow/30 bg-lors-deep/70 text-lors-glow hover:border-lors-accent/50"
                }`}
              >
                {node.label}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p
        className={`text-center text-white/55 ${
          compact ? "mt-4 max-w-sm text-xs leading-relaxed" : "mt-8 max-w-xl text-sm"
        }`}
      >
        Each product ships under its own brand. As ventures mature, they can grow into independent
        companies while staying connected to the nexus vision.
      </p>
    </div>
  );
}

export function ecosystemIntroCopy(): string {
  return siteContent.ecosystemIntro;
}
