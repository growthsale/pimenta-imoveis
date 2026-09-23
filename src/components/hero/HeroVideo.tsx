"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  poster?: string;
};

/**
 * Vídeo de fundo do hero, no padrão .ds-hero-video do Coelho:
 * object-fit:cover, 100% x 100%.
 * Com prefers-reduced-motion o autoplay é suprimido e fica só o poster.
 */
export default function HeroVideo({ src, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setReducedMotion(query.matches);
      const video = videoRef.current;
      if (!video) return;

      if (query.matches) {
        video.pause();
      } else {
        // alguns navegadores recusam o autoplay silenciosamente
        video.play().catch(() => undefined);
      }
    };

    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return (
    <div className="ds-hero-media">
      <video
        ref={videoRef}
        className="ds-hero-video"
        src={src}
        poster={poster}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="ds-hero-gradient" aria-hidden="true" />
    </div>
  );
}
