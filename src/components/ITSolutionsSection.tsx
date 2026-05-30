import { itCapabilities } from "../content";

export function ITSolutionsSection() {
  return (
    <section
      id="it"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="it-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lors-indigo/20 via-transparent to-transparent" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
          IT solutions
        </p>
        <h2 id="it-heading" className="section-heading mt-2">
          Built by engineers, delivered with care
        </h2>
        <p className="section-sub">
          LORS Nexus pairs product craft with professional IT delivery — from mobile clients and
          cloud APIs to security, DevOps, and consulting partnerships.
        </p>
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {itCapabilities.map((cap) => (
            <li
              key={cap.title}
              className="rounded-xl border border-white/10 bg-lors-deep/60 p-5 backdrop-blur-sm transition hover:border-lors-accent/40"
            >
              <h3 className="font-display text-lg font-semibold text-lors-glow">{cap.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{cap.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
