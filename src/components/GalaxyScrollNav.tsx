import { useEffect } from "react";
import { useStore } from "../store/useStore";

/**
 * Looping carousel navigation for the galaxy (WebGL) experience.
 *
 * The 7 scroll-driver sections map 1:1 to the orbital cards. This controller
 * intercepts wheel / touch / keyboard input and moves exactly one card per
 * gesture, wrapping around the ends so the cards "circle up again":
 *   - scrolling down past the last card -> first card
 *   - scrolling up past the first card  -> last card
 *
 * In fallback (no-WebGL) mode this does nothing and native scrolling is used.
 */
const CARD_COUNT = 7;

export function GalaxyScrollNav() {
  const qualityTier = useStore((state) => state.qualityTier);

  useEffect(() => {
    if (qualityTier === "fallback") return;
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    const vh = () => window.innerHeight || 1;
    const clampWrap = (i: number) => ((i % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;

    // Logical target card. This is the single source of truth for navigation and
    // is deliberately decoupled from the live (possibly mid-animation) scrollY,
    // so a new gesture always advances from the *intended* card, never from a
    // fractional in-flight position.
    let targetIndex = clampWrap(Math.round(window.scrollY / vh()));

    let locked = false;
    let unlockTimer = 0;
    let settleTimer = 0;
    let touchStartY = 0;
    // Per-gesture latch: a single trackpad fling emits a long stream of wheel
    // events. We act once on the first event, then ignore the rest until the
    // stream goes quiet (momentum ends), so one fling = one card.
    let wheelLatched = false;
    let wheelIdleTimer = 0;

    const goTo = (rawIndex: number) => {
      const index = clampWrap(rawIndex);
      // Adjacent moves animate smoothly; a wrap (last->first / first->last) jumps
      // instantly so the carousel doesn't slowly rewind through every card.
      const isWrap = Math.abs(index - targetIndex) > 1;
      targetIndex = index;
      locked = true;
      window.scrollTo({ top: index * vh(), behavior: isWrap ? "auto" : behavior });
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(
        () => {
          locked = false;
        },
        reduceMotion || isWrap ? 220 : 620
      );
    };

    const step = (dir: number) => {
      if (locked) return;
      goTo(targetIndex + dir);
    };

    // Keep the logical index in sync when the page is moved outside this
    // controller (nav anchor links, scrollbar drag), but only once scrolling
    // has actually settled — never mid-animation.
    const onScroll = () => {
      if (locked) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!locked) targetIndex = clampWrap(Math.round(window.scrollY / vh()));
      }, 120);
    };

    const onWheel = (e: WheelEvent) => {
      // Ignore predominantly-horizontal gestures (trackpad swipes).
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();

      // Re-arm the latch only after the wheel/momentum stream is idle. As long
      // as momentum keeps firing events this timer keeps resetting, so the
      // gesture stays latched and can't trigger a second card switch.
      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => {
        wheelLatched = false;
      }, 220);

      if (wheelLatched || locked) return;
      if (Math.abs(e.deltaY) < 4) return;

      wheelLatched = true;
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      // We drive navigation ourselves, so suppress native panning.
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - endY;
      if (Math.abs(dy) < 45) return;
      step(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(CARD_COUNT - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(unlockTimer);
      window.clearTimeout(wheelIdleTimer);
      window.clearTimeout(settleTimer);
    };
  }, [qualityTier]);

  return null;
}
