import {
  contactEmail,
  contactMailto,
  featuredProjects,
  siteContent,
  upcomingProjects,
} from "../content";
import { EcosystemDiagram } from "./EcosystemDiagram";
import { ITCapabilityGrid } from "./ITCapabilityGrid";
import { MissionPillarGrid } from "./MissionPillarGrid";
import { ProjectHologramCard } from "./ProjectHologramCard";
import { SectionHeader } from "./SectionHeader";

type HologramSectionPanelProps = {
  panelId: string;
};

export function HologramSectionPanel({ panelId }: HologramSectionPanelProps) {
  switch (panelId) {
    case "hero":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <div className="glass-panel w-full max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-lors-glow/90">
              Utility apps · IT solutions · Product ecosystem
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
                href="#products"
                className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-white/25 px-6 py-2 text-sm font-medium text-white/90 transition hover:border-white/50 hover:bg-white/5"
              >
                View products
              </a>
            </div>
          </div>
        </div>
      );

    case "mission":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Our mission"
            title="Technology for real life"
            subtitle={siteContent.about}
          />
          <MissionPillarGrid compact />
        </div>
      );

    case "it":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="IT solutions"
            title="Built by engineers, delivered with care"
            subtitle="LORS Nexus pairs product craft with professional IT delivery — from mobile clients and cloud APIs to security, DevOps, and consulting partnerships."
          />
          <ITCapabilityGrid compact />
        </div>
      );

    case "ecosystem":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Ecosystem"
            title="One nexus, many products"
            subtitle={siteContent.ecosystemIntro}
          />
          <EcosystemDiagram compact />
        </div>
      );

    case "products":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Flagship products"
            title="Highlighted projects"
            subtitle="Our most visible utilities — built for everyday impact and engineered to grow with your life."
          />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <ProjectHologramCard
                key={project.id}
                project={project}
                featured
                compact
                staticVisible
              />
            ))}
          </div>
        </div>
      );

    case "pipeline":
      return (
        <div className="hologram-panel-scroll flex h-full w-full flex-col px-6 py-4">
          <SectionHeader
            compact
            eyebrow="Pipeline"
            title="Upcoming utilities"
            subtitle="Holographic previews of what we're shaping next — trip tools, document management, dual-camera recording, and more experiments from Nexus Lab."
          />
          <div className="mt-6 grid grid-cols-2 gap-4">
            {upcomingProjects.map((project) => (
              <ProjectHologramCard
                key={project.id}
                project={project}
                compact
                staticVisible
              />
            ))}
          </div>
        </div>
      );

    case "contact":
      return (
        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <SectionHeader
            compact
            className="mx-auto max-w-lg"
            eyebrow="Contact"
            title="Let's build what's next"
            subtitle={`Partnerships, product inquiries, or IT consulting — reach out and we'll connect you with the right team at ${siteContent.companyName}.`}
          />
          <a
            href={contactMailto()}
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-lors-accent px-8 py-2.5 text-sm font-semibold text-white shadow-lg shadow-lors-accent/30 transition hover:bg-lors-glow hover:text-lors-navy"
          >
            Get in touch
          </a>
          <p className="mt-3">
            <a
              href={`mailto:${contactEmail()}`}
              className="text-sm text-lors-glow/90 transition hover:text-lors-glow hover:underline"
            >
              {contactEmail()}
            </a>
          </p>
        </div>
      );

    default:
      return null;
  }
}
