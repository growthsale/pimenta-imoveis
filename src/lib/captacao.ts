import type { Comodidade, Operacao, Property, TipoImovel } from "@/types/property";
import { properties } from "@/data/properties";

/**
 * Captacao de imoveis: transforma o que o proprietario preenche no formulario
 * em um registro Property identico ao do catalogo — pronto para publicar.
 *
 * criarAnuncio e assincrona de proposito: hoje monta o registro no navegador,
 * amanha vira um POST para o CRM sem que o formulario mude.
 */

export type DadosCaptacao = {
  operacao: Operacao[];
  tipo: TipoImovel;
  titulo: string;

  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;

  area: number;
  dormitorios: number;
  suites: number;
  banheiros: number;
  vagas: number;

  precoVenda?: number;
  precoLocacao?: number;
  condominio?: number;
  iptu?: number;

  comodidades: Comodidade[];
  descricao: string;
  /** nomes dos arquivos enviados; o upload real depende de backend */
  fotos: string[];

  proprietarioNome: string;
  proprietarioTelefone: string;
  proprietarioEmail: string;
};

export const CAPTACAO_INICIAL: DadosCaptacao = {
  operacao: ["venda"],
  tipo: "apartamento",
  titulo: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "São Paulo",
  uf: "SP",
  area: 0,
  dormitorios: 0,
  suites: 0,
  banheiros: 0,
  vagas: 0,
  comodidades: [],
  descricao: "",
  fotos: [],
  proprietarioNome: "",
  proprietarioTelefone: "",
  proprietarioEmail: "",
};

export type ErrosCaptacao = Partial<Record<keyof DadosCaptacao, string>>;

export const ETAPAS = [
  { id: 0, titulo: "O imóvel", resumo: "Operação, tipo e nome do anúncio" },
  { id: 1, titulo: "Endereço", resumo: "Onde o imóvel fica" },
  { id: 2, titulo: "Características", resumo: "Metragem, cômodos e valores" },
  { id: 3, titulo: "Fotos e contato", resumo: "Imagens e dados do proprietário" },
] as const;

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** continua a sequencia PI-#### do catalogo em vez de sortear um numero */
export function proximoCodigo(): string {
  const maior = properties.reduce((acc, imovel) => {
    const n = Number(imovel.codigo.replace(/\D/g, ""));
    return Number.isFinite(n) && n > acc ? n : acc;
  }, 1000);
  return `PI-${maior + 1}`;
}

const apenasDigitos = (valor: string) => valor.replace(/\D/g, "");

export function validarEtapa(etapa: number, d: DadosCaptacao): ErrosCaptacao {
  const erros: ErrosCaptacao = {};

  if (etapa === 0) {
    if (d.operacao.length === 0) erros.operacao = "Escolha ao menos uma operação.";
    if (d.titulo.trim().length < 4) erros.titulo = "Dê um nome ao anúncio, como “Apartamento com varanda”.";
  }

  if (etapa === 1) {
    if (!d.bairro.trim()) erros.bairro = "Informe o bairro.";
    if (!d.cidade.trim()) erros.cidade = "Informe a cidade.";
    if (d.uf.trim().length !== 2) erros.uf = "Use a sigla do estado, com 2 letras.";
  }

  if (etapa === 2) {
    if (!d.area || d.area <= 0) erros.area = "Informe a área útil em m².";
    if (d.suites > d.dormitorios) erros.suites = "As suítes não podem passar do número de quartos.";
    if (d.operacao.includes("venda") && !d.precoVenda) {
      erros.precoVenda = "Informe o valor de venda.";
    }
    if (d.operacao.includes("locacao") && !d.precoLocacao) {
      erros.precoLocacao = "Informe o valor do aluguel mensal.";
    }
  }

  if (etapa === 3) {
    if (d.proprietarioNome.trim().length < 3) erros.proprietarioNome = "Informe seu nome.";
    if (apenasDigitos(d.proprietarioTelefone).length < 10) {
      erros.proprietarioTelefone = "Informe um telefone com DDD.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.proprietarioEmail.trim())) {
      erros.proprietarioEmail = "Informe um e-mail válido.";
    }
  }

  return erros;
}

/** as fotos enviadas ainda nao tem destino; o anuncio nasce com as do acervo */
const FOTOS_PROVISORIAS = [
  "/images/properties/imovel-03.jpg",
  "/images/properties/imovel-08.jpg",
  "/images/properties/imovel-12.jpg",
];

export async function criarAnuncio(d: DadosCaptacao): Promise<Property> {
  const codigo = proximoCodigo();
  const preco: Property["preco"] = {};
  if (d.operacao.includes("venda") && d.precoVenda) preco.venda = d.precoVenda;
  if (d.operacao.includes("locacao") && d.precoLocacao) preco.locacao = d.precoLocacao;

  return {
    id: codigo,
    codigo,
    slug: `${slugify(d.titulo)}-${slugify(d.bairro)}-${codigo.toLowerCase()}`,
    tipo: d.tipo,
    operacao: d.operacao,
    titulo: d.titulo.trim(),
    endereco: {
      rua: [d.rua.trim(), d.numero.trim()].filter(Boolean).join(", ") || undefined,
      bairro: d.bairro.trim(),
      cidade: d.cidade.trim(),
      uf: d.uf.trim().toUpperCase(),
    },
    area: d.area,
    dormitorios: d.dormitorios,
    suites: d.suites,
    banheiros: d.banheiros,
    vagas: d.vagas,
    preco,
    condominio: d.condominio || undefined,
    iptu: d.iptu || undefined,
    fotos: FOTOS_PROVISORIAS,
    comodidades: d.comodidades,
    publicadoEm: new Date().toISOString().slice(0, 10),
  };
}

/** o registro pronto para colar em src/data/properties.ts */
export function comoRegistro(imovel: Property, fotosEnviadas: string[]): string {
  const fotos = fotosEnviadas.length
    ? fotosEnviadas.map((nome) => `/images/properties/${slugify(nome.replace(/\.[^.]+$/, ""))}.jpg`)
    : imovel.fotos;

  return JSON.stringify({ ...imovel, fotos }, null, 2);
}

/** resumo textual para o corretor receber no WhatsApp */
export function comoMensagem(imovel: Property, d: DadosCaptacao): string {
  const linhas = [
    `Novo imóvel para captação — ${imovel.codigo}`,
    `${imovel.titulo} · ${imovel.endereco.bairro}, ${imovel.endereco.cidade}`,
    `${imovel.area} m² · ${imovel.dormitorios} quartos · ${imovel.vagas} vagas`,
    imovel.preco.venda ? `Venda: R$ ${imovel.preco.venda.toLocaleString("pt-BR")}` : null,
    imovel.preco.locacao ? `Aluguel: R$ ${imovel.preco.locacao.toLocaleString("pt-BR")}/mês` : null,
    ``,
    `Proprietário: ${d.proprietarioNome}`,
    `Telefone: ${d.proprietarioTelefone}`,
    `E-mail: ${d.proprietarioEmail}`,
  ];

  return linhas.filter((linha) => linha !== null).join("\n");
}
