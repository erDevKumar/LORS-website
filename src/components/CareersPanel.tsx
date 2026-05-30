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
    <div className={`flex flex-col ${compact ? "gap-4" : "gap-6"}`}>
      <p
        className={`leading-relaxed text-white/75 ${
          compact ? "text-xs leading-snug" : "text-sm sm:text-base"
        }`}
      >
        {careersContent.body}
      </p>

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
