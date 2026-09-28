"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import { linkWhatsApp } from "@/data/contato";
import {
  CAPTACAO_INICIAL,
  ETAPAS,
  comoMensagem,
  comoRegistro,
  criarAnuncio,
  validarEtapa,
  type DadosCaptacao,
  type ErrosCaptacao,
} from "@/lib/captacao";
import type { Operacao, Property, TipoImovel } from "@/types/property";
import {
  COMODIDADES,
  LABEL_COMODIDADE,
  LABEL_OPERACAO,
  LABEL_TIPO,
  TIPOS,
} from "@/types/property";

/* ------------------------------------------------------------------ campos */

function Campo({
  rotulo,
  erro,
  dica,
  children,
}: {
  rotulo: string;
  erro?: string;
  dica?: string;
  children: (props: { id: string; invalido: boolean }) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="ds-label mb-2 block">
        {rotulo}
      </label>
      {children({ id, invalido: Boolean(erro) })}
      {erro ? (
        <p role="alert" className="mt-1.5 text-[13px] text-error">
          {erro}
        </p>
      ) : (
        dica && <p className="ds-tech mt-1.5">{dica}</p>
      )}
    </div>
  );
}

const classeInput = (invalido: boolean) =>
  `ds-input ${invalido ? "border-error bg-white" : ""}`;

function Texto({
  rotulo,
  valor,
  onChange,
  erro,
  dica,
  placeholder,
  tipo = "text",
}: {
  rotulo: string;
  valor: string;
  onChange: (v: string) => void;
  erro?: string;
  dica?: string;
  placeholder?: string;
  tipo?: string;
}) {
  return (
    <Campo rotulo={rotulo} erro={erro} dica={dica}>
      {({ id, invalido }) => (
        <input
          id={id}
          type={tipo}
          value={valor}
          placeholder={placeholder}
          aria-invalid={invalido}
          onChange={(e) => onChange(e.target.value)}
          className={classeInput(invalido)}
        />
      )}
    </Campo>
  );
}

function Numero({
  rotulo,
  valor,
  onChange,
  erro,
  dica,
  prefixo,
  sufixo,
}: {
  rotulo: string;
  valor?: number;
  onChange: (v: number) => void;
  erro?: string;
  dica?: string;
  prefixo?: string;
  sufixo?: string;
}) {
  return (
    <Campo rotulo={rotulo} erro={erro} dica={dica}>
      {({ id, invalido }) => (
        <div
          className={`flex h-12 items-center gap-2 rounded-[8px] border px-3 ${
            invalido ? "border-error bg-white" : "border-transparent bg-shark-50"
          }`}
        >
          {prefixo && <span className="ds-tech shrink-0">{prefixo}</span>}
          <input
            id={id}
            inputMode="numeric"
            aria-invalid={invalido}
            value={valor ? valor.toLocaleString("pt-BR") : ""}
            onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, "")) || 0)}
            className="w-full min-w-0 bg-transparent outline-none"
          />
          {sufixo && <span className="ds-tech shrink-0">{sufixo}</span>}
        </div>
      )}
    </Campo>
  );
}

function Opcoes<T extends string>({
  rotulo,
  opcoes,
  valor,
  onChange,
  rotulos,
  erro,
  multiplo = false,
}: {
  rotulo: string;
  opcoes: readonly T[];
  valor: T[] | T;
  onChange: (v: T[]) => void;
  rotulos: Record<T, string>;
  erro?: string;
  multiplo?: boolean;
}) {
  const atuais = Array.isArray(valor) ? valor : [valor];

  return (
    <div>
      <p className="ds-label mb-2">{rotulo}</p>
      <div role="group" aria-label={rotulo} className="flex flex-wrap gap-2">
        {opcoes.map((opcao) => {
          const ativo = atuais.includes(opcao);
          return (
            <button
              key={opcao}
              type="button"
              aria-pressed={ativo}
              onClick={() =>
                onChange(
                  multiplo
                    ? ativo
                      ? atuais.filter((o) => o !== opcao)
                      : [...atuais, opcao]
                    : [opcao]
                )
              }
              className={`h-11 rounded-full border px-4 text-[14px] transition ${
                ativo
                  ? "border-shark bg-shark text-white"
                  : "border-shark-100 text-shark hover:border-shark-300 hover:bg-shark-50"
              }`}
            >
              {rotulos[opcao]}
            </button>
          );
        })}
      </div>
      {erro && (
        <p role="alert" className="mt-1.5 text-[13px] text-error">
          {erro}
        </p>
      )}
    </div>
  );
}

