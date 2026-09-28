"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Operacao, Property } from "@/types/property";
import type { Badge } from "@/lib/badges";
import { asset } from "@/lib/asset";
import { useFavoritos } from "@/hooks/useFavoritos";
import {
  formatBRL,
  formatCustosExtras,
  formatEndereco,
  formatHeadline,
  formatSpecs,
  precoDe,
} from "@/lib/format";

type Props = {
  imovel: Property;
  operacao: Operacao;
  badges?: Badge[];
  /**
   * Carrossel de fotos. Desligue quando o card estiver dentro de outro
   * scroller horizontal (o carrossel de destaques da home), senao o arrasto
   * no celular disputa entre os dois trilhos.
   */
  carrossel?: boolean;
  /** prioriza o carregamento das fotos que abrem a primeira dobra */
  prioridade?: boolean;
  sizes?: string;
};

/**
 * Card de imovel no padrao do QuintoAndar: carrossel de fotos com selos e
 * favoritar sobre a imagem; abaixo, headline, preco, custos, specs e endereco.
 *
 * E o unico card do projeto — home e busca usam o mesmo componente.
 */
export default function PropertyCard({
  imovel,
  operacao,
  badges = [],
  carrossel = true,
  prioridade = false,
  sizes = "(min-width: 1280px) 300px, (min-width: 768px) 45vw, 82vw",
}: Props) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);
  const { ids: favoritos, alternar } = useFavoritos();

  const favorito = favoritos.includes(imovel.id);
  const op = imovel.operacao.includes(operacao) ? operacao : imovel.operacao[0];
  const preco = precoDe(imovel, op);
  const custos = formatCustosExtras(imovel);
  const fotos = carrossel ? imovel.fotos : imovel.fotos.slice(0, 1);
  const ultima = fotos.length - 1;

  const alternarFavorito = useCallback(
    (event: React.MouseEvent) => {
      // o card inteiro e um link: o coracao nao pode navegar junto
      event.preventDefault();
      event.stopPropagation();
      alternar(imovel.id);
    },
    [alternar, imovel.id]
  );

  const irPara = useCallback((event: React.MouseEvent, destino: number) => {
    event.preventDefault();
    event.stopPropagation();

    const trilho = trilhoRef.current;
    if (!trilho) return;
    trilho.scrollTo({ left: trilho.clientWidth * destino, behavior: "smooth" });
  }, []);

  const aoRolar = useCallback(() => {
    const trilho = trilhoRef.current;
    if (!trilho || trilho.clientWidth === 0) return;
    setIndice(Math.round(trilho.scrollLeft / trilho.clientWidth));
  }, []);

  return (
    <Link href={`/imovel/${imovel.slug}`} className="ds-card group block overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-shark-100">
        <div
          ref={trilhoRef}
          onScroll={aoRolar}
          className={`flex h-full w-full ${
            carrossel
              ? "snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "overflow-hidden"
          }`}
        >
          {fotos.map((foto, i) => (
            <div key={foto} className="relative h-full w-full shrink-0 snap-start">
              <Image
                src={asset(foto)}
                alt={`${imovel.titulo} em ${imovel.endereco.bairro} — foto ${i + 1}`}
                fill
                sizes={sizes}
                priority={prioridade && i === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {badges.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.texto}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  badge.tom === "preco" ? "bg-brand text-shark" : "bg-shark/85 text-white"
                }`}
              >
                {badge.texto}
              </span>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={alternarFavorito}
          aria-pressed={favorito}
          aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-shark backdrop-blur-[4px] transition hover:bg-white"
        >
          <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true">
            <path
              d="M9 15S1 10.5 1 5.3C1 2.9 2.9 1 5.2 1 6.8 1 8.2 1.9 9 3.3 9.8 1.9 11.2 1 12.8 1 15.1 1 17 2.9 17 5.3 17 10.5 9 15 9 15z"
              fill={favorito ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {fotos.length > 1 && (
          <>
            {indice > 0 && (
              <button
                type="button"
                onClick={(e) => irPara(e, indice - 1)}
                aria-label="Foto anterior"
                className="absolute left-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-shark opacity-0 transition group-hover:opacity-100 md:flex"
              >
                <svg width="7" height="12" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                  <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {indice < ultima && (
              <button
                type="button"
                onClick={(e) => irPara(e, indice + 1)}
                aria-label="Próxima foto"
                className="absolute right-2 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-shark opacity-0 transition group-hover:opacity-100 md:flex"
              >
                <svg width="7" height="12" viewBox="0 0 8 14" fill="none" aria-hidden="true">
                  <path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {fotos.map((foto, i) => (
                <span
                  key={foto}
                  className={`h-1.5 rounded-full transition-all ${
                    i === indice ? "w-4 bg-white" : "w-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4">
        <p className="ds-tech line-clamp-1">{formatHeadline(imovel, op)}</p>

        <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className="font-sans text-[20px] font-semibold text-shark">{formatBRL(preco)}</span>
          {op === "locacao" && <span className="ds-tech">/mês</span>}
        </p>

        {custos && <p className="ds-tech mt-0.5">{custos}</p>}

        <p className="mt-3 text-[14px] text-shark">{formatSpecs(imovel)}</p>

        <p className="ds-tech mt-1 line-clamp-1">{formatEndereco(imovel)}</p>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-shark-100 pt-3">
          <span className="ds-tech">
            {imovel.suites > 0 && `${imovel.suites} ${imovel.suites === 1 ? "suíte" : "suítes"} · `}
            {imovel.banheiros} {imovel.banheiros === 1 ? "banheiro" : "banheiros"}
          </span>
          <span className="ds-tag-code shrink-0">{imovel.codigo}</span>
        </div>
      </div>
    </Link>
  );
}
