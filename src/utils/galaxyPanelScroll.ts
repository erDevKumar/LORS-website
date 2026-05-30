import { BODIES } from "../experience/galaxyLayout";

const SCROLL_EPSILON = 2;

/** Accumulated wheel delta at scroll boundary before advancing carousel. */
export const CARD_HANDOFF_WHEEL_THRESHOLD = 160;

/** Swipe distance at scroll boundary before advancing carousel. */
export const CARD_HANDOFF_TOUCH_THRESHOLD = 80;

export type PanelScrollState = {
  atTop: boolean;
  atBottom: boolean;
  canScroll: boolean;
};

export function getActForBodyId(panelId: string): number | undefined {
  return BODIES.find((body) => body.id === panelId)?.act;
}

export function getBodyIdForAct(act: number): string | undefined {
  return BODIES.find((body) => body.act === act)?.id;
}

export function isPanelScrollable(act: number): boolean {
  const body = BODIES.find((b) => b.act === act);
  if (!body) return false;
  return body.scrollable !== false;
}

export function getPanelScrollRootForAct(act: number): HTMLElement | null {
  const bodyId = getBodyIdForAct(act);
  if (!bodyId || !isPanelScrollable(act)) return null;
  return document.querySelector<HTMLElement>(
    `[data-galaxy-panel-id="${bodyId}"] [data-galaxy-scroll-root]`
  );
}

export function getPanelScrollRootFromTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  return target.closest<HTMLElement>("[data-galaxy-scroll-root]");
}

export function getPanelScrollState(el: HTMLElement): PanelScrollState {
  const { scrollTop, scrollHeight, clientHeight } = el;
  const canScroll = scrollHeight > clientHeight + SCROLL_EPSILON;
  const atTop = scrollTop <= SCROLL_EPSILON;
  const atBottom = scrollTop + clientHeight >= scrollHeight - SCROLL_EPSILON;
  return { atTop, atBottom, canScroll };
}

export function isAtScrollBoundary(el: HTMLElement, direction: 1 | -1): boolean {
  const state = getPanelScrollState(el);
  if (!state.canScroll) return true;
  return direction > 0 ? state.atBottom : state.atTop;
}

export function canScrollPanelInDirection(
  el: HTMLElement,
  direction: 1 | -1
): boolean {
  const state = getPanelScrollState(el);
  if (!state.canScroll) return false;
  return direction > 0 ? !state.atBottom : !state.atTop;
}

export function shouldHandoffToCarousel(
  boundaryOverscroll: number,
  delta: number,
  threshold = CARD_HANDOFF_WHEEL_THRESHOLD
): { handoff: boolean; nextOverscroll: number } {
  const nextOverscroll = boundaryOverscroll + Math.abs(delta);
  return {
    handoff: nextOverscroll >= threshold,
    nextOverscroll: nextOverscroll >= threshold ? 0 : nextOverscroll,
  };
}

export function applyPanelWheelScroll(el: HTMLElement, deltaY: number): void {
  el.scrollTop += deltaY;
}

export function applyPanelPageScroll(el: HTMLElement, direction: 1 | -1): void {
  const amount = Math.max(120, Math.floor(el.clientHeight * 0.8));
  el.scrollTop += direction * amount;
}

export function resetPanelScrollForAct(act: number): void {
  const root = getPanelScrollRootForAct(act);
  if (!root) return;
  root.scrollTop = 0;
  updatePanelScrollClasses(root);
}

export function updatePanelScrollClasses(el: HTMLElement): PanelScrollState {
  const state = getPanelScrollState(el);
  el.classList.toggle("galaxy-scroll-root-at-top", state.atTop || !state.canScroll);
  el.classList.toggle("galaxy-scroll-root-at-bottom", state.atBottom || !state.canScroll);
  el.classList.toggle("galaxy-scroll-root-can-scroll", state.canScroll);
  return state;
}
