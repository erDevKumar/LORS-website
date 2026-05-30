import { contactMailto, siteContent } from "../content";

export function Hero() {
  return (
    <section
      className="section-snap relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6"
      aria-label="Introduction"
    >
      <div className="hero-bg-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-mesh pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="hero-nodes pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lors-navy/30 via-lors-navy/50 to-lors-navy/90"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        <div className="glass-panel">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-lors-glow/90 sm:text-sm">
            {siteContent.subTagline ?? "Utility Apps · IT Solutions · Product Ecosystem"}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {siteContent.companyName}
          </h1>
          <p className="mt-4 font-display text-xl font-medium text-lors-glow sm:text-2xl md:text-3xl">
            {siteContent.tagline}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            {siteContent.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={contactMailto()}
              className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-full bg-lors-accent px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-lors-accent/25 transition hover:bg-lors-glow hover:text-lors-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow"
            >
              Get in touch
            </a>
            <a
              href="#ecosystem"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/25 px-8 py-3 text-sm font-medium text-white/90 transition hover:border-white/50 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              View products
            </a>
          </div>
        </div>
      </div>

      <a
        href="#ecosystem"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/40 transition hover:text-white/70"
        aria-label="Scroll to product ecosystem section"
      >
        <svg
          className="h-6 w-6 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}
