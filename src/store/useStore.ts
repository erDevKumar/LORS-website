import { create } from "zustand";
import type { PanelScrollState } from "../utils/galaxyPanelScroll";

export type QualityTier = "ultra" | "standard" | "fallback";

interface AppState {
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;
  activeAct: number;
  setActiveAct: (act: number) => void;
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  scrollIndex: number;
  setScrollIndex: (index: number) => void;
  prefersReducedMotion: boolean;
  setPrefersReducedMotion: (reduced: boolean) => void;
  panelScrollState: PanelScrollState;
  setPanelScrollState: (state: PanelScrollState) => void;
}

export const useStore = create<AppState>((set) => ({
  qualityTier: "ultra",
  setQualityTier: (tier) => set({ qualityTier: tier }),
  activeAct: 0,
  setActiveAct: (act) => set({ activeAct: act }),
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  scrollIndex: 0,
  setScrollIndex: (index) => set({ scrollIndex: index }),
  prefersReducedMotion: false,
  setPrefersReducedMotion: (reduced) => set({ prefersReducedMotion: reduced }),
  panelScrollState: { atTop: true, atBottom: true, canScroll: false },
  setPanelScrollState: (state) => set({ panelScrollState: state }),
}));
