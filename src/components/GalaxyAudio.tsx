import { useEffect, useRef } from "react";

export function GalaxyAudio() {
  const playedRef = useRef(false);

  useEffect(() => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.loop = true;
    audio.volume = 0.4;

    const tryPlay = () => {
      if (playedRef.current) return;
      audio.play()
        .then(() => { playedRef.current = true; })
        .catch(() => {});
    };

    tryPlay();

    window.addEventListener("click", tryPlay, { once: true });
    window.addEventListener("scroll", tryPlay, { once: true });
    window.addEventListener("touchstart", tryPlay, { once: true });
    window.addEventListener("keydown", tryPlay, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("scroll", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, []);

  return null;
}
