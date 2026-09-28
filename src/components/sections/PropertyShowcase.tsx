"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import PropertyCard from "@/components/property/PropertyCard";
import { badgesDe } from "@/lib/badges";
import type { Property } from "@/types/property";

type Props = { imoveis: Property[] };

/**
 * Carrossel de destaques. Os cards sao os mesmos da busca (PropertyCard), com o
 * carrossel de fotos desligado para nao disputar o arrasto com o embla.
 */
export default function PropertyShowcase({ imoveis }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", onSelect).on("reInit", onSelect);
    // estado inicial fora do corpo do efeito, para nao encadear renders
    const frame = requestAnimationFrame(onSelect);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <SectionWrapper className="bg-white">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="flex items-center gap-3">
            <span className="ds-rule" aria-hidden="true" />
            <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-shark">
              Destaques
            </span>
          </h2>
          <p className="mt-5 font-serif text-[28px] font-medium leading-tight text-shark md:text-[34px]">
            Acabaram de chegar e merecem sua atenção
          </p>
        </div>

        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            aria-label="Imóveis anteriores"
            className="ds-btn-secondary h-11 w-11 px-0 disabled:opacity-30"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            aria-label="Próximos imóveis"
            className="ds-btn-secondary h-11 w-11 px-0 disabled:opacity-30"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
              <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8 overflow-hidden md:mt-10" ref={emblaRef}>
        <div className="flex gap-4 md:gap-5">
          {imoveis.map((imovel, i) => (
            <div
              key={imovel.id}
              className="w-[82%] max-w-[380px] shrink-0 sm:w-[47%] lg:w-[31%]"
            >
              <PropertyCard
                imovel={imovel}
                operacao={imovel.operacao[0]}
                badges={badgesDe(imovel, imovel.operacao[0], imoveis)}
                carrossel={false}
                prioridade={i < 2}
                sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 82vw"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/busca" className="ds-btn-secondary px-6">
          Ver todos os imóveis
        </Link>
      </div>
    </SectionWrapper>
  );
}
