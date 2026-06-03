import { contactMailto, siteContent } from "../content";

export function Hero() {
  return (
    <section
      className="section-snap relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-24 sm:px-6"
      aria-label="Introduction"
    >
      {/* Background layers */}
      <div className="hero-bg-gradient pointer-events-none absolute inset-0" aria-hidden />
      <div className="hero-mesh pointer-events-none absolute inset-0 opacity-30" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-lors-navy/20 via-lors-navy/50 to-lors-navy/90"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
        {/* Eyebrow tag */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lors-glow/25 bg-lors-glow/6 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-lors-accent animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lors-glow/80">
            {siteContent.subTagline ?? "Utility Apps · IT Solutions · Product Ecosystem"}
          </span>
        </div>

        {/* Brand */}
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
          {siteContent.companyName}
        </h1>
        <p className="mt-3 font-display text-xl font-semibold text-lors-glow sm:text-2xl md:text-3xl">
          {siteContent.tagline}
        </p>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          {siteContent.heroSubtitle}
        </p>

        {/* Accent line */}
        <div className="my-8 flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-lors-glow/40" />
          <div className="h-1.5 w-1.5 rounded-full bg-lors-accent animate-pulse-glow" />
          <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-lors-glow/40" />
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={contactMailto()}
            className="inline-flex w-full sm:w-auto min-h-[48px] min-w-[200px] items-center justify-center rounded-full bg-lors-accent px-8 py-3 text-sm font-semibold text-lors-navy shadow-lg shadow-lors-accent/25 transition hover:bg-lors-glow hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow"
          >
            Get in touch
          </a>
          <a
            href="#ecosystem"
            className="inline-flex w-full sm:w-auto min-h-[48px] min-w-[180px] items-center justify-center rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white/85 transition hover:border-lors-glow/40 hover:bg-lors-glow/6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            View products
          </a>
        </div>
      </div>

      {/* Scroll arrow */}
      <a
        href="#ecosystem"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/30 transition hover:text-lors-glow/60"
        aria-label="Scroll to ecosystem"
      >
        <svg className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
