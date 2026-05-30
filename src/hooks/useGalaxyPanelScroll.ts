import { useCallback, useEffect, useRef, useState } from "react";
import { useStore } from "../store/useStore";
import {
  getActForBodyId,
  resetPanelScrollForAct,
  updatePanelScrollClasses,
} from "../utils/galaxyPanelScroll";

export function useGalaxyPanelScroll(panelId: string, showHint = false) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hintDismissedRef = useRef(!showHint);
  const wasActiveRef = useRef(false);
  const panelAct = getActForBodyId(panelId);
  const activeAct = useStore((state) => state.activeAct);
  const setPanelScrollState = useStore((state) => state.setPanelScrollState);
  const [canScroll, setCanScroll] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(true);
  const [hintVisible, setHintVisible] = useState(showHint);

  const sync = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const state = updatePanelScrollClasses(el);
    setCanScroll(state.canScroll);
    setAtTop(state.atTop);
    setAtBottom(state.atBottom);
    setPanelScrollState(state);
  }, [setPanelScrollState]);

  const resetScrollAndHint = useCallback(() => {
    if (panelAct === undefined) return;
    resetPanelScrollForAct(panelAct);
    sync();
    if (showHint) {
      hintDismissedRef.current = false;
      setHintVisible(true);
    }
  }, [panelAct, showHint, sync]);

  useEffect(() => {
    if (panelAct === undefined) return;

    let timer = 0;
    const isActive = activeAct === panelAct;
    
    if (isActive && !wasActiveRef.current) {
      resetScrollAndHint();
    } else if (!isActive && wasActiveRef.current) {
      timer = window.setTimeout(() => {
        resetScrollAndHint();
      }, 800);
    }
    
    wasActiveRef.current = isActive;
    return () => window.clearTimeout(timer);
  }, [activeAct, panelAct, resetScrollAndHint]);

  useEffect(() => {
    sync();
    const el = scrollRef.current;
    if (!el) return;

    const dismissHint = () => {
      if (!hintDismissedRef.current) {
        hintDismissedRef.current = true;
        setHintVisible(false);
      }
    };

    const onScroll = () => {
      dismissHint();
      sync();
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);

    let hintTimer = 0;
    if (showHint) {
      hintTimer = window.setTimeout(dismissHint, 3000);
    }

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.clearTimeout(hintTimer);
    };
  }, [showHint, sync]);

  return { scrollRef, canScroll, atTop, atBottom, hintVisible };
}
