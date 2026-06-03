import { Link } from "react-router-dom";
import { navLinks, siteContent } from "../content";
import { useNavSolid } from "../hooks/useNavSolid";

export function SiteNav() {
  const solid = useNavSolid();

  return (
    <header
      style={{ paddingTop: "env(safe-area-inset-top)" }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-white/[0.06] bg-lors-navy/92 backdrop-blur-xl shadow-[0_1px_0_rgba(126,184,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8"
        aria-label="Main"
      >
        {/* Logo / wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if ("scrollRestoration" in history) history.scrollRestoration = "manual";
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
            window.location.reload();
          }}
          className="group flex items-center gap-2.5"
          aria-label={`${siteContent.companyName} – home`}
        >
          {/* Animated dot */}
          <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lors-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lors-accent" />
          </span>
          <span className="font-display text-base font-bold tracking-tight text-white transition-colors group-hover:text-lors-glow">
            {siteContent.companyName}
          </span>
        </a>

        {/* Nav links */}
        <ul className="flex items-center gap-0.5 sm:gap-2">
          {navLinks.map((link) => (
            <li
              key={link.href}
              className={link.label === "Tech" ? "hidden min-[420px]:list-item" : undefined}
            >
              <Link
                to={link.href}
                className="rounded-lg px-2 py-1.5 text-[11px] font-medium text-white/60 transition-all duration-200 hover:bg-white/5 hover:text-white sm:px-3 sm:text-[13px]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
