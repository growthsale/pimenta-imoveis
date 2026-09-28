import Link from "next/link";
import SectionWrapper from "@/components/ui/SectionWrapper";

/**
 * Ponte para o braco B2B. A home e residencial (B2C); quem procura laje,
 * conjunto ou predio sai daqui para /business.
 */
export default function BusinessTeaser() {
  return (
    <SectionWrapper className="bg-shark">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
            Pimenta Business
          </p>

          <h2 className="mt-4 font-serif text-[30px] font-normal leading-tight text-white md:text-[40px]">
            A carteira comercial da Pimenta
          </h2>

          <p className="mt-5 max-w-[56ch] text-[15px] leading-relaxed text-white/70 md:text-[16px]">
            Lajes corporativas, conjuntos, lojas de rua e prédios inteiros — locação e
            venda para quem decide por metro quadrado e por prazo de retorno, não por
            planta de apartamento.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/business" className="ds-btn-primary bg-brand px-6 text-shark hover:bg-brand-600">
              Conhecer a Pimenta Business
            </Link>
            <Link
              href="/busca?tipo=comercial"
              className="ds-btn-secondary border-white/20 px-6 text-white hover:border-white/40 hover:bg-white/10"
            >
              Ver imóveis comerciais
            </Link>
          </div>
        </div>

        {/* TODO: confirmar com a Pimenta o número de transações antes de publicar */}
        <figure className="border-l-2 border-brand pl-6 md:pl-8">
          <blockquote className="font-serif text-[22px] leading-snug text-white md:text-[26px]">
            Pinheiros mudou de cara nas últimas três décadas — e a Pimenta esteve na
            mesa de boa parte dessas negociações.
          </blockquote>
          <figcaption className="mt-5 text-[14px] leading-relaxed text-white/60">
            Intermediação de incorporações, retrofits e transações comerciais que
            ajudaram a revigorar o bairro.
          </figcaption>
        </figure>
      </div>
    </SectionWrapper>
  );
}
