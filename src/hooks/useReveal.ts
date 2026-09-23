"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reproduz o reveal do Coelho da Fonseca:
 * opacity-0 translate-y-4 -> opacity-100 translate-y-0 em 700ms.
 * Dispara uma unica vez por secao.
 *
 * prefers-reduced-motion e tratado no globals.css, que zera a duracao da
 * transicao — o conteudo aparece instantaneamente, sem deslocamento.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // sem suporte a IntersectionObserver, o conteudo nao pode ficar invisivel
    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
