import { properties } from "@/data/properties";
import type { Comodidade, Operacao, Property, TipoImovel } from "@/types/property";
import { COMODIDADES, TIPOS } from "@/types/property";
import { precoDe } from "./format";

export const ORDENS = ["relevancia", "menor-preco", "maior-preco", "recentes", "maior-area"] as const;
export type Ordem = (typeof ORDENS)[number];

export const LABEL_ORDEM: Record<Ordem, string> = {
  relevancia: "Mais relevantes",
  "menor-preco": "Menor preço",
  "maior-preco": "Maior preço",
  recentes: "Mais recentes",
  "maior-area": "Maior área",
};

export const POR_PAGINA = 12;

export type SearchParams = {
  operacao: Operacao;
  /** texto livre: bairro, cidade, titulo ou codigo */
  q: string;
  tipo: TipoImovel[];
  precoMin?: number;
  precoMax?: number;
  /** minimo, no padrao "3+" da interface */
  dormitorios?: number;
  vagas?: number;
  areaMin?: number;
  areaMax?: number;
  comodidades: Comodidade[];
  ordem: Ordem;
  pagina: number;
};

export const SEARCH_PADRAO: SearchParams = {
  operacao: "venda",
  q: "",
  tipo: [],
  comodidades: [],
  ordem: "relevancia",
  pagina: 1,
};

export type SearchResult = {
  items: Property[];
  total: number;
  pagina: number;
  totalPaginas: number;
  temMais: boolean;
  /** quantos resultados cairiam em cada tipo, ignorando o filtro de tipo */
  facetsTipo: Record<TipoImovel, number>;
};

// ---------------------------------------------------------------- URL <-> estado

