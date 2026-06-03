import {
  contactEmail,
  contactMailto,
  getProject,
  siteContent,
  supportMailto,
  techStack,
  engineeringCulture,
  ecosystemContent,
  careersContent,
  careersFormUrl,
  featuredProjects,
  statusLabels,
} from "../content";
import type { Project } from "../content";
import { GalaxyScrollRoot } from "./GalaxyScrollRoot";

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED PANEL PRIMITIVES
   ───────────────────────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="panel-eyebrow mb-3">{children}</p>;
}

function PanelTitle({ children, large }: { children: React.ReactNode; large?: boolean }) {
  return (
    <h2 className={`font-display font-bold tracking-tight text-white break-words ${large ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"} leading-tight mb-1`}>
      {children}
    </h2>
  );
}

function PanelSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] sm:text-[13px] leading-relaxed text-white/60 mt-1 break-words">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="panel-divider my-3" />;
}

function StatusPill({ status, label }: { status: Project["status"]; label?: string }) {
  const cls: Record<Project["status"], string> = {
    live:          "status-live",
    beta:          "status-beta",
    "coming-soon": "status-coming-soon",
    concept:       "status-concept",
  };
  const full    = label ?? statusLabels[status];
  const display = full.length > 20 ? statusLabels[status] : full;
  return (
    <span className={`status-badge shrink-0 ${cls[status]}`} title={display !== full ? full : undefined}>
      {display}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO PANEL  (act 0 · gold sun)
   Centered brand identity card.
   ───────────────────────────────────────────────────────────────────────────── */
function HeroPanel() {
  // Show only the first two parts of the subTagline so the pill fits on narrow screens
  const eyebrowText = (siteContent.subTagline ?? "Utility Apps · IT Solutions")
    .split(" · ")
    .slice(0, 2)
    .join(" · ");

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-5 py-4 sm:px-8 sm:py-6 text-center overflow-hidden">
      {/* Corner accent marks */}
      <span className="absolute top-5 left-5 block w-6 h-6 border-t border-l panel-accent-border opacity-60" />
      <span className="absolute top-5 right-5 block w-6 h-6 border-t border-r panel-accent-border opacity-60" />
      <span className="absolute bottom-8 left-5 block w-6 h-6 border-b border-l panel-accent-border opacity-60" />
      <span className="absolute bottom-8 right-5 block w-6 h-6 border-b border-r panel-accent-border opacity-60" />

      <div className="relative z-10 flex flex-col items-center max-w-lg gap-5 w-full">
        {/* Eyebrow tag — capped width prevents overflow on narrow screens */}
        <div className="flex w-fit max-w-full items-center gap-2 rounded-full border panel-accent-border panel-accent-bg px-4 py-1.5 overflow-hidden">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full panel-accent-bg-dim ring-1 ring-current panel-accent" />
          <span className="text-[9px] font-bold uppercase tracking-[0.28em] panel-accent truncate">
            {eyebrowText}
          </span>
        </div>

        {/* Brand name */}
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-none drop-shadow-[0_0_30px_rgba(255,210,122,0.25)]">
            {siteContent.companyName}
          </h1>
          <p className="mt-2 font-display text-base font-semibold tracking-wide panel-accent">
            {siteContent.tagline}
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-[12px] sm:text-sm leading-relaxed text-white/65 max-w-xs sm:max-w-sm">
          {siteContent.heroSubtitle}
        </p>

        {/* Accent pulse bar */}
        <div className="flex items-center gap-2">
          <div className="h-px w-16 panel-accent-bg" style={{ background: "var(--pa)", opacity: 0.5 }} />
          <div className="h-1 w-1 rounded-full animate-pulse-glow" style={{ background: "var(--pa)" }} />
          <div className="h-px w-16 panel-accent-bg" style={{ background: "var(--pa)", opacity: 0.5 }} />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href={contactMailto()} className="btn-accent">
            Get in touch
          </a>
          <a href="#ecosystem" className="btn-outline-accent">
            View products
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECOSYSTEM PANEL  (act 1 · cyan planet)
   Portfolio overview: featured products + studio highlights.
   ───────────────────────────────────────────────────────────────────────────── */
function EcosystemPanel() {
  return (
    <GalaxyScrollRoot panelId="ecosystem" className="flex flex-col px-5 pt-4 pb-2 gap-0">
      <header className="flex-shrink-0 mb-3">
        <Eyebrow>Product Ecosystem</Eyebrow>
        <PanelTitle large>Portfolio</PanelTitle>
        <PanelSubtitle>{siteContent.ecosystemIntro}</PanelSubtitle>
      </header>

      <Divider />

      {/* Product cards */}
      <div className="flex-shrink-0 mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
          Flagship products
        </p>
        <ul className="grid grid-cols-1 gap-2">
          {featuredProjects.map((p) => (
            <EcosystemProductRow key={p.id} project={p} />
          ))}
        </ul>
      </div>

      <Divider />

      {/* Studio highlights */}
      {ecosystemContent.highlights.length > 0 && (
        <div className="flex-shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
            Studio DNA
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ecosystemContent.highlights.map((h) => (
              <li key={h.title} className="nexus-card p-3">
                <p className="font-display text-[11px] font-semibold text-white leading-tight mb-1">
                  {h.title}
                </p>
                <p className="text-[10px] leading-snug text-white/55">{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </GalaxyScrollRoot>
  );
}

function EcosystemProductRow({ project }: { project: Project }) {
  return (
    <li className="nexus-card--accent flex items-center gap-3 p-3">
      <ProductDot category={project.category} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-sm font-bold text-white leading-tight">
            {project.name}
          </span>
          <StatusPill status={project.status} label={project.statusLabel} />
        </div>
        {project.platforms && (
          <p className="text-[10px] text-white/45 mt-0.5">{project.platforms}</p>
        )}
        <p className="text-[11px] leading-snug text-white/65 mt-1 line-clamp-2">
          {project.pitch ?? project.description}
        </p>
      </div>
      {project.href && (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[11px] panel-accent hover:opacity-80 transition-opacity"
          aria-label={`Open ${project.name}`}
        >
          →
        </a>
      )}
    </li>
  );
}

function ProductDot({ category }: { category: string }) {
  const colors: Record<string, string> = {
    travel:       "#36e0a4",
    family:       "#9a6bff",
    media:        "#7eb8ff",
    productivity: "#ffc24d",
    platform:     "#ff7ec2",
  };
  const color = colors[category] ?? "#7eb8ff";
  return (
    <div
      className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold"
      style={{ background: `rgba(${hexToRgb(color)}, 0.14)`, color }}
    >
      {category.charAt(0).toUpperCase()}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROUTEMATES PANEL  (act 2 · emerald planet)
   ───────────────────────────────────────────────────────────────────────────── */
function RouteMatesPanel() {
  const project = getProject("routemates");
  if (!project) return null;

  return (
    <GalaxyScrollRoot panelId="routemates" className="flex flex-col px-5 pt-4 pb-2 gap-0">
      <header className="flex-shrink-0 mb-2">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <Eyebrow>Travel Super App</Eyebrow>
            <PanelTitle large>{project.name}</PanelTitle>
          </div>
          <StatusPill status={project.status} label={project.statusLabel} />
        </div>
        {project.platforms && (
          <p className="text-[10px] text-white/40 mt-0.5 mb-2">{project.platforms}</p>
        )}
        <PanelSubtitle>{project.pitch ?? project.description}</PanelSubtitle>
      </header>

      <Divider />

      {project.features && project.features.length > 0 && (
        <div className="flex-shrink-0 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
            Core features
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.features.map((f) => (
              <li key={f.title} className="nexus-card p-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full panel-accent" style={{ background: "var(--pa)", marginTop: "5px" }} />
                  <div>
                    <p className="font-display text-[11px] font-semibold text-white leading-tight">
                      {f.title}
                    </p>
                    <p className="text-[10px] leading-snug text-white/55 mt-0.5">{f.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {project.href && (
        <div className="flex-shrink-0 mt-auto">
          <a href={project.href} target="_blank" rel="noopener noreferrer" className="btn-accent text-xs">
            Open RouteMates →
          </a>
        </div>
      )}
    </GalaxyScrollRoot>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAMILY OS PANEL  (act 3 · violet ringed planet)
   ───────────────────────────────────────────────────────────────────────────── */
function FamilyOSPanel() {
  const project = getProject("family-os");
  if (!project) return null;

  return (
    <GalaxyScrollRoot panelId="familyos" className="flex flex-col px-5 pt-4 pb-2 gap-0">
      <header className="flex-shrink-0 mb-2">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <Eyebrow>Family Platform</Eyebrow>
            <PanelTitle large>{project.name}</PanelTitle>
          </div>
          <StatusPill status={project.status} label={project.statusLabel} />
        </div>
        <PanelSubtitle>{project.pitch ?? project.description}</PanelSubtitle>
      </header>

      <Divider />

      {project.features && project.features.length > 0 && (
        <div className="flex-shrink-0 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
            What's coming
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.features.map((f) => (
              <li key={f.title} className="nexus-card p-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "var(--pa)" }} />
                  <div>
                    <p className="font-display text-[11px] font-semibold text-white leading-tight">
                      {f.title}
                    </p>
                    <p className="text-[10px] leading-snug text-white/55 mt-0.5">{f.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coming-soon interest CTA */}
      <div className="flex-shrink-0 mt-auto">
        <a href={contactMailto("Interested in FamilyOS")} className="btn-accent text-xs">
          Stay updated →
        </a>
      </div>
    </GalaxyScrollRoot>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TECH PANEL  (act 4 · sky-blue planet)
   Engineering stack + culture principles.
   ───────────────────────────────────────────────────────────────────────────── */
function TechPanel() {
  return (
    <GalaxyScrollRoot panelId="tech" className="flex flex-col px-5 pt-4 pb-2 gap-0">
      <header className="flex-shrink-0 mb-2">
        <Eyebrow>Engineering</Eyebrow>
        <PanelTitle large>{techStack.title}</PanelTitle>
        <PanelSubtitle>{techStack.subtitle}</PanelSubtitle>
      </header>

      <Divider />

      {/* Tech layer cards */}
      <div className="flex-shrink-0 mb-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">Stack</p>
        <ul className="flex flex-col gap-1.5">
          {techStack.layers.map((row) => (
            <li key={row.layer} className="nexus-card flex items-start gap-3 px-3 py-2">
              <span className="flex-shrink-0 w-14 sm:w-20 font-display text-[10px] font-semibold panel-accent leading-tight pt-px">
                {row.layer}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-white/80 leading-snug break-words">{row.technologies}</p>
                <p className="text-[9px] text-white/45 mt-0.5 leading-snug break-words">{row.purpose}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      {/* Culture principles */}
      <div className="flex-shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
          Principles
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {engineeringCulture.principles.map((p) => (
            <li key={p.title} className="nexus-card--accent p-2.5">
              <p className="font-display text-[10px] font-bold panel-accent leading-tight mb-1">
                {p.title}
              </p>
              <p className="text-[9px] leading-snug text-white/55">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </GalaxyScrollRoot>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAREERS PANEL  (act 5 · rose planet)
   ───────────────────────────────────────────────────────────────────────────── */
function CareersPanel() {
  const formUrl = careersFormUrl();

  return (
    <GalaxyScrollRoot panelId="careers" className="flex flex-col px-5 pt-4 pb-2 gap-0">
      <header className="flex-shrink-0 mb-2">
        <Eyebrow>Careers</Eyebrow>
        <PanelTitle large>Join the Nexus</PanelTitle>
        <PanelSubtitle>{careersContent.body}</PanelSubtitle>
      </header>

      <Divider />

      {/* Highlights */}
      {careersContent.highlights.length > 0 && (
        <div className="flex-shrink-0 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
            Why build with us
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {careersContent.highlights.map((h) => (
              <li key={h.title} className="nexus-card p-2.5 transition-all hover:nexus-card--accent">
                <p className="font-display text-[10px] font-bold panel-accent leading-tight mb-1">
                  {h.title}
                </p>
                <p className="text-[9px] leading-snug text-white/55">{h.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Role tracks */}
      {careersContent.roleTracks.length > 0 && (
        <>
          <Divider />
          <div className="flex-shrink-0 mb-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2">
              Open tracks
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {careersContent.roleTracks.map((t) => (
                <li key={t.title} className="nexus-card--accent p-2.5">
                  <p className="font-display text-[11px] font-bold text-white leading-tight mb-1">
                    {t.title}
                  </p>
                  <p className="text-[10px] leading-snug text-white/55">{t.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* CTA */}
      <div className="flex-shrink-0 mt-auto">
        {formUrl ? (
          <button
            type="button"
            onClick={() => window.open(formUrl, "_blank", "noopener,noreferrer")}
            className="btn-accent text-xs"
          >
            Apply now →
          </button>
        ) : (
          <a href={contactMailto("Careers enquiry")} className="btn-outline-accent text-xs">
            Enquire about roles →
          </a>
        )}
      </div>
    </GalaxyScrollRoot>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT PANEL  (act 6 · amber planet)
   ───────────────────────────────────────────────────────────────────────────── */
function ContactPanel() {
  const email = contactEmail();

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-5 py-4 sm:px-8 sm:py-6 text-center overflow-hidden">
      {/* Corner marks */}
      <span className="absolute top-5 left-5 block w-6 h-6 border-t border-l panel-accent-border opacity-60" />
      <span className="absolute top-5 right-5 block w-6 h-6 border-t border-r panel-accent-border opacity-60" />
      <span className="absolute bottom-8 left-5 block w-6 h-6 border-b border-l panel-accent-border opacity-60" />
      <span className="absolute bottom-8 right-5 block w-6 h-6 border-b border-r panel-accent-border opacity-60" />

      <div className="relative z-10 flex flex-col items-center gap-4 max-w-md w-full">
        <div>
          <Eyebrow>Contact & Support</Eyebrow>
          <PanelTitle large>Reach out</PanelTitle>
          <PanelSubtitle>
            For partnerships, press, or strategic infrastructure inquiries—reach our central response desk.
          </PanelSubtitle>
        </div>

        <div className="panel-divider w-full" />

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-2">
          <a href={contactMailto()} className="btn-accent">
            Global intake
          </a>
          <a
            href={`mailto:${email}`}
            className="text-[11px] panel-accent hover:opacity-80 transition-opacity break-all"
          >
            {email}
          </a>
          {siteContent.contactSla && (
            <p className="text-[10px] text-white/40">
              Response SLA: {siteContent.contactSla}
            </p>
          )}
        </div>

        <div className="panel-divider w-full" />

        {/* Support channels */}
        <div className="w-full text-left">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40 mb-2 text-center">
            Product support
          </p>
          <p className="text-[11px] text-white/50 leading-snug mb-3 text-center">
            Include{" "}
            <code className="rounded px-1 py-0.5 bg-white/5 text-[10px] panel-accent">
              [Support - Product]
            </code>{" "}
            in your subject for auto-triage.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <a href={supportMailto("routemates")} className="btn-outline-accent text-[10px] py-1.5 px-3 min-h-0">
              RouteMates support
            </a>
            <a href={supportMailto("familyos")} className="btn-outline-accent text-[10px] py-1.5 px-3 min-h-0">
              FamilyOS support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UTILITY: hex → "R, G, B" string for inline rgba()
   ───────────────────────────────────────────────────────────────────────────── */
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ROUTER
   ───────────────────────────────────────────────────────────────────────────── */
type HologramSectionPanelProps = { panelId: string };

export function HologramSectionPanel({ panelId }: HologramSectionPanelProps) {
  switch (panelId) {
    case "hero":       return <HeroPanel />;
    case "ecosystem":  return <EcosystemPanel />;
    case "routemates": return <RouteMatesPanel />;
    case "familyos":   return <FamilyOSPanel />;
    case "tech":       return <TechPanel />;
    case "careers":    return <CareersPanel />;
    case "contact":    return <ContactPanel />;
    default:           return null;
  }
}
