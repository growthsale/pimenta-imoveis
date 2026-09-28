/**
 * Modelo de dominio do imovel.
 *
 * Tudo que entra em filtro, ordenacao ou conta e numero — a formatacao mora em
 * src/lib/format.ts. O modelo anterior guardava "R$ 2.450.000" e "240 m2" como
 * string, o que inviabilizava a busca.
 */

export type Operacao = "venda" | "locacao";

export const TIPOS = [
  "apartamento",
  "casa",
  "condominio",
  "comercial",
  "terreno",
  "rural",
] as const;
export type TipoImovel = (typeof TIPOS)[number];

export const COMODIDADES = [
  "piscina",
  "academia",
  "elevador",
  "portaria24h",
  "churrasqueira",
  "varanda",
  "mobiliado",
  "petFriendly",
  "proximoMetro",
  "salaoFestas",
  "arCondicionado",
  "coworking",
] as const;
export type Comodidade = (typeof COMODIDADES)[number];

export type Endereco = {
  rua?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

export type Property = {
  id: string;
  codigo: string;
  slug: string;
  tipo: TipoImovel;
  /** um mesmo imovel pode estar anunciado para venda e para locacao */
  operacao: Operacao[];
  titulo: string;
  endereco: Endereco;
  /** area util em m2 */
  area: number;
  dormitorios: number;
  suites: number;
  banheiros: number;
  vagas: number;
  /** em reais; locacao e o valor mensal */
  preco: Partial<Record<Operacao, number>>;
  condominio?: number;
  iptu?: number;
  fotos: string[];
  comodidades: Comodidade[];
  /** ISO YYYY-MM-DD — alimenta o filtro de data e o selo "Anuncio novo" */
  publicadoEm: string;
  destaque?: boolean;
};

export const LABEL_OPERACAO: Record<Operacao, string> = {
  venda: "Comprar",
  locacao: "Alugar",
};

export const LABEL_TIPO: Record<TipoImovel, string> = {
  apartamento: "Apartamento",
  casa: "Casa",
  condominio: "Casa de condomínio",
  comercial: "Comercial",
  terreno: "Terreno",
  rural: "Rural",
};

export const LABEL_TIPO_PLURAL: Record<TipoImovel, string> = {
  apartamento: "Apartamentos",
  casa: "Casas",
  condominio: "Casas de condomínio",
  comercial: "Comerciais",
  terreno: "Terrenos",
  rural: "Rurais",
};

export const LABEL_COMODIDADE: Record<Comodidade, string> = {
  piscina: "Piscina",
  academia: "Academia",
  elevador: "Elevador",
  portaria24h: "Portaria 24h",
  churrasqueira: "Churrasqueira",
  varanda: "Varanda",
  mobiliado: "Mobiliado",
  petFriendly: "Aceita pet",
  proximoMetro: "Próximo ao metrô",
  salaoFestas: "Salão de festas",
  arCondicionado: "Ar-condicionado",
  coworking: "Coworking",
};
