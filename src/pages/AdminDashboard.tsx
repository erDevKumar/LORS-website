import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../store/useAdminStore";
import { featuredProjects, siteContent } from "../content";
import type { Project } from "../content";

/* ─── Types ─────────────────────────────────────────────────────────────────── */
type NavSection = "overview" | "projects" | "sections" | "settings";

/* ─── Colour map matching galaxy planets ────────────────────────────────────── */
const PROJECT_COLORS: Record<string, string> = {
  routemates: "#36e0a4",
  "family-os": "#9a6bff",
  travel: "#36e0a4",
  family: "#9a6bff",
  media: "#7eb8ff",
  productivity: "#ffc24d",
  platform: "#ff7ec2",
};

function projectColor(p: Project): string {
  return PROJECT_COLORS[p.id] ?? PROJECT_COLORS[p.category] ?? "#7eb8ff";
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return `${parseInt(c.slice(0, 2), 16)}, ${parseInt(c.slice(2, 4), 16)}, ${parseInt(c.slice(4, 6), 16)}`;
}

/* ─── Status badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], { cls: string; label: string }> = {
    live:          { cls: "border-green-500/40 bg-green-500/10 text-green-300",   label: "Live" },
    beta:          { cls: "border-lors-accent/40 bg-lors-accent/10 text-lors-accent", label: "Beta" },
    "coming-soon": { cls: "border-lors-purple/40 bg-lors-purple/10 text-lors-purple", label: "Coming Soon" },
    concept:       { cls: "border-white/20 bg-white/5 text-white/50",             label: "In R&D" },
  };
  const { cls, label } = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${cls}`}>
      {label}
    </span>
  );
}

/* ─── Visibility pill ────────────────────────────────────────────────────────── */
function VisibilityPill({ visible }: { visible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
        visible
          ? "border-green-500/40 bg-green-500/10 text-green-300"
          : "border-white/15 bg-white/5 text-white/35"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${visible ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />
      {visible ? "Visible" : "Hidden"}
    </span>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  const rgb = hexToRgb(accent);
  return (
    <div
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: `rgba(${rgb}, 0.06)`,
        border: `1px solid rgba(${rgb}, 0.18)`,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

/* ─── Section row ────────────────────────────────────────────────────────────── */
const SITE_SECTIONS = [
  { id: "hero",       label: "Hero",              color: "#ffd27a", act: 0, path: "/#hero" },
  { id: "ecosystem",  label: "Product Ecosystem", color: "#19c8ff", act: 1, path: "/#ecosystem" },
  { id: "routemates", label: "RouteMates",         color: "#36e0a4", act: 2, path: "/#routemates" },
  { id: "familyos",   label: "Family OS",          color: "#9a6bff", act: 3, path: "/#familyos" },
  { id: "tech",       label: "Tech Stack",         color: "#7eb8ff", act: 4, path: "/#tech" },
  { id: "careers",    label: "Careers",            color: "#ff7ec2", act: 5, path: "/#careers" },
  { id: "contact",    label: "Contact",            color: "#ffc24d", act: 6, path: "/#contact" },
];

/* ─── Main dashboard ─────────────────────────────────────────────────────────── */
export function AdminDashboard() {
  const navigate = useNavigate();
  const { adminEmail, logout } = useAdminStore();
  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Local visibility overrides (in-memory only for this prototype)
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(featuredProjects.map((p) => [p.id, true]))
  );

  function handleLogout() {
    logout();
    navigate("/admin", { replace: true });
  }

  function toggleVisibility(id: string) {
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-lors-navy flex flex-col">
      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-5 py-3 sm:px-8 border-b border-white/[0.06]"
        style={{ background: "rgba(8,14,33,0.95)", backdropFilter: "blur(16px)" }}
      >
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="lg:hidden rounded-lg p-1.5 text-white/50 hover:text-white hover:bg-white/5 transition-all"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="/" className="flex items-center gap-2 group">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lors-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lors-accent" />
            </span>
            <span className="font-display text-sm font-bold text-white group-hover:text-lors-glow transition-colors">
              LORS Nexus
            </span>
          </a>

          <span className="hidden sm:block text-white/20 text-xs">/</span>
          <span className="hidden sm:block inline-flex items-center gap-1.5 rounded-full border border-lors-accent/25 bg-lors-accent/8 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-lors-accent">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[11px] text-white/40 font-mono">{adminEmail}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/60 hover:border-red-500/30 hover:bg-red-500/8 hover:text-red-300 transition-all"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {/* ── Mobile overlay ───────────────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-20 bg-lors-navy/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-30 flex-shrink-0 w-56 flex flex-col border-r border-white/[0.06] transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ background: "rgba(8,14,33,0.98)", top: "53px" }}
        >
          <nav className="flex flex-col gap-1 p-3 pt-5">
            {(
              [
                { id: "overview",  label: "Overview",  icon: "⬡" },
                { id: "projects",  label: "Projects",  icon: "◈" },
                { id: "sections",  label: "Sections",  icon: "⊞" },
                { id: "settings",  label: "Settings",  icon: "⚙" },
              ] as { id: NavSection; label: string; icon: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-medium transition-all duration-150 ${
                  activeSection === item.id
                    ? "bg-lors-accent/10 border border-lors-accent/25 text-lors-accent"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className="text-[14px] opacity-70">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto p-3 pb-6">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(0,221,255,0.05)", border: "1px solid rgba(0,221,255,0.12)" }}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-lors-accent/70 mb-1">
                Live site
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-white/40 hover:text-lors-accent transition-colors"
              >
                lorsnexus.com ↗
              </a>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 min-w-0">
          {activeSection === "overview" && <OverviewPanel visibility={visibility} />}
          {activeSection === "projects" && (
            <ProjectsPanel visibility={visibility} onToggle={toggleVisibility} />
          )}
          {activeSection === "sections" && <SectionsPanel />}
          {activeSection === "settings" && <SettingsPanel adminEmail={adminEmail} onLogout={handleLogout} />}
        </main>
      </div>
    </div>
  );
}

/* ─── Overview panel ─────────────────────────────────────────────────────────── */
function OverviewPanel({ visibility }: { visibility: Record<string, boolean> }) {
  const visibleCount = Object.values(visibility).filter(Boolean).length;
  const liveCount = featuredProjects.filter((p) => p.status === "live" || p.status === "beta").length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lors-accent/70 mb-1">
          Dashboard
        </p>
        <h2 className="font-display text-2xl font-bold text-white">Overview</h2>
        <p className="mt-1 text-sm text-white/45">
          Site status and product portfolio at a glance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Projects"      value={featuredProjects.length} accent="#19c8ff" />
        <StatCard label="Visible"       value={visibleCount}            accent="#36e0a4" />
        <StatCard label="Active"        value={liveCount}               accent="#ffd27a" />
        <StatCard label="Site Sections" value={SITE_SECTIONS.length}    accent="#ff7ec2" />
      </div>

      {/* Horizontal divider */}
      <div className="h-px bg-white/[0.06]" />

      {/* Featured: RouteMates */}
      <RouteMatesFeatureCard />

      {/* Quick project list */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 mb-3">
          All projects
        </p>
        <ul className="flex flex-col gap-2">
          {featuredProjects.map((p) => {
            const color = projectColor(p);
            const rgb = hexToRgb(color);
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: color, boxShadow: `0 0 8px rgba(${rgb},0.6)` }}
                />
                <span className="flex-1 font-display text-sm font-semibold text-white">{p.name}</span>
                <StatusBadge status={p.status} />
                <VisibilityPill visible={visibility[p.id] ?? true} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ─── Routemates feature card ────────────────────────────────────────────────── */
function RouteMatesFeatureCard() {
  const project = featuredProjects.find((p) => p.id === "routemates");
  if (!project) return null;

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(135deg, rgba(54,224,164,0.08) 0%, rgba(8,14,33,0.95) 60%)",
        border: "1px solid rgba(54,224,164,0.22)",
        boxShadow: "0 0 60px rgba(54,224,164,0.06)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-[6%] right-[6%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(54,224,164,0.85), transparent)" }}
      />

      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <p
            className="text-[9px] font-bold uppercase tracking-[0.28em] mb-1.5"
            style={{ color: "#36e0a4" }}
          >
            Flagship Product · Travel Super App
          </p>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
            {project.name}
          </h3>
          {project.platforms && (
            <p className="mt-1 text-[10px] text-white/40">{project.platforms}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={project.status} />
          <VisibilityPill visible />
        </div>
      </div>

      <p className="text-sm text-white/60 leading-relaxed mb-5 max-w-2xl">
        {project.pitch ?? project.description}
      </p>

      {project.features && project.features.length > 0 && (
        <div className="mb-5">
          <p
            className="text-[9px] font-semibold uppercase tracking-[0.25em] mb-2.5"
            style={{ color: "rgba(54,224,164,0.6)" }}
          >
            Core features
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {project.features.map((f) => (
              <li
                key={f.title}
                className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                style={{
                  background: "rgba(54,224,164,0.05)",
                  border: "1px solid rgba(54,224,164,0.14)",
                }}
              >
                <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "#36e0a4" }} />
                <div>
                  <p className="font-display text-[11px] font-semibold text-white leading-tight">{f.title}</p>
                  <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "#36e0a4",
              color: "#040814",
              boxShadow: "0 0 20px rgba(54,224,164,0.35)",
            }}
          >
            Open RouteMates ↗
          </a>
        )}
        <a
          href="https://tame-ash-49716845.figma.site/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: "rgba(54,224,164,0.08)",
            border: "1px solid rgba(54,224,164,0.30)",
            color: "#36e0a4",
          }}
        >
          View design mockup ↗
        </a>
        <a
          href="/#routemates"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white/50 hover:text-white transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          View on site →
        </a>
      </div>
    </div>
  );
}

/* ─── Projects panel ─────────────────────────────────────────────────────────── */
function ProjectsPanel({
  visibility,
  onToggle,
}: {
  visibility: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lors-accent/70 mb-1">
          Projects
        </p>
        <h2 className="font-display text-2xl font-bold text-white">Product Portfolio</h2>
        <p className="mt-1 text-sm text-white/45">
          Manage product visibility and review project details.
        </p>
      </div>

      <ul className="flex flex-col gap-4">
        {featuredProjects.map((p) => {
          const color = projectColor(p);
          const rgb = hexToRgb(color);
          const isVisible = visibility[p.id] ?? true;

          return (
            <li
              key={p.id}
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, rgba(${rgb}, 0.06) 0%, rgba(8,14,33,0.96) 55%)`,
                border: `1px solid rgba(${rgb}, ${isVisible ? "0.22" : "0.08"})`,
                opacity: isVisible ? 1 : 0.55,
                transition: "opacity 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-[6%] right-[6%] h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(${rgb}, ${isVisible ? "0.8" : "0.25"}), transparent)`,
                }}
              />

              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[11px] font-bold"
                      style={{ background: `rgba(${rgb}, 0.14)`, color }}
                    >
                      {p.category.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-white leading-tight">
                        {p.name}
                      </h3>
                      {p.platforms && (
                        <p className="text-[10px] text-white/35 mt-0.5">{p.platforms}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={p.status} />
                    <VisibilityPill visible={isVisible} />
                    <button
                      type="button"
                      onClick={() => onToggle(p.id)}
                      className="rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all"
                      style={{
                        background: isVisible ? "rgba(239,68,68,0.08)" : "rgba(54,224,164,0.08)",
                        border: isVisible ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(54,224,164,0.25)",
                        color: isVisible ? "#f87171" : "#36e0a4",
                      }}
                    >
                      {isVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-white/55 leading-relaxed mb-4 max-w-2xl">
                  {p.pitch ?? p.description}
                </p>

                {/* Routemates extra: Figma design link */}
                {p.id === "routemates" && (
                  <div
                    className="mb-4 flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(54,224,164,0.05)",
                      border: "1px solid rgba(54,224,164,0.18)",
                    }}
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-lors-emerald animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-lors-emerald mb-0.5">
                        Design prototype available
                      </p>
                      <a
                        href="https://tame-ash-49716845.figma.site/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-white/50 hover:text-lors-emerald transition-colors break-all"
                      >
                        https://tame-ash-49716845.figma.site/ ↗
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2">
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium hover:opacity-75 transition-opacity"
                      style={{ color }}
                    >
                      Open app ↗
                    </a>
                  )}
                  {p.id === "routemates" && (
                    <a
                      href="https://tame-ash-49716845.figma.site/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium hover:opacity-75 transition-opacity"
                      style={{ color }}
                    >
                      Design mockup ↗
                    </a>
                  )}
                  <a
                    href={`/#${p.id === "family-os" ? "familyos" : p.id}`}
                    className="text-[11px] text-white/35 hover:text-white/60 transition-colors"
                  >
                    View on site →
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-[10px] text-white/25 italic">
        Visibility changes are preview-only — this prototype has no persistent backend storage.
      </p>
    </div>
  );
}

/* ─── Sections panel ─────────────────────────────────────────────────────────── */
function SectionsPanel() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lors-accent/70 mb-1">
          Site structure
        </p>
        <h2 className="font-display text-2xl font-bold text-white">Sections</h2>
        <p className="mt-1 text-sm text-white/45">
          All 7 acts of the cinematic galaxy scroll experience.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {SITE_SECTIONS.map((s) => {
          const rgb = hexToRgb(s.color);
          return (
            <li
              key={s.id}
              className="flex items-center gap-4 rounded-xl px-4 py-3.5"
              style={{
                background: `rgba(${rgb}, 0.04)`,
                border: `1px solid rgba(${rgb}, 0.14)`,
              }}
            >
              {/* Planet dot */}
              <div
                className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center text-[10px] font-bold"
                style={{ background: `rgba(${rgb}, 0.14)`, color: s.color }}
              >
                {s.act}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-white leading-tight">{s.label}</p>
                <p className="text-[10px] text-white/35 mt-0.5">Act {s.act} · /{s.id}</p>
              </div>

              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em]"
                style={{
                  borderColor: `rgba(${rgb}, 0.35)`,
                  background: `rgba(${rgb}, 0.08)`,
                  color: s.color,
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
                Live
              </span>

              <a
                href={s.path}
                className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
              >
                Go to →
              </a>
            </li>
          );
        })}
      </ul>

      <div className="h-px bg-white/[0.06]" />

      <div
        className="rounded-xl p-5"
        style={{ background: "rgba(126,184,255,0.04)", border: "1px solid rgba(126,184,255,0.12)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lors-glow/70 mb-2">
          Architecture note
        </p>
        <p className="text-xs text-white/45 leading-relaxed">
          Each section is driven by the React Three Fiber galaxy scroll pipeline. The 3D camera travels
          between 7 orbital bodies as the user scrolls. Content lives in{" "}
          <code className="rounded px-1 bg-white/5 text-[10px] text-lors-glow/70">content/**/*.md</code>{" "}
          and is built into{" "}
          <code className="rounded px-1 bg-white/5 text-[10px] text-lors-glow/70">src/generated/content.json</code>{" "}
          at build time.
        </p>
      </div>
    </div>
  );
}

/* ─── Settings panel ─────────────────────────────────────────────────────────── */
function SettingsPanel({
  adminEmail,
  onLogout,
}: {
  adminEmail: string | null;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-lors-accent/70 mb-1">
          Admin
        </p>
        <h2 className="font-display text-2xl font-bold text-white">Settings</h2>
        <p className="mt-1 text-sm text-white/45">Account and session information.</p>
      </div>

      {/* Account card */}
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: "rgba(0,221,255,0.04)", border: "1px solid rgba(0,221,255,0.14)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-lors-accent/70 mb-4">
          Current session
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Logged in as</span>
            <span className="font-mono text-xs text-white/70">{adminEmail}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Role</span>
            <span className="text-xs text-lors-accent">Administrator</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Session storage</span>
            <span className="text-xs text-white/50">Browser sessionStorage</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/40">Site</span>
            <a href="/" className="text-xs text-lors-glow hover:opacity-75 transition-opacity">
              lorsnexus.com
            </a>
          </div>
        </div>
      </div>

      {/* Links */}
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30 mb-4">
          Quick links
        </p>
        <ul className="flex flex-col gap-2">
          {[
            { label: "Live site", href: "/",            note: "lorsnexus.com public home" },
            { label: "RouteMates section", href: "/#routemates", note: "Act 2 · emerald planet" },
            { label: "RouteMates design", href: "https://tame-ash-49716845.figma.site/", note: "Figma prototype ↗", external: true },
            { label: "Privacy policy", href: "/privacy", note: "Legal" },
            { label: "Terms of service", href: "/terms",  note: "Legal" },
          ].map((item) => (
            <li
              key={item.href}
              className="flex items-center justify-between rounded-xl px-3 py-2.5"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div>
                <p className="text-xs font-medium text-white/75">{item.label}</p>
                <p className="text-[10px] text-white/30">{item.note}</p>
              </div>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="text-[11px] text-lors-glow/60 hover:text-lors-glow transition-colors"
              >
                →
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-2xl p-5 sm:p-6"
        style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.14)" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-400/70 mb-3">
          Session
        </p>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">
          Signing out will end your admin session. You will need to re-authenticate to access the dashboard.
        </p>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-red-500/30 bg-red-500/8 px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/14 hover:border-red-500/50 transition-all"
        >
          Sign out
        </button>
      </div>

      <p className="text-[10px] text-white/20">
        {siteContent.companyName} Admin Portal · {siteContent.year}
      </p>
    </div>
  );
}
