import { useEffect } from "react";
import { useStore } from "../store/useStore";

export function useQualityTier() {
  const { qualityTier, setQualityTier, setPrefersReducedMotion } = useStore();

  useEffect(() => {
    // 1. Check for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const reduced = e.matches;
      setPrefersReducedMotion(reduced);
      if (reduced) {
        setQualityTier("fallback");
      }
    };
    
    // Set initial
    handleMotionChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Check WebGL availability
    const checkWebGL = (): boolean => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl2") ||
            canvas.getContext("webgl") ||
            canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    if (qualityTier !== "fallback") {
      const hasWebGL = checkWebGL();
      if (!hasWebGL) {
        setQualityTier("fallback");
      } else {
        // 3. Check if mobile/tablet to limit effects
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) ||
          window.innerWidth < 1024 ||
          navigator.maxTouchPoints > 1;

        if (isMobile) {
          setQualityTier("standard");
        } else {
          setQualityTier("ultra");
        }
      }
    }

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [setQualityTier, setPrefersReducedMotion, qualityTier]);

  return qualityTier;
}
