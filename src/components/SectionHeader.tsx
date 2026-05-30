type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  titleId?: string;
  compact?: boolean;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  titleId,
  compact = false,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={className}>
      <p
        className={`font-semibold uppercase tracking-[0.3em] text-lors-glow/80 ${
          compact ? "text-[10px]" : "text-xs"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        id={titleId}
        className={`section-heading mt-2 ${compact ? "!text-2xl sm:!text-3xl" : ""}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`section-sub ${compact ? "!text-sm !leading-relaxed" : ""}`}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
