import { useEffect, useState, useRef } from "react";

export function GalaxyAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A royalty-free space ambient drone / wind sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.loop = true;
    audio.volume = 0.4; // Soft background volume
    audioRef.current = audio;

    const playAudio = () => {
      if (!isPlaying) {
        audio.play().then(() => setIsPlaying(true)).catch((e) => console.log("Audio play blocked by browser:", e));
      }
    };

    // Try playing immediately (might work if user already interacted with site)
    playAudio();

    // Attach listeners for first interaction to bypass autoplay policies
    window.addEventListener("click", playAudio, { once: true });
    window.addEventListener("scroll", playAudio, { once: true });
    window.addEventListener("touchstart", playAudio, { once: true });
    window.addEventListener("keydown", playAudio, { once: true });

    return () => {
      audio.pause();
      window.removeEventListener("click", playAudio);
      window.removeEventListener("scroll", playAudio);
      window.removeEventListener("touchstart", playAudio);
      window.removeEventListener("keydown", playAudio);
    };
  }, [isPlaying]);

  return null;
}
