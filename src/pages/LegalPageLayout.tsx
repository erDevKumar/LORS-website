import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { siteContent } from "../content";

type LegalPageLayoutProps = {
  children: ReactNode;
};

export function LegalPageLayout({ children }: LegalPageLayoutProps) {
  return (
    <div className="legal-page min-h-screen bg-lors-navy text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-lors-navy/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="font-display text-lg font-bold tracking-tight text-white transition hover:text-lors-glow"
          >
            {siteContent.companyName}
          </Link>
          <Link
            to="/"
            className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/75 transition hover:border-lors-glow/50 hover:text-lors-glow sm:text-sm"
          >
            Back to site
          </Link>
        </div>
      </header>
      <main className="legal-page-main mx-auto max-w-4xl px-4 py-10 pb-20 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
