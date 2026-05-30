import { siteContent } from "../content";

const productNodes = [
  { label: "RouteMates", angle: 0 },
  { label: "Family OS", angle: 72 },
  { label: "Utilities", angle: 144 },
  { label: "Nexus Lab", angle: 216 },
  { label: "Future ventures", angle: 288, dashed: true },
];

export function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="ecosystem-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          Ecosystem
        </p>
        <h2 id="ecosystem-heading" className="section-heading mt-2">
          One nexus, many products
        </h2>
        <p className="section-sub">{siteContent.ecosystemIntro}</p>

        <div className="relative mx-auto mt-16 flex max-w-lg flex-col items-center">
          <div className="relative aspect-square w-full max-w-md">
            <svg
              className="absolute inset-0 h-full w-full text-lors-accent/20"
              viewBox="0 0 400 400"
              aria-hidden
            >
              <circle
                cx="200"
                cy="200"
                r="140"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 8"
              />
              {productNodes.map((node) => {
                const rad = (node.angle * Math.PI) / 180;
                const x = 200 + 140 * Math.cos(rad - Math.PI / 2);
                const y = 200 + 140 * Math.sin(rad - Math.PI / 2);
                return (
                  <line
                    key={node.label}
                    x1="200"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    strokeDasharray={node.dashed ? "4 6" : undefined}
                  />
                );
              })}
            </svg>

            <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-lors-glow/50 bg-lors-navy shadow-lg shadow-lors-accent/30">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-lors-glow/80">
                Parent
              </span>
              <span className="font-display text-sm font-bold text-white">LORS Nexus</span>
            </div>

            {productNodes.map((node) => {
              const rad = (node.angle * Math.PI) / 180;
              const left = 50 + 35 * Math.cos(rad - Math.PI / 2);
              const top = 50 + 35 * Math.sin(rad - Math.PI / 2);
              return (
                <div
                  key={node.label}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span
                    className={`block whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium ${
                      node.dashed
                        ? "border-dashed border-white/30 bg-white/5 text-white/50"
                        : "border-lors-glow/30 bg-lors-accent/15 text-lors-glow"
                    }`}
                  >
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 max-w-md text-center text-sm text-white/50">
            Each product ships under its own brand. As ventures mature, they can grow into
            independent companies while staying connected to the nexus vision.
          </p>
        </div>
      </div>
    </section>
  );
}
