import type { ReactNode } from "react";
import { useGalaxyPanelScroll } from "../hooks/useGalaxyPanelScroll";

type GalaxyScrollRootProps = {
  panelId: string;
  children: ReactNode;
  className?: string;
  showScrollHint?: boolean;
};

export function GalaxyScrollRoot({
  panelId,
  children,
  className = "",
  showScrollHint = false,
}: GalaxyScrollRootProps) {
  const { scrollRef, canScroll, atTop, atBottom, hintVisible } =
    useGalaxyPanelScroll(panelId, showScrollHint);

  return (
    <div className="galaxy-scroll-root-wrap relative h-full w-full min-h-0">
      <div
        ref={scrollRef}
        data-galaxy-scroll-root
        className={[
          "hologram-panel-scroll galaxy-scroll-root flex h-full w-full min-h-0 flex-col",
          className,
          canScroll && !atTop ? "galaxy-scroll-root-at-top" : "",
          canScroll && !atBottom ? "galaxy-scroll-root-at-bottom" : "",
          canScroll ? "galaxy-scroll-root-can-scroll" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>

      {/* Scroll fade edges */}
      {canScroll && !atTop && (
        <div
          className="galaxy-scroll-fade galaxy-scroll-fade--top pointer-events-none absolute inset-x-0 top-0 z-10 h-8"
          aria-hidden
        />
      )}
      {canScroll && !atBottom && (
        <div
          className="galaxy-scroll-fade galaxy-scroll-fade--bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10"
          aria-hidden
        />
      )}

      {/* Scroll hint chip */}
      {hintVisible && canScroll && (
        <p
          className="galaxy-scroll-hint pointer-events-none absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-lors-navy/85 px-3 py-1 text-[9px] font-semibold uppercase tracking-widest text-white/50"
          aria-hidden
        >
          Scroll to read
        </p>
      )}
    </div>
  );
}
