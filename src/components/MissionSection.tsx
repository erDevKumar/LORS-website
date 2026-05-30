import { missionPillars, siteContent } from "../content";

export function MissionSection() {
  return (
    <section
      id="mission"
      className="section-snap relative border-t border-white/10 bg-lors-deep px-4 py-24 sm:px-6"
      aria-labelledby="mission-heading"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          Our mission
        </p>
        <h2 id="mission-heading" className="section-heading mt-2">
          Technology for real life
        </h2>
        <p className="section-sub">{siteContent.about}</p>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {missionPillars.map((pillar, i) => (
            <li
              key={pillar.title}
              className="group rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition hover:border-lors-glow/30 hover:shadow-lg hover:shadow-lors-accent/10"
            >
              <span className="font-mono text-sm text-lors-glow/60">0{i + 1}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