function Contador({
  rotulo,
  valor,
  onChange,
  erro,
}: {
  rotulo: string;
  valor: number;
  onChange: (v: number) => void;
  erro?: string;
}) {
  return (
    <div>
      <p className="ds-label mb-2">{rotulo}</p>
      <div className="flex h-12 w-full items-center justify-between rounded-[8px] bg-shark-50 px-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, valor - 1))}
          aria-label={`Diminuir ${rotulo.toLowerCase()}`}
          disabled={valor === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full text-shark transition hover:bg-white disabled:opacity-30"
        >
          <svg width="12" height="2" viewBox="0 0 12 2" aria-hidden="true">
            <path d="M0 1h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
        <span aria-live="polite" className="text-[16px] font-medium tabular-nums">
          {valor}
        </span>
        <button
          type="button"
          onClick={() => onChange(valor + 1)}
          aria-label={`Aumentar ${rotulo.toLowerCase()}`}
          className="flex h-9 w-9 items-center justify-center rounded-full text-shark transition hover:bg-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {erro && (
        <p role="alert" className="mt-1.5 text-[13px] text-error">
          {erro}
        </p>
      )}
    </div>
  );
}

/* ----------------------------------------------------------------- wizard */

export default function FormCaptacao() {
  const [etapa, setEtapa] = useState(0);
  const [dados, setDados] = useState<DadosCaptacao>(CAPTACAO_INICIAL);
  const [erros, setErros] = useState<ErrosCaptacao>({});
  const [anuncio, setAnuncio] = useState<Property | null>(null);
  const [previas, setPrevias] = useState<string[]>([]);
  const [copiado, setCopiado] = useState(false);
  const topoRef = useRef<HTMLDivElement>(null);

  const set = useCallback(
    <K extends keyof DadosCaptacao>(chave: K, valor: DadosCaptacao[K]) => {
      setDados((atual) => ({ ...atual, [chave]: valor }));
      setErros((atual) => ({ ...atual, [chave]: undefined }));
    },
    []
  );

  // as URLs de previa sao locais: precisam ser devolvidas ao sair
  useEffect(() => {
    return () => previas.forEach((url) => URL.revokeObjectURL(url));
  }, [previas]);

  const avancar = useCallback(async () => {
    const achados = validarEtapa(etapa, dados);
    if (Object.keys(achados).length > 0) {
      setErros(achados);
      return;
    }

    if (etapa < ETAPAS.length - 1) {
      setEtapa(etapa + 1);
      topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const criado = await criarAnuncio(dados);
    setAnuncio(previas.length ? { ...criado, fotos: previas } : criado);
    topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [dados, etapa, previas]);

  const voltar = useCallback(() => {
    setErros({});
    setEtapa((atual) => Math.max(0, atual - 1));
    topoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const receberFotos = useCallback((lista: FileList | null) => {
    if (!lista?.length) return;
    const arquivos = Array.from(lista).slice(0, 8);
    setPrevias((atuais) => {
      atuais.forEach((url) => URL.revokeObjectURL(url));
      return arquivos.map((arquivo) => URL.createObjectURL(arquivo));
    });
    setDados((atual) => ({ ...atual, fotos: arquivos.map((a) => a.name) }));
  }, []);

  const registro = useMemo(
    () => (anuncio ? comoRegistro(anuncio, dados.fotos) : ""),
    [anuncio, dados.fotos]
  );

  const copiar = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(registro);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2500);
    } catch {
      // clipboard bloqueado: o texto continua selecionavel no <pre>
    }
  }, [registro]);

  /* ------------------------------------------------------------ resultado */

  if (anuncio) {
    return (
      <div ref={topoRef} className="ds-container pb-20 pt-28 md:pt-36">
        <p className="ds-label text-brand-ink">Cadastro gerado</p>
        <h1 className="mt-4 max-w-[20ch] font-serif text-[32px] font-normal leading-[1.1] text-shark md:text-[46px]">
          {anuncio.codigo} está pronto para publicação
        </h1>
        <p className="mt-5 max-w-[60ch] text-[16px] leading-relaxed text-shark-500">
          O anúncio abaixo já está no formato do catálogo. Um corretor confere os dados,
          agenda as fotos profissionais e coloca no ar.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]">
          <div>
            <p className="ds-label mb-3">Como vai aparecer na busca</p>
            <PropertyCard
              imovel={anuncio}
              operacao={anuncio.operacao[0]}
              sizes="340px"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="ds-label">Registro do imóvel</p>
              <button type="button" onClick={copiar} className="ds-btn-secondary px-4 text-[13px]">
                {copiado ? "Copiado" : "Copiar cadastro"}
              </button>
            </div>

            <pre className="mt-3 max-h-[420px] overflow-auto rounded-[12px] bg-shark p-5 text-[12px] leading-relaxed text-white/90">
              {registro}
            </pre>

            {dados.fotos.length > 0 && (
              <p className="ds-tech mt-3">
                {dados.fotos.length} foto{dados.fotos.length === 1 ? "" : "s"} recebida
                {dados.fotos.length === 1 ? "" : "s"}. O upload definitivo acontece quando o
                corretor confirmar o cadastro.
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={linkWhatsApp(comoMensagem(anuncio, dados))}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-btn-primary px-6"
              >
                Enviar para um corretor
              </a>
              <button
                type="button"
                onClick={() => {
                  setAnuncio(null);
                  setEtapa(0);
                  setDados(CAPTACAO_INICIAL);
                  setPrevias([]);
                }}
                className="ds-btn-secondary px-6"
              >
                Cadastrar outro imóvel
              </button>
              <Link href="/busca" className="ds-btn-secondary px-6">
                Ver a carteira
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------- etapas */

  const atual = ETAPAS[etapa];

  return (
    <div ref={topoRef} className="ds-container pb-20 pt-28 md:pt-36">
      <p className="ds-label text-brand-ink">Anuncie seu imóvel</p>
      <h1 className="mt-4 max-w-[22ch] font-serif text-[32px] font-normal leading-[1.1] text-shark md:text-[46px]">
        Em quatro passos, seu imóvel vira anúncio
      </h1>
      <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-shark-500">
        Preencha o que souber. Ao final, o cadastro sai pronto no formato do catálogo e
        segue direto para um corretor.
      </p>

      <ol className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ETAPAS.map((passo) => {
          const concluido = passo.id < etapa;
          const ativo = passo.id === etapa;
          return (
            <li
              key={passo.id}
              aria-current={ativo ? "step" : undefined}
              className={`border-t-2 pt-3 transition-colors ${
                ativo ? "border-shark" : concluido ? "border-brand-ink" : "border-shark-100"
              }`}
            >
              <p
                className={`text-[13px] font-semibold ${
                  ativo || concluido ? "text-shark" : "text-shark-500"
                }`}
              >
                {passo.id + 1}. {passo.titulo}
              </p>
              <p className="ds-tech mt-1 hidden sm:block">{passo.resumo}</p>
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void avancar();
        }}
        className="mt-10 max-w-[680px]"
      >
        <h2 className="font-serif text-[24px] text-shark">{atual.titulo}</h2>

        {etapa === 0 && (
          <div className="mt-6 space-y-6">
            <Opcoes<Operacao>
              rotulo="O que você quer fazer"
              opcoes={["venda", "locacao"]}
              rotulos={LABEL_OPERACAO}
              valor={dados.operacao}
              onChange={(v) => set("operacao", v)}
              erro={erros.operacao}
              multiplo
            />
            <Opcoes<TipoImovel>
              rotulo="Tipo de imóvel"
              opcoes={TIPOS}
              rotulos={LABEL_TIPO}
              valor={dados.tipo}
              onChange={(v) => set("tipo", v[0] ?? "apartamento")}
            />
            <Texto
              rotulo="Nome do anúncio"
              valor={dados.titulo}
              onChange={(v) => set("titulo", v)}
              erro={erros.titulo}
              placeholder="Apartamento com varanda gourmet"
              dica="Aparece como título do card na busca."
            />
          </div>
        )}

        {etapa === 1 && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
              <Texto rotulo="Rua" valor={dados.rua} onChange={(v) => set("rua", v)} placeholder="Rua dos Pinheiros" />
              <Texto rotulo="Número" valor={dados.numero} onChange={(v) => set("numero", v)} placeholder="1200" />
            </div>
            <Texto
              rotulo="Bairro"
              valor={dados.bairro}
              onChange={(v) => set("bairro", v)}
              erro={erros.bairro}
              placeholder="Pinheiros"
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
              <Texto rotulo="Cidade" valor={dados.cidade} onChange={(v) => set("cidade", v)} erro={erros.cidade} />
              <Texto rotulo="Estado" valor={dados.uf} onChange={(v) => set("uf", v.toUpperCase().slice(0, 2))} erro={erros.uf} />
            </div>
            <p className="ds-tech">
              O número não aparece no anúncio público — fica só no cadastro interno.
            </p>
          </div>
        )}

        {etapa === 2 && (
          <div className="mt-6 space-y-6">
            <Numero
              rotulo="Área útil"
              valor={dados.area || undefined}
              onChange={(v) => set("area", v)}
              erro={erros.area}
              sufixo="m²"
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Contador rotulo="Quartos" valor={dados.dormitorios} onChange={(v) => set("dormitorios", v)} />
              <Contador rotulo="Suítes" valor={dados.suites} onChange={(v) => set("suites", v)} erro={erros.suites} />
              <Contador rotulo="Banheiros" valor={dados.banheiros} onChange={(v) => set("banheiros", v)} />
              <Contador rotulo="Vagas" valor={dados.vagas} onChange={(v) => set("vagas", v)} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dados.operacao.includes("venda") && (
                <Numero
                  rotulo="Valor de venda"
                  valor={dados.precoVenda}
                  onChange={(v) => set("precoVenda", v)}
                  erro={erros.precoVenda}
                  prefixo="R$"
                />
              )}
              {dados.operacao.includes("locacao") && (
                <Numero
                  rotulo="Aluguel mensal"
                  valor={dados.precoLocacao}
                  onChange={(v) => set("precoLocacao", v)}
                  erro={erros.precoLocacao}
                  prefixo="R$"
                />
              )}
              <Numero rotulo="Condomínio" valor={dados.condominio} onChange={(v) => set("condominio", v)} prefixo="R$" />
              <Numero rotulo="IPTU" valor={dados.iptu} onChange={(v) => set("iptu", v)} prefixo="R$" />
            </div>

            <div>
              <p className="ds-label mb-2">Comodidades</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
                {COMODIDADES.map((c) => {
                  const marcada = dados.comodidades.includes(c);
                  return (
                    <label
                      key={c}
                      className="flex cursor-pointer items-center gap-2.5 rounded-[8px] px-2 py-2 transition hover:bg-shark-50"
                    >
                      <input
                        type="checkbox"
                        checked={marcada}
                        onChange={() =>
                          set(
                            "comodidades",
                            marcada
                              ? dados.comodidades.filter((x) => x !== c)
                              : [...dados.comodidades, c]
                          )
                        }
                        className="h-4 w-4 accent-shark"
                      />
                      <span className="text-[14px]">{LABEL_COMODIDADE[c]}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {etapa === 3 && (
          <div className="mt-6 space-y-6">
            <Campo rotulo="Fotos do imóvel" dica="Até 8 imagens. O corretor agenda as fotos profissionais depois.">
              {({ id }) => (
                <input
                  id={id}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => receberFotos(e.target.files)}
                  className="block w-full cursor-pointer rounded-[8px] border border-dashed border-shark-300 bg-shark-50 p-4 text-[14px] file:mr-4 file:rounded-full file:border-0 file:bg-shark file:px-4 file:py-2 file:text-[13px] file:text-white"
                />
              )}
            </Campo>

            {previas.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {previas.map((url, i) => (
                  <li key={url}>
                    {/* previa local; next/image nao processa blob: */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Foto ${i + 1} do imóvel`}
                      className="h-20 w-28 rounded-[8px] object-cover"
                    />
                  </li>
                ))}
              </ul>
            )}

            <Campo rotulo="Algo mais sobre o imóvel" dica="Opcional. Reforma recente, andar, vista, posição solar.">
              {({ id }) => (
                <textarea
                  id={id}
                  rows={4}
                  value={dados.descricao}
                  onChange={(e) => set("descricao", e.target.value)}
                  className="w-full rounded-[8px] bg-shark-50 p-4 text-[15px] outline-none focus-visible:bg-white"
                />
              )}
            </Campo>

            <div className="border-t border-shark-100 pt-6">
              <p className="ds-label mb-4">Seus dados</p>
              <div className="space-y-4">
                <Texto
                  rotulo="Nome"
                  valor={dados.proprietarioNome}
                  onChange={(v) => set("proprietarioNome", v)}
                  erro={erros.proprietarioNome}
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Texto
                    rotulo="Telefone"
                    tipo="tel"
                    valor={dados.proprietarioTelefone}
                    onChange={(v) => set("proprietarioTelefone", v)}
                    erro={erros.proprietarioTelefone}
                    placeholder="(11) 90000-0000"
                  />
                  <Texto
                    rotulo="E-mail"
                    tipo="email"
                    valor={dados.proprietarioEmail}
                    onChange={(v) => set("proprietarioEmail", v)}
                    erro={erros.proprietarioEmail}
                    placeholder="voce@email.com"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-shark-100 pt-6">
          {etapa > 0 && (
            <button type="button" onClick={voltar} className="ds-btn-secondary px-6">
              Voltar
            </button>
          )}
          <button type="submit" className="ds-btn-primary px-8">
            {etapa === ETAPAS.length - 1 ? "Gerar cadastro" : "Continuar"}
          </button>
          <span className="ds-tech ml-auto">
            Passo {etapa + 1} de {ETAPAS.length}
          </span>
        </div>
      </form>
    </div>
  );
}
