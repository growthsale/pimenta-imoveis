import type { Operacao, Property } from "@/types/property";
import { LABEL_OPERACAO, LABEL_TIPO } from "@/types/property";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function formatBRL(valor: number): string {
  return brl.format(valor);
}

export function formatArea(m2: number): string {
  return `${m2.toLocaleString("pt-BR")} m²`;
}

/** preco da operacao pedida, com fallback para a primeira anunciada */
export function precoDe(imovel: Property, operacao?: Operacao): number {
  if (operacao && imovel.preco[operacao] !== undefined) {
    return imovel.preco[operacao] as number;
  }
  const primeira = imovel.operacao[0];
  return imovel.preco[primeira] ?? 0;
}

/** linha de specs do card: "240 m² · 4 quartos · 3 vagas" */
export function formatSpecs(imovel: Property): string {
  const partes = [formatArea(imovel.area)];

  if (imovel.dormitorios > 0) {
    partes.push(`${imovel.dormitorios} ${imovel.dormitorios === 1 ? "quarto" : "quartos"}`);
  }
  if (imovel.vagas > 0) {
    partes.push(`${imovel.vagas} ${imovel.vagas === 1 ? "vaga" : "vagas"}`);
  }

  return partes.join(" · ");
}

export function formatEndereco(imovel: Property): string {
  const { rua, bairro, cidade, uf } = imovel.endereco;
  return [rua, bairro, `${cidade} - ${uf}`].filter(Boolean).join(", ");
}

/** headline do card, no padrao do QuintoAndar */
export function formatHeadline(imovel: Property, operacao?: Operacao): string {
  const op = operacao && imovel.operacao.includes(operacao) ? operacao : imovel.operacao[0];
  const tipo = LABEL_TIPO[imovel.tipo].toLowerCase();
  const base = `${LABEL_OPERACAO[op]} ${tipo} em ${imovel.endereco.bairro}`;

  if (imovel.dormitorios === 0) return base;
  return `${base}, ${imovel.dormitorios} ${imovel.dormitorios === 1 ? "quarto" : "quartos"}`;
}

/** "Cond. R$ 1.200 + IPTU R$ 310" — null quando nao ha nenhum dos dois */
export function formatCustosExtras(imovel: Property): string | null {
  const partes: string[] = [];
  if (imovel.condominio) partes.push(`Cond. ${formatBRL(imovel.condominio)}`);
  if (imovel.iptu) partes.push(`IPTU ${formatBRL(imovel.iptu)}`);
  return partes.length ? partes.join(" + ") : null;
}

/** dias desde a publicacao — usado pelo selo "Anuncio novo" e pelo filtro de data */
export function diasDesde(isoDate: string, hoje = new Date()): number {
  const publicado = new Date(`${isoDate}T00:00:00`);
  const ms = hoje.getTime() - publicado.getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}
