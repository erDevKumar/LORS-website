import { Link } from "react-router-dom";
import { siteContent } from "../content";

export function LegalFooterBar() {
  return (
    <footer className="legal-footer-bar pointer-events-auto fixed inset-x-0 bottom-0 z-[60] border-t border-white/[0.05] bg-lors-navy/96 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-1.5 text-center">
        {/* Legal links */}
        <nav className="flex items-center gap-3" aria-label="Legal">
          {[
            { to: "/privacy",    label: "Privacy" },
            { to: "/terms",      label: "Terms" },
            { to: "/disclaimer", label: "Disclaimer" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-[10px] text-white/35 transition-colors hover:text-lors-glow/70"
            >
              {label}
            </Link>
          ))}
        </nav>

        <span className="text-white/15 text-[10px]" aria-hidden>·</span>

        <span className="text-[10px] text-white/25">
          &copy; {siteContent.year} {siteContent.companyName}
        </span>
      </div>
    </footer>
  );
}
