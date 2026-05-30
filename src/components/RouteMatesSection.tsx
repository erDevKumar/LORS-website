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
        </div>
      </div>
    </section>
  );
}
