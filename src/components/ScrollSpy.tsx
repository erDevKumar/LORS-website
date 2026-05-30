import { useEffect } from "react";
import { useStore } from "../store/useStore";
import { MAX_ACT } from "../experience/galaxyLayout";

export function ScrollSpy() {
  const setScrollProgress = useStore((state) => state.setScrollProgress);
  const setActiveAct = useStore((state) => state.setActiveAct);

  useEffect(() => {
    let active = true;
    
    const handleScroll = () => {
      if (!active) return;
      
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight <= 0 ? 0 : scrollY / docHeight;
      
      setScrollProgress(progress);
      
      // Calculate exact section index based on viewport height (since sections are 100vh)
      // Calculate exact section index based on viewport height (since sections are 100vh)
      const exactIndex = scrollY / window.innerHeight;
      useStore.getState().setScrollIndex(exactIndex);

      // Determine active act using precise rounding
      const act = Math.min(MAX_ACT, Math.max(0, Math.round(exactIndex)));
      
      setActiveAct(act);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once initially
    handleScroll();

    return () => {
      active = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setScrollProgress, setActiveAct]);

  return null;
}
