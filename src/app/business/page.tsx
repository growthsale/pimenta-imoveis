import type { Metadata } from "next";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { searchProperties, SEARCH_PADRAO } from "@/lib/search";

export const metadata: Metadata = {
  title: "Pimenta Business | Imóveis comerciais",
  description:
    "Lajes corporativas, conjuntos, lojas e prédios para locação e venda, com a curadoria da Pimenta.",
};

/** TODO: revisar com a Pimenta */
const frentes = [
  {
    titulo: "Locação corporativa",
    texto:
      "Lajes e conjuntos para empresas que precisam de metragem certa, prazo definido e contrato que não trave a operação.",
  },
  {
    titulo: "Venda comercial",
    texto:
      "Salas, lojas de rua e prédios inteiros para investidor e ocupante, com leitura de rentabilidade e de vizinhança.",
  },
  {
    titulo: "Incorporação e retrofit",
    texto:
      "Intermediação de terrenos e imóveis com potencial construtivo, da prospecção à mesa de negociação.",
  },
];

export default async function BusinessPage() {
  // mesma camada de busca da /busca — a carteira comercial e um recorte, nao outra base
  const { items } = await searchProperties({
    ...SEARCH_PADRAO,
    operacao: "locacao",
    tipo: ["comercial"],
  });

  return (
    <>
      <section className="relative bg-shark pb-16 pt-28 md:pb-24 md:pt-40">
        <div className="ds-container">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            Pimenta Business
          </p>
          <h1 className="mt-5 max-w-[18ch] font-serif text-[34px] font-normal leading-[1.08] text-white md:text-[56px]">
            O lado comercial de quem conhece o bairro
          </h1>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-white/70 md:text-[18px]">
            A mesma leitura de mercado que a Pimenta aplica ao residencial, voltada
            para quem decide por metro quadrado, prazo e retorno.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/busca?tipo=comercial&operacao=locacao"
              className="ds-btn-primary bg-brand px-6 text-shark hover:bg-brand-600"
            >
              Ver carteira comercial
            </Link>
            <Link
              href="/contato"
              className="ds-btn-secondary border-white/20 px-6 text-white hover:border-white/40 hover:bg-white/10"
            >
              Falar com o time comercial
            </Link>
          </div>
        </div>
      </section>

      <SectionWrapper>
        <SectionHeading
          label="Frentes de atuação"
          titulo="Três formas de trabalhar o comercial"
        />

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {frentes.map((frente) => (
            <div key={frente.titulo} className="border-t-2 border-shark-100 pt-5">
              <h3 className="font-serif text-[22px] leading-snug text-shark">{frente.titulo}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-shark-500">{frente.texto}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* TODO: confirmar com a Pimenta o histórico em Pinheiros e o número de
          transações antes de publicar — é uma afirmação factual sobre a empresa */}
      <SectionWrapper className="bg-shark-50">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="ds-label">Prova de casa</p>
            <h2 className="mt-5 font-serif text-[28px] font-normal leading-tight text-shark md:text-[38px]">
              Pinheiros não virou o que é sozinho
            </h2>
          </div>

          <div>
            <p className="text-[16px] leading-relaxed text-shark md:text-[17px]">
              Ao longo de três décadas, a Pimenta participou ativamente da construção e
              da revigoração de Pinheiros — intermediando incorporações, retrofits e
              transações comerciais que mudaram o desenho do bairro.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-shark-500">
              É esse histórico que sustenta a leitura de vizinhança que a Pimenta
              Business leva para cada negociação: quem já viu a quadra mudar sabe
              precificar o que vem depois.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {items.length > 0 && (
        <SectionWrapper className="bg-white">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading label="Disponíveis agora" titulo="Da carteira comercial" />
            <Link href="/busca?tipo=comercial" className="ds-btn-secondary px-5">
              Ver todos
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 4).map((imovel) => (
              <PropertyCard
                key={imovel.id}
                imovel={imovel}
                operacao="locacao"
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
              />
            ))}
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
