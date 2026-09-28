"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PropertyCard from "@/components/property/PropertyCard";
import FilterBar from "./FilterBar";
import { badgesDe } from "@/lib/badges";
import {
  LABEL_ORDEM,
  ORDENS,
  SEARCH_PADRAO,
  buildSearchQuery,
  parseSearchParams,
  searchProperties,
  type Ordem,
  type SearchParams,
  type SearchResult,
} from "@/lib/search";
import { LABEL_OPERACAO } from "@/types/property";

const OPERACOES = ["venda", "locacao"] as const;

export default function BuscaConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams]
  );

  const [resultado, setResultado] = useState<SearchResult | null>(null);

  useEffect(() => {
    let ativo = true;
    searchProperties(params).then((r) => {
      if (ativo) setResultado(r);
    });
    return () => {
      ativo = false;
    };
  }, [params]);

  const navegar = useCallback(
    (proximo: SearchParams) => {
      const query = buildSearchQuery(proximo);
      router.replace(query ? `/busca?${query}` : "/busca", { scroll: false });
    },
    [router]
  );

  /** qualquer mudanca de filtro volta para a primeira pagina */
  const aplicar = useCallback(
    (patch: Partial<SearchParams>) => navegar({ ...params, ...patch, pagina: 1 }),
    [navegar, params]
  );

  const limpar = useCallback(
    () => navegar({ ...SEARCH_PADRAO, operacao: params.operacao }),
    [navegar, params.operacao]
  );

  const buscarTexto = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const q = String(new FormData(event.currentTarget).get("q") ?? "").trim();
      aplicar({ q });
    },
    [aplicar]
  );

  const items = resultado?.items ?? [];
  const total = resultado?.total ?? 0;
  const carregando = resultado === null;

  const titulo = useMemo(() => {
    const acao = params.operacao === "venda" ? "à venda" : "para alugar";
    const onde = params.q ? ` em ${params.q}` : "";
    return `${total} ${total === 1 ? "imóvel" : "imóveis"} ${acao}${onde}`;
  }, [params.operacao, params.q, total]);

  return (
    <div className="ds-container pb-16 pt-24 md:pt-28">
      <h1 className="font-serif text-[28px] leading-tight text-shark md:text-[36px]">
        Encontre seu próximo endereço
      </h1>

      <div className="mt-6 flex w-fit gap-1 rounded-full bg-shark-50 p-1" role="tablist" aria-label="Tipo de operação">
        {OPERACOES.map((op) => {
          const ativo = params.operacao === op;
          return (
            <button
              key={op}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => aplicar({ operacao: op })}
              className={`h-10 rounded-full px-6 text-[14px] font-medium transition ${
                ativo ? "bg-shark text-white" : "text-shark-500 hover:text-shark"
              }`}
            >
              {LABEL_OPERACAO[op]}
            </button>
          );
        })}
      </div>

      <form onSubmit={buscarTexto} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="busca-termo" className="sr-only">
          Buscar por bairro, cidade ou código do imóvel
        </label>
        {/* nao-controlado: a URL e a fonte da verdade, e a key ressincroniza o
            campo quando ela muda por fora (voltar, pill do menu, limpar) */}
        <input
          key={params.q}
          id="busca-termo"
          name="q"
          type="search"
          defaultValue={params.q}
          placeholder="Digite o bairro, a cidade ou o código do imóvel"
          className="ds-input sm:max-w-[480px]"
        />
        <button type="submit" className="ds-btn-primary shrink-0 px-8">
          Buscar
        </button>
      </form>

      <div className="mt-6 border-y border-shark-100 py-4">
        <FilterBar
          params={params}
          facetsTipo={
            resultado?.facetsTipo ?? {
              apartamento: 0,
              casa: 0,
              condominio: 0,
              comercial: 0,
              terreno: 0,
              rural: 0,
            }
          }
          total={total}
          onAplicar={aplicar}
          onLimpar={limpar}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p aria-live="polite" className="text-[15px] font-medium text-shark">
          {carregando ? "Buscando imóveis…" : titulo}
        </p>

        <div className="flex items-center gap-2">
          <label htmlFor="busca-ordem" className="ds-tech shrink-0">
            Ordenar por
          </label>
          <select
            id="busca-ordem"
            value={params.ordem}
            onChange={(e) => aplicar({ ordem: e.target.value as Ordem })}
            className="h-11 rounded-[8px] border border-shark-100 bg-white px-3 text-[14px] text-shark"
          >
            {ORDENS.map((ordem) => (
              <option key={ordem} value={ordem}>
                {LABEL_ORDEM[ordem]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {carregando ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="ds-card overflow-hidden">
              <div className="aspect-[4/3] animate-pulse bg-shark-50" />
              <div className="space-y-2 p-4">
                <div className="h-3 w-2/3 animate-pulse rounded bg-shark-50" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-shark-50" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-shark-50" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 rounded-[16px] border border-dashed border-shark-300 px-6 py-16 text-center">
          <p className="font-serif text-[22px] text-shark">Nenhum imóvel com esses filtros</p>
          <p className="ds-tech mx-auto mt-3 max-w-[46ch]">
            Tente ampliar a faixa de valor, remover alguma comodidade ou buscar por outro bairro.
          </p>
          <button type="button" onClick={limpar} className="ds-btn-primary mt-6 px-6">
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((imovel, i) => (
              <PropertyCard
                key={imovel.id}
                imovel={imovel}
                operacao={params.operacao}
                badges={badgesDe(imovel, params.operacao, items)}
                prioridade={i < 4}
                sizes="(min-width: 1280px) 300px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              />
            ))}
          </div>

          {resultado?.temMais && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => navegar({ ...params, pagina: params.pagina + 1 })}
                className="ds-btn-secondary px-8"
              >
                Ver mais imóveis
              </button>
            </div>
          )}
        </>
      )}

      <p className="ds-tech mt-12 border-t border-shark-100 pt-6">
        Protótipo com catálogo de demonstração.{" "}
        <Link href="/contato" className="text-brand-ink underline-offset-4 hover:underline">
          Fale com um corretor
        </Link>{" "}
        para ver a carteira completa.
      </p>
    </div>
  );
}
