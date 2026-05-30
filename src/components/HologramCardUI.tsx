export interface HologramPanelData {
  id: string;
  label: string;
  title: string;
  description: string;
}

interface HologramCardUIProps {
  panel: HologramPanelData;
}

export function HologramCardUI({ panel }: HologramCardUIProps) {
  return (
    <div className="flex w-full h-full flex-col items-center justify-center p-12 text-center">
      {/* Subtle scanline overlay for the card specifically */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />
      
      {/* Glowing accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-lors-glow/20 blur-[80px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-lors-accent/20 blur-[80px] rounded-full mix-blend-screen" />

      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl gap-8">
        <span className="inline-flex items-center rounded-full border border-lors-glow/30 bg-lors-glow/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-lors-glow shadow-[0_0_15px_rgba(0,221,255,0.3)]">
          {panel.label}
        </span>
        
        <h2 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {panel.title}
        </h2>
        
        <p className="text-xl leading-relaxed text-white/80 max-w-xl font-medium">
          {panel.description}
        </p>

        {panel.id === "hero" && (
          <div className="mt-4 flex gap-4">
            <div className="h-1 w-12 bg-lors-glow/50 rounded-full animate-pulse" />
            <div className="h-1 w-12 bg-lors-glow/30 rounded-full" />
            <div className="h-1 w-12 bg-lors-glow/10 rounded-full" />
          </div>
        )}
      </div>
      
      {/* Decorative corners */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-lors-glow/40" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-lors-glow/40" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-lors-glow/40" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-lors-glow/40" />
    </div>
  );
}
