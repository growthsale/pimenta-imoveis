"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Comodidade, TipoImovel } from "@/types/property";
import { COMODIDADES, LABEL_COMODIDADE, LABEL_TIPO, TIPOS } from "@/types/property";
import type { SearchParams } from "@/lib/search";
import { contarFiltrosAtivos } from "@/lib/search";
import { formatBRL } from "@/lib/format";

type Props = {
  params: SearchParams;
  facetsTipo: Record<TipoImovel, number>;
  total: number;
  onAplicar: (patch: Partial<SearchParams>) => void;
  onLimpar: () => void;
};

type PainelId = "preco" | "tipo" | "quartos" | "mais";

const CONTAGENS = [1, 2, 3, 4] as const;

/* ------------------------------------------------------------------ campos */

function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="ds-label mb-3">{children}</p>;
}

function FaixaNumerica({
  min,
  max,
  onMin,
  onMax,
  prefixo,
  sufixo,
}: {
  min?: number;
  max?: number;
  onMin: (v?: number) => void;
  onMax: (v?: number) => void;
  prefixo?: string;
  sufixo?: string;
}) {
  const id = useId();
  const parse = (valor: string) => {
    const n = Number(valor.replace(/\D/g, ""));
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };

  return (
    <div className="flex items-center gap-3">
      {(["min", "max"] as const).map((lado) => (
        <div key={lado} className="flex-1">
          <label htmlFor={`${id}-${lado}`} className="sr-only">
            {lado === "min" ? "Valor mínimo" : "Valor máximo"}
          </label>
          <div className="flex h-11 items-center gap-1 rounded-[8px] bg-shark-50 px-3">
            {prefixo && <span className="ds-tech shrink-0">{prefixo}</span>}
            <input
              id={`${id}-${lado}`}
              inputMode="numeric"
              placeholder={lado === "min" ? "Mínimo" : "Máximo"}
              value={(lado === "min" ? min : max) ?? ""}
              onChange={(e) => (lado === "min" ? onMin : onMax)(parse(e.target.value))}
              className="w-full min-w-0 bg-transparent text-[15px] outline-none"
            />
            {sufixo && <span className="ds-tech shrink-0">{sufixo}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function SeletorContagem({
  valor,
  onChange,
  legenda,
}: {
  valor?: number;
  onChange: (v?: number) => void;
  legenda: string;
}) {
  return (
    <div role="group" aria-label={legenda} className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        aria-pressed={!valor}
        className={`h-10 rounded-full px-4 text-[14px] transition ${
          !valor ? "bg-shark text-white" : "border border-shark-100 text-shark hover:bg-shark-50"
        }`}
      >
        Tanto faz
      </button>
      {CONTAGENS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-pressed={valor === n}
          className={`h-10 min-w-11 rounded-full px-4 text-[14px] transition ${
            valor === n ? "bg-shark text-white" : "border border-shark-100 text-shark hover:bg-shark-50"
          }`}
        >
          {n}
          {n === 4 ? "+" : ""}
        </button>
      ))}
    </div>
  );
}

function SeletorTipo({
  selecionados,
  facets,
  onChange,
}: {
  selecionados: TipoImovel[];
  facets: Record<TipoImovel, number>;
  onChange: (v: TipoImovel[]) => void;
}) {
  return (
    <ul className="space-y-1">
      {TIPOS.map((tipo) => {
        const marcado = selecionados.includes(tipo);
        return (
          <li key={tipo}>
            <label className="flex cursor-pointer items-center gap-3 rounded-[8px] px-2 py-2 transition hover:bg-shark-50">
              <input
                type="checkbox"
                checked={marcado}
                onChange={() =>
                  onChange(
                    marcado ? selecionados.filter((t) => t !== tipo) : [...selecionados, tipo]
                  )
                }
                className="h-4 w-4 accent-shark"
              />
              <span className="flex-1 text-[15px]">{LABEL_TIPO[tipo]}</span>
              <span className="ds-tech tabular-nums">{facets[tipo]}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function ListaComodidades({
  selecionadas,
  onChange,
}: {
  selecionadas: Comodidade[];
  onChange: (v: Comodidade[]) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {COMODIDADES.map((c) => {
        const marcada = selecionadas.includes(c);
        return (
          <label
            key={c}
            className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-2 transition hover:bg-shark-50"
          >
            <input
              type="checkbox"
              checked={marcada}
              onChange={() =>
                onChange(marcada ? selecionadas.filter((x) => x !== c) : [...selecionadas, c])
              }
              className="h-4 w-4 accent-shark"
            />
            <span className="text-[14px]">{LABEL_COMODIDADE[c]}</span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------- chips */

function resumoPreco(p: SearchParams): string | null {
  if (p.precoMin && p.precoMax) return `${formatBRL(p.precoMin)} – ${formatBRL(p.precoMax)}`;
  if (p.precoMin) return `A partir de ${formatBRL(p.precoMin)}`;
  if (p.precoMax) return `Até ${formatBRL(p.precoMax)}`;
  return null;
}

function Chip({
  ativo,
  aberto,
  children,
  onClick,
}: {
  ativo: boolean;
  aberto: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={aberto}
      className={`flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[14px] transition ${
        ativo
          ? "border-shark bg-shark text-white"
          : "border-shark-100 text-shark hover:border-shark-300 hover:bg-shark-50"
      }`}
    >
      {children}
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------- barra */

export default function FilterBar({ params, facetsTipo, total, onAplicar, onLimpar }: Props) {
  const [painel, setPainel] = useState<PainelId | null>(null);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [rascunho, setRascunho] = useState<SearchParams>(params);
  const barraRef = useRef<HTMLDivElement>(null);

  const ativos = contarFiltrosAtivos(params);
  const precoResumo = resumoPreco(params);

  // o rascunho sempre parte do estado que esta na URL
  const abrir = useCallback(
    (id: PainelId) => {
      setRascunho(params);
      setPainel((atual) => (atual === id ? null : id));
    },
    [params]
  );

  const abrirSheet = useCallback(() => {
    setRascunho(params);
    setPainel(null);
    setSheetAberto(true);
  }, [params]);

  const aplicar = useCallback(() => {
    onAplicar(rascunho);
    setPainel(null);
    setSheetAberto(false);
  }, [onAplicar, rascunho]);

  const patch = useCallback((mudanca: Partial<SearchParams>) => {
    setRascunho((atual) => ({ ...atual, ...mudanca }));
  }, []);

  // fecha o popover ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!painel) return;

    const aoClicar = (event: MouseEvent) => {
      if (!barraRef.current?.contains(event.target as Node)) setPainel(null);
    };
    const aoTeclar = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPainel(null);
    };

    document.addEventListener("mousedown", aoClicar);
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.removeEventListener("mousedown", aoClicar);
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [painel]);

  // trava o corpo enquanto o bottom sheet esta aberto
  useEffect(() => {
    if (!sheetAberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = anterior;
    };
  }, [sheetAberto]);

  const painelPreco = (
    <>
      <Rotulo>Valor do imóvel</Rotulo>
      <FaixaNumerica
        min={rascunho.precoMin}
        max={rascunho.precoMax}
        onMin={(v) => patch({ precoMin: v })}
        onMax={(v) => patch({ precoMax: v })}
        prefixo="R$"
      />
    </>
  );

  const painelTipo = (
    <>
      <Rotulo>Tipos de imóvel</Rotulo>
      <SeletorTipo
        selecionados={rascunho.tipo}
        facets={facetsTipo}
        onChange={(v) => patch({ tipo: v })}
      />
    </>
  );

  const painelQuartos = (
    <>
      <Rotulo>Quartos</Rotulo>
      <SeletorContagem
        valor={rascunho.dormitorios}
        onChange={(v) => patch({ dormitorios: v })}
        legenda="Número mínimo de quartos"
      />
    </>
  );

  const painelMais = (
    <>
      <div>
        <Rotulo>Vagas de garagem</Rotulo>
        <SeletorContagem
          valor={rascunho.vagas}
          onChange={(v) => patch({ vagas: v })}
          legenda="Número mínimo de vagas"
        />
      </div>
      <div className="mt-6">
        <Rotulo>Área (m²)</Rotulo>
        <FaixaNumerica
          min={rascunho.areaMin}
          max={rascunho.areaMax}
          onMin={(v) => patch({ areaMin: v })}
          onMax={(v) => patch({ areaMax: v })}
          sufixo="m²"
        />
      </div>
      <div className="mt-6">
        <Rotulo>Comodidades</Rotulo>
        <ListaComodidades
          selecionadas={rascunho.comodidades}
          onChange={(v) => patch({ comodidades: v })}
        />
      </div>
    </>
  );

  const conteudoPainel: Record<PainelId, React.ReactNode> = {
    preco: painelPreco,
    tipo: painelTipo,
    quartos: painelQuartos,
    mais: painelMais,
  };

  return (
    <div ref={barraRef} className="relative">
      {/* no celular a fileira de chips rola na horizontal, como no QuintoAndar */}
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={abrirSheet}
          className={`flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[14px] transition md:hidden ${
            ativos ? "border-shark bg-shark text-white" : "border-shark-100 text-shark"
          }`}
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" aria-hidden="true">
            <path d="M1 3h14M3 7h10M6 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filtros{ativos > 0 && ` (${ativos})`}
        </button>

        <div className="hidden gap-2 md:flex md:flex-wrap">
          <Chip ativo={Boolean(precoResumo)} aberto={painel === "preco"} onClick={() => abrir("preco")}>
            {precoResumo ?? "Valor do imóvel"}
          </Chip>
          <Chip ativo={params.tipo.length > 0} aberto={painel === "tipo"} onClick={() => abrir("tipo")}>
            {params.tipo.length
              ? params.tipo.map((t) => LABEL_TIPO[t]).join(", ")
              : "Tipos de imóvel"}
          </Chip>
          <Chip ativo={Boolean(params.dormitorios)} aberto={painel === "quartos"} onClick={() => abrir("quartos")}>
            {params.dormitorios ? `${params.dormitorios}+ quartos` : "Quartos"}
          </Chip>
          <Chip
            ativo={Boolean(params.vagas || params.areaMin || params.areaMax || params.comodidades.length)}
            aberto={painel === "mais"}
            onClick={() => abrir("mais")}
          >
            Mais filtros
          </Chip>

          {ativos > 0 && (
            <button
              type="button"
              onClick={onLimpar}
              className="h-11 shrink-0 px-3 text-[14px] font-medium text-brand-ink underline-offset-4 hover:underline"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* popover do desktop */}
      {painel && (
        <div className="absolute left-0 top-full z-40 mt-2 hidden w-[min(420px,100%)] rounded-[12px] border border-shark-100 bg-white p-5 shadow-[0_20px_40px_-12px_rgba(29,29,31,0.18)] md:block">
          <div className={painel === "mais" ? "max-h-[60vh] overflow-y-auto pr-1" : ""}>
            {conteudoPainel[painel]}
          </div>
          <div className="mt-5 flex justify-end gap-2 border-t border-shark-100 pt-4">
            <button type="button" onClick={() => setPainel(null)} className="ds-btn-secondary px-4">
              Cancelar
            </button>
            <button type="button" onClick={aplicar} className="ds-btn-primary px-6">
              Aplicar
            </button>
          </div>
        </div>
      )}

      {/* bottom sheet do celular */}
      {sheetAberto && (
        <div className="fixed inset-0 z-[70] md:hidden">
          <button
            type="button"
            aria-label="Fechar filtros"
            onClick={() => setSheetAberto(false)}
            className="absolute inset-0 w-full cursor-default bg-shark/40"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtros"
            className="absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col rounded-t-[20px] bg-white"
          >
            <div className="flex items-center justify-between border-b border-shark-100 px-5 py-4">
              <p className="font-serif text-[20px]">Filtros</p>
              <button
                type="button"
                onClick={() => setSheetAberto(false)}
                aria-label="Fechar filtros"
                className="flex h-11 w-11 items-center justify-center rounded-full text-shark"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
              {painelPreco}
              <div className="mt-6">{painelTipo}</div>
              <div className="mt-6">{painelQuartos}</div>
              <div className="mt-6">{painelMais}</div>
            </div>

            <div className="flex items-center gap-3 border-t border-shark-100 px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))]">
              <button type="button" onClick={onLimpar} className="ds-btn-secondary flex-1">
                Limpar
              </button>
              <button type="button" onClick={aplicar} className="ds-btn-primary flex-[2]">
                Ver {total} {total === 1 ? "imóvel" : "imóveis"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