const num = (valor: string | null): number | undefined => {
  if (!valor) return undefined;
  const n = Number(valor);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

const lista = <T extends string>(valor: string | null, validos: readonly T[]): T[] => {
  if (!valor) return [];
  return valor.split(",").filter((item): item is T => (validos as readonly string[]).includes(item));
};

export function parseSearchParams(sp: URLSearchParams): SearchParams {
  const operacao = sp.get("operacao") === "locacao" ? "locacao" : "venda";
  const ordemBruta = sp.get("ordem");
  const ordem = ORDENS.includes(ordemBruta as Ordem) ? (ordemBruta as Ordem) : "relevancia";

  return {
    operacao,
    q: sp.get("q")?.trim() ?? "",
    tipo: lista(sp.get("tipo"), TIPOS),
    precoMin: num(sp.get("precoMin")),
    precoMax: num(sp.get("precoMax")),
    dormitorios: num(sp.get("dormitorios")),
    vagas: num(sp.get("vagas")),
    areaMin: num(sp.get("areaMin")),
    areaMax: num(sp.get("areaMax")),
    comodidades: lista(sp.get("comodidades"), COMODIDADES),
    ordem,
    pagina: num(sp.get("pagina")) ?? 1,
  };
}

/** serializa omitindo o que esta no padrao, para a URL ficar curta e legivel */
export function buildSearchQuery(params: SearchParams): string {
  const sp = new URLSearchParams();

  if (params.operacao !== SEARCH_PADRAO.operacao) sp.set("operacao", params.operacao);
  if (params.q) sp.set("q", params.q);
  if (params.tipo.length) sp.set("tipo", params.tipo.join(","));
  if (params.precoMin) sp.set("precoMin", String(params.precoMin));
  if (params.precoMax) sp.set("precoMax", String(params.precoMax));
  if (params.dormitorios) sp.set("dormitorios", String(params.dormitorios));
  if (params.vagas) sp.set("vagas", String(params.vagas));
  if (params.areaMin) sp.set("areaMin", String(params.areaMin));
  if (params.areaMax) sp.set("areaMax", String(params.areaMax));
  if (params.comodidades.length) sp.set("comodidades", params.comodidades.join(","));
  if (params.ordem !== SEARCH_PADRAO.ordem) sp.set("ordem", params.ordem);
  if (params.pagina > 1) sp.set("pagina", String(params.pagina));

  return sp.toString();
}

/** quantos filtros, alem de operacao e ordem, estao ativos */
export function contarFiltrosAtivos(params: SearchParams): number {
  return [
    params.q,
    params.tipo.length,
    params.precoMin,
    params.precoMax,
    params.dormitorios,
    params.vagas,
    params.areaMin,
    params.areaMax,
    params.comodidades.length,
  ].filter(Boolean).length;
}

// ---------------------------------------------------------------- consulta

const normalizar = (texto: string): string =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function casaComTexto(imovel: Property, termo: string): boolean {
  if (!termo) return true;
  const alvo = normalizar(
    [imovel.titulo, imovel.codigo, imovel.endereco.bairro, imovel.endereco.cidade, imovel.endereco.rua]
      .filter(Boolean)
      .join(" ")
  );
  return normalizar(termo)
    .split(/\s+/)
    .every((palavra) => alvo.includes(palavra));
}

/** todos os filtros menos o de tipo — reaproveitado para contar as facetas */
function passaFiltrosBase(imovel: Property, p: SearchParams): boolean {
  if (!imovel.operacao.includes(p.operacao)) return false;
  if (!casaComTexto(imovel, p.q)) return false;

  const preco = precoDe(imovel, p.operacao);
  if (p.precoMin && preco < p.precoMin) return false;
  if (p.precoMax && preco > p.precoMax) return false;

  if (p.dormitorios && imovel.dormitorios < p.dormitorios) return false;
  if (p.vagas && imovel.vagas < p.vagas) return false;
  if (p.areaMin && imovel.area < p.areaMin) return false;
  if (p.areaMax && imovel.area > p.areaMax) return false;

  return p.comodidades.every((c) => imovel.comodidades.includes(c));
}

function ordenar(items: Property[], p: SearchParams): Property[] {
  const copia = [...items];

  switch (p.ordem) {
    case "menor-preco":
      return copia.sort((a, b) => precoDe(a, p.operacao) - precoDe(b, p.operacao));
    case "maior-preco":
      return copia.sort((a, b) => precoDe(b, p.operacao) - precoDe(a, p.operacao));
    case "recentes":
      return copia.sort((a, b) => b.publicadoEm.localeCompare(a.publicadoEm));
    case "maior-area":
      return copia.sort((a, b) => b.area - a.area);
    default:
      // relevancia: destaques primeiro, depois os mais recentes
      return copia.sort((a, b) => {
        const destaque = Number(Boolean(b.destaque)) - Number(Boolean(a.destaque));
        return destaque !== 0 ? destaque : b.publicadoEm.localeCompare(a.publicadoEm);
      });
  }
}

/**
 * Unico ponto que conhece a origem dos imoveis.
 *
 * Hoje filtra o catalogo em memoria; quando o CRM entrar, o corpo vira um fetch
 * e a assinatura continua a mesma. E assincrona de proposito — a interface ja
 * trata o resultado como algo que chega depois.
 */
export async function searchProperties(params: SearchParams): Promise<SearchResult> {
  const base = properties.filter((imovel) => passaFiltrosBase(imovel, params));

  const facetsTipo = TIPOS.reduce(
    (acc, tipo) => {
      acc[tipo] = base.filter((imovel) => imovel.tipo === tipo).length;
      return acc;
    },
    {} as Record<TipoImovel, number>
  );

  const filtrados = params.tipo.length
    ? base.filter((imovel) => params.tipo.includes(imovel.tipo))
    : base;

  const ordenados = ordenar(filtrados, params);
  const total = ordenados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const pagina = Math.min(Math.max(1, params.pagina), totalPaginas);

  // paginacao acumulativa: o botao "Ver mais" soma a proxima pagina a lista
  const items = ordenados.slice(0, pagina * POR_PAGINA);

  return { items, total, pagina, totalPaginas, temMais: items.length < total, facetsTipo };
}

/** destaques da home — mesma fonte da busca, sem duplicar regra */
export async function destaques(limite = 6): Promise<Property[]> {
  return properties.filter((imovel) => imovel.destaque).slice(0, limite);
}

export async function porSlug(slug: string): Promise<Property | undefined> {
  return properties.find((imovel) => imovel.slug === slug);
}

/** alimenta o generateStaticParams da rota /imovel/[slug] no export estatico */
export async function todosOsSlugs(): Promise<string[]> {
  return properties.map((imovel) => imovel.slug);
}

/** sugestoes do fim da pagina de detalhe: mesmo bairro, senao mesmo tipo */
export async function relacionados(imovel: Property, limite = 4): Promise<Property[]> {
  const outros = properties.filter((p) => p.id !== imovel.id);
  const mesmoBairro = outros.filter((p) => p.endereco.bairro === imovel.endereco.bairro);
  const mesmoTipo = outros.filter(
    (p) => p.tipo === imovel.tipo && p.endereco.bairro !== imovel.endereco.bairro
  );
  return [...mesmoBairro, ...mesmoTipo].slice(0, limite);
}
