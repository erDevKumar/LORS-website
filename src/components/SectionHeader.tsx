type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  titleId?: string;
  compact?: boolean;
  className?: string;
  accent?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  titleId,
  compact = false,
  className = "",
  accent = false,
}: SectionHeaderProps) {
  return (
    <header className={`${className}`}>
      {eyebrow && (
        <p
          className={`panel-eyebrow mb-2 ${accent ? "panel-accent" : "text-lors-glow/80"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={titleId}
        className={`section-heading break-words [text-wrap:balance] ${eyebrow ? "" : ""} ${
          compact ? "!text-xl sm:!text-2xl" : ""
        }`}
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
