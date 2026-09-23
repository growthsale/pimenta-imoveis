export type NavLink = { label: string; href: string; external?: boolean };
export type RegionTab = { id: string; label: string };

export const regionTabs: RegionTab[] = [
  { id: "venda",       label: "Comprar" },
  { id: "locacao",     label: "Alugar" },
  { id: "lancamentos", label: "Lançamentos" },
  { id: "campo",       label: "Campo" },
  { id: "praia",       label: "Praia" },
];

export const institutionalLinks: NavLink[] = [
  { label: "Anuncie seu imóvel", href: "/anuncie" },
  { label: "Sobre a Pimenta",    href: "/sobre" },
  { label: "Blog",               href: "/blog" },
  { label: "Contato",            href: "/contato" },
];

export const areaLinks: NavLink[] = [
  { label: "Apartamentos",  href: "/busca?tipo=apartamento" },
  { label: "Casas",         href: "/busca?tipo=casa" },
  { label: "Condomínios",   href: "/busca?tipo=condominio" },
  { label: "Comercial",     href: "/busca?tipo=comercial" },
  { label: "Terrenos",      href: "/busca?tipo=terreno" },
  { label: "Rural",         href: "/busca?tipo=rural" },
];
