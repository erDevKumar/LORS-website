import { Link } from "react-router-dom";
import { siteContent } from "../content";

export function LegalFooterBar() {
  return (
    <footer className="legal-footer-bar pointer-events-auto fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-lors-navy/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2 text-center text-[11px] text-white/45 sm:gap-x-3 sm:text-xs">
        <Link to="/privacy" className="text-lors-glow/80 transition hover:text-lors-glow">
          Privacy Policy
        </Link>
        <span className="text-white/20" aria-hidden>
          ·
        </span>
        <Link to="/terms" className="text-lors-glow/80 transition hover:text-lors-glow">
          Terms &amp; Conditions
        </Link>
        <span className="text-white/20" aria-hidden>
          ·
        </span>
        <Link to="/disclaimer" className="text-lors-glow/80 transition hover:text-lors-glow">
          Disclaimer
        </Link>
        <span className="hidden text-white/20 sm:inline" aria-hidden>
          ·
        </span>
        <span className="w-full sm:w-auto">
          &copy; {siteContent.year} {siteContent.companyName}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
