import { careersContent, careersFormUrl } from "../content";

type CareersPanelProps = { compact?: boolean };

export function CareersPanel({ compact = false }: CareersPanelProps) {
  const formUrl = careersFormUrl();

  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-8"}`}>
      <p
        className={`leading-relaxed text-white/70 ${
          compact ? "text-xs leading-snug" : "text-sm sm:text-base"
        }`}
      >
        {careersContent.body}
      </p>

      {careersContent.highlights.length > 0 && (
        <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
          {careersContent.highlights.map((h) => (
            <li
              key={h.title}
              className={`nexus-card ${compact ? "p-3" : "p-4"}`}
            >
              <h4
                className={`font-display font-semibold text-lors-glow leading-tight ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {h.title}
              </h4>
              <p
                className={`mt-1.5 leading-relaxed text-white/60 ${
                  compact ? "text-[10px] leading-snug" : "text-xs"
                }`}
              >
                {h.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {careersContent.roleTracks.length > 0 && (
        <div>
          <p
            className={`panel-eyebrow mb-3 ${
              compact ? "text-[9px]" : "text-[10px]"
            }`}
          >
            Open tracks
          </p>
          <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
            {careersContent.roleTracks.map((t) => (
              <li
                key={t.title}
                className={`nexus-card--accent ${compact ? "p-3" : "p-4"}`}
              >
                <h5
                  className={`font-display font-semibold text-white leading-tight ${
                    compact ? "text-sm" : "text-base"
                  }`}
                >
                  {t.title}
                </h5>
                <p
                  className={`mt-1.5 leading-relaxed text-white/60 ${
                    compact ? "text-[10px] leading-snug" : "text-sm"
                  }`}
                >
                  {t.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formUrl ? (
        <button
          type="button"
          onClick={() => window.open(formUrl, "_blank", "noopener,noreferrer")}
          className={`inline-flex w-fit items-center justify-center rounded-full bg-lors-rose font-display font-semibold text-lors-navy shadow-lg transition hover:opacity-85 hover:-translate-y-0.5 ${
            compact ? "min-h-[40px] px-6 py-2 text-sm" : "min-h-[48px] px-8 py-3 text-sm"
          }`}
        >
          Open application form
        </button>
      ) : (
        <p className={`text-white/45 ${compact ? "text-xs" : "text-sm"}`}>
          Set{" "}
          <code className="text-lors-glow/70 rounded px-1 py-0.5 bg-white/5 text-[11px]">
            VITE_CAREERS_FORM_URL
          </code>{" "}
          to enable the application form.
        </p>
      )}
    </div>
  );
}
