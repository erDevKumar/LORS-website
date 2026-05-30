import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { CARD_COUNT } from "../experience/galaxyLayout";
import {
  applyPanelPageScroll,
  applyPanelWheelScroll,
  canScrollPanelInDirection,
  CARD_HANDOFF_TOUCH_THRESHOLD,
  CARD_HANDOFF_WHEEL_THRESHOLD,
  getPanelScrollRootForAct,
  getPanelScrollRootFromTarget,
  isAtScrollBoundary,
  isPanelScrollable,
  resetPanelScrollForAct,
  shouldHandoffToCarousel,
} from "../utils/galaxyPanelScroll";

/**
 * Looping carousel navigation for the galaxy (WebGL) experience.
 *
 * Long panels scroll internally first; the carousel advances only when the
 * active panel is scrolled to its top or bottom boundary and the user
 * deliberately overscrolls past the resistance threshold.
 */
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

    let targetIndex = clampWrap(Math.round(window.scrollY / vh()));

    let locked = false;
    let unlockTimer = 0;
    let settleTimer = 0;
    let touchStartY = 0;
    let touchScrollRoot: HTMLElement | null = null;
    let touchGestureIsPanelScroll = false;
    let wheelLatched = false;
    let wheelIdleTimer = 0;
    let boundaryOverscroll = 0;

    const activeScrollRoot = () => getPanelScrollRootForAct(targetIndex);

    const resetBoundaryOverscroll = () => {
      boundaryOverscroll = 0;
    };

    const schedulePanelReset = (act: number) => {
      window.requestAnimationFrame(() => {
        resetPanelScrollForAct(act);
      });
    };

    const goTo = (rawIndex: number) => {
      const index = clampWrap(rawIndex);
      const isWrap = Math.abs(index - targetIndex) > 1;
      const previousIndex = targetIndex;
      targetIndex = index;
      resetBoundaryOverscroll();
      locked = true;
      window.scrollTo({ top: index * vh(), behavior: isWrap ? "auto" : behavior });
      if (index !== previousIndex) {
        schedulePanelReset(index);
      }
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

    const tryPanelWheelScroll = (e: WheelEvent, direction: 1 | -1): boolean => {
      if (!isPanelScrollable(targetIndex)) return false;
      const root = activeScrollRoot();
      if (!root || !canScrollPanelInDirection(root, direction)) return false;

      e.preventDefault();
      applyPanelWheelScroll(root, e.deltaY);
      resetBoundaryOverscroll();
      return true;
    };

    const tryBoundaryWheelHandoff = (e: WheelEvent, direction: 1 | -1): boolean => {
      if (!isPanelScrollable(targetIndex)) return false;
      const root = activeScrollRoot();
      if (!root || !isAtScrollBoundary(root, direction)) return false;

      e.preventDefault();
      const { handoff, nextOverscroll } = shouldHandoffToCarousel(
        boundaryOverscroll,
        e.deltaY,
        CARD_HANDOFF_WHEEL_THRESHOLD
      );
      boundaryOverscroll = nextOverscroll;

      if (handoff && !wheelLatched && !locked && Math.abs(e.deltaY) >= 4) {
        wheelLatched = true;
        step(direction);
      }
      return true;
    };

    const tryPanelKeyScroll = (direction: 1 | -1): boolean => {
      if (!isPanelScrollable(targetIndex)) return false;
      const root = activeScrollRoot();
      if (!root || !canScrollPanelInDirection(root, direction)) return false;
      applyPanelPageScroll(root, direction);
      resetBoundaryOverscroll();
      return true;
    };

    const onScroll = () => {
      if (locked) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (!locked) {
          const nextIndex = clampWrap(Math.round(window.scrollY / vh()));
          if (nextIndex !== targetIndex) {
            targetIndex = nextIndex;
            resetBoundaryOverscroll();
            schedulePanelReset(nextIndex);
          }
        }
      }, 120);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => {
        wheelLatched = false;
        resetBoundaryOverscroll();
      }, 220);

      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;

      if (tryPanelWheelScroll(e, direction)) {
        return;
      }

      if (tryBoundaryWheelHandoff(e, direction)) {
        return;
      }

      e.preventDefault();

      if (wheelLatched || locked) return;
      if (Math.abs(e.deltaY) < 4) return;

      wheelLatched = true;
      step(direction);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
      touchScrollRoot =
        getPanelScrollRootFromTarget(e.target) ?? activeScrollRoot();
      touchGestureIsPanelScroll = false;

      if (touchScrollRoot && isPanelScrollable(targetIndex)) {
        const canScroll = touchScrollRoot.scrollHeight > touchScrollRoot.clientHeight + 2;
        touchGestureIsPanelScroll = canScroll;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchScrollRoot || !touchGestureIsPanelScroll) {
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - currentY;
      const direction: 1 | -1 = dy > 0 ? 1 : -1;

      if (canScrollPanelInDirection(touchScrollRoot, direction)) {
        resetBoundaryOverscroll();
        return;
      }

      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      const endY = e.changedTouches[0]?.clientY ?? touchStartY;
      const dy = touchStartY - endY;
      const direction: 1 | -1 = dy > 0 ? 1 : -1;
      const root = touchScrollRoot ?? activeScrollRoot();

      const atBoundary = root && isPanelScrollable(targetIndex)
        ? isAtScrollBoundary(root, direction)
        : false;
      const swipeThreshold = atBoundary ? CARD_HANDOFF_TOUCH_THRESHOLD : 45;

      if (Math.abs(dy) < swipeThreshold) {
        touchScrollRoot = null;
        touchGestureIsPanelScroll = false;
        return;
      }

      if (
        root &&
        isPanelScrollable(targetIndex) &&
        canScrollPanelInDirection(root, direction)
      ) {
        touchScrollRoot = null;
        touchGestureIsPanelScroll = false;
        return;
      }

      step(direction);
      touchScrollRoot = null;
      touchGestureIsPanelScroll = false;
      resetBoundaryOverscroll();
    };

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        if (!tryPanelKeyScroll(1)) step(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        if (!tryPanelKeyScroll(-1)) step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(CARD_COUNT - 1);
      }
    };

    const onResize = () => {
      if (!locked) {
        window.scrollTo({ top: targetIndex * vh(), behavior: "auto" });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(unlockTimer);
      window.clearTimeout(wheelIdleTimer);
      window.clearTimeout(settleTimer);
    };
  }, [qualityTier]);

  return null;
}
