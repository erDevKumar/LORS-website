import { getProject } from "../content";
import { ProductDetailPanel } from "./ProductDetailPanel";

export function FamilyOSSection() {
  const project = getProject("family-os");
  if (!project) return null;

  return (
    <section
      id="familyos"
      className="section-snap relative border-t border-white/10 px-4 py-24 sm:px-6"
      aria-labelledby="familyos-heading"
    >
      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-2xl border border-white/10 bg-lors-deep/60 p-6 sm:p-8">
          <ProductDetailPanel project={project} titleId="familyos-heading" />
        </div>
      </div>
    </section>
  );
}
