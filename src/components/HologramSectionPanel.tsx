import {
  contactEmail,
  contactMailto,
  getProject,
  siteContent,
  supportMailto,
  techStack,
} from "../content";
import { CareersPanel } from "./CareersPanel";
import { EngineeringPrinciplesGrid } from "./EngineeringPrinciplesGrid";
import { PortfolioEcosystemPanel } from "./PortfolioEcosystemPanel";
import { ProductDetailPanel } from "./ProductDetailPanel";
import { SectionHeader } from "./SectionHeader";
import { TechStackTable } from "./TechStackTable";

type HologramSectionPanelProps = {
  panelId: string;
};

export function HologramSectionPanel({ panelId }: HologramSectionPanelProps) {
  const routemates = getProject("routemates");
  const familyos = getProject("family-os");

  switch (panelId) {
    case "hero":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel w-full max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-lors-glow/90">
              {siteContent.subTagline ?? "Utility Apps · IT Solutions · Product Ecosystem"}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {siteContent.companyName}
            </h1>
            <p className="mt-3 font-display text-lg font-medium text-lors-glow sm:text-xl">
              {siteContent.tagline}
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75">
              {siteContent.heroSubtitle}
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={contactMailto()}
                className="inline-flex min-h-[40px] min-w-[160px] items-center justify-center rounded-full bg-lors-accent px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-lors-accent/25 transition hover:bg-lors-glow hover:text-lors-navy"
              >
                Get in touch
              </a>
              <a
                href="#ecosystem"
                className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/25 px-6 py-2 text-sm font-medium text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                View products
              </a>
            </div>
          </div>
        </div>
      );

    case "ecosystem":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Our product ecosystem"
            title="Portfolio"
            subtitle={siteContent.ecosystemIntro}
          />
          <PortfolioEcosystemPanel compact />
        </div>
      );

    case "routemates":
      return routemates ? (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <ProductDetailPanel project={routemates} compact />
        </div>
      ) : null;

    case "familyos":
      return familyos ? (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <ProductDetailPanel project={familyos} compact />
        </div>
      ) : null;

    case "tech":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Tech stack"
            title={techStack.title}
            subtitle={techStack.subtitle}
          />
          <TechStackTable compact />
          <SectionHeader
            compact
            className="mt-6"
            eyebrow="Engineering culture"
            title="How we build"
          />
          <EngineeringPrinciplesGrid compact />
        </div>
      );

    case "careers":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Careers"
            title="Join the Nexus"
            subtitle="Why build with us?"
          />
          <CareersPanel compact />
        </div>
      );

    case "contact":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col items-center justify-center px-6 py-4 text-center">
          <SectionHeader
            compact
            className="mx-auto max-w-lg"
            eyebrow="Contact & support"
            title="Corporate communications"
            subtitle="Whether you are an industry researcher, tech journalist, prospective talent, or looking to discuss strategic infrastructure integrations, reach out directly to our central response desk."
          />
          <a
            href={contactMailto()}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-lors-accent px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lors-accent/30 transition hover:bg-lors-glow hover:text-lors-navy"
          >
            Global intake
          </a>
          <p className="mt-3">
            <a
              href={`mailto:${contactEmail()}`}
              className="text-sm text-lors-glow/90 transition hover:text-lors-glow hover:underline"
            >
              {contactEmail()}
            </a>
          </p>
          {siteContent.contactSla && (
            <p className="mt-4 text-xs text-white/55">
              Response SLA: {siteContent.contactSla}
            </p>
          )}
          {siteContent.pgpNote && (
            <p className="mt-1 text-xs text-white/45">Secure PGP Key: {siteContent.pgpNote}</p>
          )}
          <div className="mt-6 max-w-md space-y-2 text-left">
            <p className="text-xs font-medium text-white/70">Product support channels</p>
            <p className="text-[11px] leading-relaxed text-white/55">
              Need help with RouteMates or FamilyOS? Append{" "}
              <code className="text-lors-glow/80">[Support - RouteMates]</code> or{" "}
              <code className="text-lors-glow/80">[Support - FamilyOS]</code> to your email
              subject header for automated triage routing.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href={supportMailto("routemates")}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-lors-glow/90 transition hover:border-lors-glow/50"
              >
                RouteMates support
              </a>
              <a
                href={supportMailto("familyos")}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-lors-glow/90 transition hover:border-lors-glow/50"
              >
                FamilyOS support
              </a>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
