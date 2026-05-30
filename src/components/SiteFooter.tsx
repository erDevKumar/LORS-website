import { contactEmail, siteContent } from "../content";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-lors-navy px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center text-sm text-white/45">
        <p className="text-white/55">Part of the {siteContent.companyName} ecosystem</p>
        <p>
          &copy; {siteContent.year} {siteContent.companyName}. All rights reserved.
        </p>
        <p>
          <a
            href={`mailto:${contactEmail()}`}
            className="text-lors-glow/80 transition hover:text-lors-glow"
          >
            {contactEmail()}
          </a>
          <span className="mx-2 text-white/20">·</span>
          <span>{siteContent.domain}</span>
        </p>
      </div>
    </footer>
  );
}
