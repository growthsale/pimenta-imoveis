export type Property = {
  id: string;
  titulo: string;
  bairro: string;
  area: string;
  dormitorios: number;
  vagas: number;
  preco: string;
  codigo: string;
  foto: string;
  href: string;
};

/**
 * Placeholder até a integração com a base de imóveis.
 * O formato acompanha o card do Coelho: foto vertical, titulo, bairro, metragem e preço.
 */
export const properties: Property[] = [
  { id: "1", titulo: "Cobertura Duplex",       bairro: "Centro",        area: "240 m²", dormitorios: 4, vagas: 3, preco: "R$ 2.450.000", codigo: "PI-1024", foto: "", href: "/imovel/pi-1024" },
  { id: "2", titulo: "Apartamento Garden",     bairro: "Jardim Sul",    area: "180 m²", dormitorios: 3, vagas: 2, preco: "R$ 1.380.000", codigo: "PI-1087", foto: "", href: "/imovel/pi-1087" },
  { id: "3", titulo: "Casa em Condomínio",     bairro: "Alphaville",    area: "320 m²", dormitorios: 4, vagas: 4, preco: "R$ 3.100.000", codigo: "PI-1155", foto: "", href: "/imovel/pi-1155" },
  { id: "4", titulo: "Apartamento Alto Padrão",bairro: "Vila Nova",     area: "145 m²", dormitorios: 3, vagas: 2, preco: "R$ 1.120.000", codigo: "PI-1203", foto: "", href: "/imovel/pi-1203" },
  { id: "5", titulo: "Sobrado Moderno",        bairro: "Parque das Acácias", area: "210 m²", dormitorios: 3, vagas: 3, preco: "R$ 1.650.000", codigo: "PI-1288", foto: "", href: "/imovel/pi-1288" },
];
