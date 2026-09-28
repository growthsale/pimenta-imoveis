import type { Operacao, Property } from "@/types/property";
import { diasDesde, precoDe } from "./format";

export type Badge = { texto: string; tom: "novo" | "preco" };

/** anuncios publicados ha ate 7 dias ganham o selo de novo */
const DIAS_NOVO = 7;

/** quanto o preco/m2 precisa estar abaixo da media do tipo para virar destaque */
const MARGEM_OTIMO_PRECO = 0.85;

function precoPorM2(imovel: Property, operacao: Operacao): number {
  return imovel.area > 0 ? precoDe(imovel, operacao) / imovel.area : Infinity;
}

/**
 * Selos do card, no padrao do QuintoAndar.
 *
 * "Otimo preco" e relativo ao conjunto: compara o preco/m2 do imovel com a
 * media dos imoveis do mesmo tipo na mesma listagem. Quando a busca vier de uma
 * API, a media deve vir junto em vez de ser calculada no cliente.
 */
export function badgesDe(
  imovel: Property,
  operacao: Operacao,
  referencia: Property[],
  hoje?: Date
): Badge[] {
  const badges: Badge[] = [];

  if (diasDesde(imovel.publicadoEm, hoje) <= DIAS_NOVO) {
    badges.push({ texto: "Anúncio novo", tom: "novo" });
  }

  const pares = referencia.filter(
    (outro) => outro.tipo === imovel.tipo && outro.area > 0 && outro.operacao.includes(operacao)
  );

  if (pares.length >= 3) {
    const media = pares.reduce((soma, p) => soma + precoPorM2(p, operacao), 0) / pares.length;
    if (precoPorM2(imovel, operacao) < media * MARGEM_OTIMO_PRECO) {
      badges.push({ texto: "Ótimo preço", tom: "preco" });
    }
  }

  return badges;
}
