"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { properties } from "@/data/properties";

/**
 * Carrossel de destaques no padrão do Coelho: ds-card com foto vertical,
 * gradiente inferior e dados do imóvel sobre a imagem.
 */
export default function PropertyShowcase() {
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
          {properties.map((imovel) => (
            <Link
              key={imovel.id}
              href={imovel.href}
              className="ds-card group block w-[82%] max-w-[380px] shrink-0 overflow-hidden sm:w-[47%] lg:w-[31%]"
            >
              <div className="relative aspect-[3/4] overflow-hidden md:aspect-[4/5]">
                {imovel.foto ? (
                  <Image
                    src={imovel.foto}
                    alt={`${imovel.titulo} no ${imovel.bairro}`}
                    fill
                    sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-shark-100 to-shark-300" />
                )}

                <div
                  className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.62), rgba(0,0,0,0.0))",
                  }}
                >
                  <div className="font-serif text-[22px] font-medium leading-tight md:text-[24px]">
                    {imovel.titulo}
                  </div>
                  <div className="mt-2 flex min-w-0 items-center gap-2 font-sans text-[13px] text-white/85">
                    <span className="truncate">{imovel.bairro}</span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0">{imovel.area}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-4 md:p-5">
                <div className="min-w-0">
                  <div className="ds-price">{imovel.preco}</div>
                  <div className="ds-tech mt-1">
                    {imovel.dormitorios} dorm · {imovel.vagas} vagas
                  </div>
                </div>
                <span className="ds-tag-code shrink-0">{imovel.codigo}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
