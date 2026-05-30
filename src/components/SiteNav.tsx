import { Link } from "react-router-dom";
import { navLinks, siteContent } from "../content";
import { useNavSolid } from "../hooks/useNavSolid";

export function SiteNav() {
  const solid = useNavSolid();

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "border-b border-white/10 bg-lors-navy/90 backdrop-blur-lg shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"
        aria-label="Main"
      >
        <Link
          to="/"
          className="font-display text-lg font-bold tracking-tight text-white hover:text-lors-glow"
        >
          {siteContent.companyName}
        </Link>
        <ul className="flex items-center gap-1 sm:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className="rounded-lg px-2 py-1.5 text-xs font-medium text-white/75 transition hover:bg-white/5 hover:text-lors-glow sm:px-3 sm:text-sm"
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
