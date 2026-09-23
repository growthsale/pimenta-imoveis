"use client";

import { useReveal } from "@/hooks/useReveal";

type Props = {
  children: React.ReactNode;
  /** classes extras na <section>, ex.: "bg-white" ou "bg-shark" */
  className?: string;
  /** remove o container interno quando a secao precisa sangrar ate a borda */
  bleed?: boolean;
  id?: string;
};

/**
 * Wrapper padrao das secoes, espelhando o Coelho da Fonseca:
 * w-full py-12 md:py-16 + ds-container + reveal de 700ms.
 */
export default function SectionWrapper({ children, className = "", bleed = false, id }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();

  return (
    <section
      id={id}
      ref={ref}
      className={`w-full py-12 md:py-16 transition-all duration-700 ease-out will-change-[transform,opacity] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {bleed ? children : <div className="ds-container">{children}</div>}
    </section>
  );
}
