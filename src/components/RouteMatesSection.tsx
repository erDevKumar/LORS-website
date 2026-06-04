import { getProject } from "../content";
import { ProductDetailPanel } from "./ProductDetailPanel";

export function RouteMatesSection() {
  const project = getProject("routemates");
  if (!project) return null;

  return (
    <section
      id="routemates"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="routemates-heading"
    >
      <div className="pointer-events-none absolute inset-0 hero-bg-gradient opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-lors-deep/60 p-6 sm:p-8">
          <ProductDetailPanel project={project} titleId="routemates-heading" />

          {/* Get the App CTA */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#36e0a4]">
              — Download
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                aria-label="Get RouteMates on Google Play"
                className="inline-flex items-center gap-2 rounded-lg border border-[#36e0a4]/40 bg-[#36e0a4]/10 px-5 py-2.5 text-sm font-semibold text-[#36e0a4] transition-all duration-200 hover:bg-[#36e0a4]/20 hover:border-[#36e0a4]/70"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M3.18 23.76c.44.25.99.28 1.48.02l12.09-6.94-2.63-2.63-10.94 9.55zm-1.06-19.7C1.72 4.5 1.5 5 1.5 5.62v12.76c0 .62.22 1.12.62 1.56l.08.08L9.5 12 2.2 4.14l-.08.08-.1-.16zm14.34 7.94L14.1 9.64 3.18.24C2.69-.02 2.14.01 1.7.26L9.5 12l7.3-7.74zm.6 3.2L14.1 12l2.96-2.96 3.3 1.9c.94.54.94 1.58 0 2.12l-3.3 1.9z"/>
                </svg>
                Google Play (Beta)
              </a>
              <a
                href="#"
                aria-label="RouteMates on App Store — coming soon"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white/50 cursor-not-allowed"
                tabIndex={-1}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store (soon)
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
