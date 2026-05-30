import { careersContent, careersFormUrl } from "../content";

type CareersPanelProps = {
  compact?: boolean;
};

export function CareersPanel({ compact = false }: CareersPanelProps) {
  const formUrl = careersFormUrl();

  const handleOpenForm = () => {
    if (formUrl) {
      window.open(formUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-8"}`}>
      <p
        className={`leading-relaxed text-white/75 ${
          compact ? "text-xs leading-snug" : "text-sm sm:text-base"
        }`}
      >
        {careersContent.body}
      </p>

      {careersContent.highlights.length > 0 && (
        <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
          {careersContent.highlights.map((item) => (
            <li
              key={item.title}
              className={`rounded-xl border border-white/10 bg-lors-deep/60 backdrop-blur-sm transition hover:border-lors-accent/40 ${
                compact ? "p-3" : "p-4"
              }`}
            >
              <h4
                className={`font-display font-semibold text-lors-glow ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {item.title}
              </h4>
              <p
                className={`mt-1.5 leading-relaxed text-white/65 ${
                  compact ? "text-[11px] leading-snug" : "text-xs"
                }`}
              >
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {careersContent.roleTracks.length > 0 && (
        <div>
          <h4
            className={`font-display font-semibold text-lors-glow ${
              compact ? "mb-2 text-sm" : "mb-3 text-base"
            }`}
          >
            Open tracks
          </h4>
          <ul className={`grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}>
            {careersContent.roleTracks.map((track) => (
              <li
                key={track.title}
                className={`rounded-xl border border-lors-glow/20 bg-lors-accent/5 ${
                  compact ? "p-3" : "p-4"
                }`}
              >
                <h5
                  className={`font-display font-semibold text-white ${
                    compact ? "text-sm" : "text-base"
                  }`}
                >
                  {track.title}
                </h5>
                <p
                  className={`mt-1.5 leading-relaxed text-white/65 ${
                    compact ? "text-[11px] leading-snug" : "text-sm"
                  }`}
                >
                  {track.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formUrl ? (
        <button
          type="button"
          onClick={handleOpenForm}
          className={`inline-flex w-fit items-center justify-center rounded-full bg-lors-accent font-semibold text-white shadow-lg shadow-lors-accent/25 transition hover:bg-lors-glow hover:text-lors-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lors-glow ${
            compact ? "min-h-[40px] px-6 py-2 text-sm" : "min-h-[48px] px-8 py-3 text-sm"
          }`}
        >
          Open application form
        </button>
      ) : (
        <p className={`text-white/50 ${compact ? "text-xs" : "text-sm"}`}>
          Application form URL not configured. Set{" "}
          <code className="text-lors-glow/80">VITE_CAREERS_FORM_URL</code> in your
          environment.
        </p>
      )}
    </div>
  );
}
