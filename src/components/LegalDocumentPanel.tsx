import type { LegalDocument } from "../content";

type LegalDocumentPanelProps = {
  document: LegalDocument;
  compact?: boolean;
  titleId?: string;
};

type LegalBullet = {
  title: string;
  body: string;
};

type LegalSubsection = {
  title: string;
  body: string;
};

type LegalSection = LegalDocument["sections"][number];

function renderBullets(bullets: LegalBullet[], compact: boolean) {
  return (
    <ul className={`space-y-3 ${compact ? "mt-2" : "mt-4"}`}>
      {bullets.map((item) => (
        <li key={item.title} className="text-left">
          <p
            className={`font-semibold text-white/90 ${
              compact ? "text-[11px]" : "text-sm"
            }`}
          >
            {item.title}
          </p>
          <p
            className={`mt-1 leading-relaxed text-white/65 ${
              compact ? "text-[10px] leading-snug" : "text-sm"
            }`}
          >
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

function renderSubsections(subsections: LegalSubsection[], compact: boolean) {
  return (
    <div className={`space-y-3 ${compact ? "mt-2" : "mt-4"}`}>
      {subsections.map((item) => (
        <div key={item.title} className="text-left">
          <p
            className={`font-semibold text-lors-glow/90 ${
              compact ? "text-[11px]" : "text-sm"
            }`}
          >
            {item.title}
          </p>
          <p
            className={`mt-1 leading-relaxed text-white/65 ${
              compact ? "text-[10px] leading-snug" : "text-sm"
            }`}
          >
            {item.body}
          </p>
        </div>
      ))}
    </div>
  );
}

function renderSection(section: LegalSection, compact: boolean) {
  const bodyClass =
    section.emphasis === "legal"
      ? compact
        ? "text-[10px] font-medium uppercase leading-snug tracking-wide text-white/75"
        : "text-xs font-medium uppercase leading-relaxed tracking-wide text-white/75 sm:text-sm"
      : compact
        ? "text-[10px] leading-snug text-white/65"
        : "text-sm leading-relaxed text-white/65";

  return (
    <article
      key={section.title}
      className={`legal-section rounded-xl border border-white/8 bg-white/[0.02] ${
        compact ? "p-3" : "p-4 sm:p-5"
      }`}
    >
      <h3
        className={`font-display font-semibold text-white ${
          compact ? "text-sm" : "text-base sm:text-lg"
        }`}
      >
        {section.title}
      </h3>

      {section.intro && (
        <p className={`mt-2 ${bodyClass}`}>{section.intro}</p>
      )}

      {section.body && (
        <p className={`${section.intro ? "mt-2" : "mt-2"} ${bodyClass}`}>
          {section.body}
        </p>
      )}

      {section.bullets && renderBullets(section.bullets, compact)}
      {section.subsections && renderSubsections(section.subsections, compact)}

      {section.contact && (
        <div
          className={`mt-3 rounded-lg border border-lors-glow/20 bg-lors-accent/5 ${
            compact ? "p-2.5" : "p-4"
          }`}
        >
          <p
            className={`font-semibold text-white/90 ${
              compact ? "text-[11px]" : "text-sm"
            }`}
          >
            {section.contact.label}
          </p>
          <a
            href={`mailto:${section.contact.email}`}
            className={`mt-1 inline-block text-lors-glow transition hover:text-lors-accent hover:underline ${
              compact ? "text-[10px]" : "text-sm"
            }`}
          >
            {section.contact.email}
          </a>
        </div>
      )}
    </article>
  );
}

export function LegalDocumentPanel({
  document,
  compact = false,
  titleId,
}: LegalDocumentPanelProps) {
  return (
    <div className={`legal-document-panel flex flex-col ${compact ? "gap-3" : "gap-5"}`}>
      <header className="text-left">
        <p
          className={`font-semibold uppercase tracking-[0.25em] text-lors-glow/80 ${
            compact ? "text-[9px]" : "text-xs"
          }`}
        >
          Legal
        </p>
        <h2
          id={titleId}
          className={`font-display font-bold text-white ${
            compact ? "text-xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {document.title}
        </h2>
        <p className={`mt-1 text-white/50 ${compact ? "text-[10px]" : "text-xs"}`}>
          Last Updated: {document.lastUpdated}
        </p>
        <p
          className={`mt-3 leading-relaxed text-white/70 ${
            compact ? "text-[10px] leading-snug" : "text-sm sm:text-base"
          }`}
        >
          {document.intro}
        </p>
      </header>

      <div className={`flex flex-col ${compact ? "gap-2.5" : "gap-4"}`}>
        {document.sections.map((section) => renderSection(section, compact))}
      </div>
    </div>
  );
}
