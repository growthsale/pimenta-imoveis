import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import FamilyBusiness from "@/components/sections/FamilyBusiness";
import Stats from "@/components/sections/Stats";
import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Sobre a Pimenta | Pimenta Imóveis",
  description:
    "Três décadas de mercado imobiliário construídas negócio a negócio, com o cuidado de uma empresa familiar.",
};

/** TODO: datas e marcos reais — confirmar com a Pimenta */
const marcos = [
  {
    periodo: "Anos 1990",
    titulo: "O primeiro escritório",
    texto:
      "A Pimenta nasce atendendo compradores e proprietários de um punhado de ruas, com uma carteira que cabia em uma pasta.",
  },
  {
    periodo: "Anos 2000",
    titulo: "A virada de Pinheiros",
    texto:
      "O bairro se adensa e a Pimenta passa a intermediar incorporações e retrofits, acompanhando a transformação de dentro.",
  },
  {
    periodo: "Anos 2010",
    titulo: "A segunda geração",
    texto:
      "Os filhos entram na operação e a empresa amplia a atuação para locação administrada e imóveis comerciais.",
  },
  {
    periodo: "Hoje",
    titulo: "Residencial e comercial",
    texto:
      "Duas frentes sob o mesmo cuidado: a Pimenta Imóveis, residencial, e a Pimenta Business, comercial.",
  },
];

/** TODO: revisar os valores com a Pimenta */
const valores = [
  {
    titulo: "A mesma equipe do início ao fim",
    texto:
      "Quem faz a avaliação é quem acompanha a escritura. Sem repasse entre departamentos, sem recomeçar a conversa.",
  },
  {
    titulo: "Preço com lastro",
    texto:
      "A avaliação parte do que foi efetivamente negociado no bairro. Anúncio não é referência de mercado.",
  },
  {
    titulo: "Carteira curada",
    texto:
      "Preferimos apresentar cinco imóveis que fazem sentido a cinquenta que enchem a lista.",
  },
];

export default function SobrePage() {
  return (
    <>
      <section className="bg-shark-50 pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="ds-container">
          <p className="ds-label">Sobre a Pimenta</p>
          <h1 className="mt-5 max-w-[20ch] font-serif text-[34px] font-normal leading-[1.08] text-shark md:text-[56px]">
            Uma imobiliária que cresceu junto com o bairro
          </h1>
          {/* TODO: substituir pelo texto institucional real */}
          <p className="mt-6 max-w-[62ch] text-[16px] leading-relaxed text-shark-500 md:text-[18px]">
            São mais de três décadas atendendo as mesmas famílias — e agora os filhos
            delas. A Pimenta cresceu sem virar um balcão: cada negócio ainda passa por
            alguém que conhece a rua, o prédio e o histórico de preço da região.
          </p>
        </div>
      </section>

      <SectionWrapper className="bg-white">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-16">
          {/* foto de acervo da familia — a moldura branca e do proprio papel */}
          <figure className="mx-auto w-full max-w-[420px]">
            <Image
              src={asset("/images/historia/primeira-sede.jpg")}
              alt="Fachada da primeira sede da Pimenta Imóveis, com a placa PIMENTA imóveis — compra, vende, administra — e um carro na garagem"
              width={1236}
              height={1600}
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 90vw"
              className="w-full rounded-[4px] shadow-[0_18px_40px_-16px_rgba(29,29,31,0.45)]"
            />
            <figcaption className="ds-tech mt-4">
              A primeira sede, em foto do acervo da família.
              {/* TODO: confirmar o ano e o endereço com a Pimenta */}
            </figcaption>
          </figure>

          <div>
            <p className="ds-label text-brand-ink">Onde tudo começou</p>

            <h2 className="mt-5 font-serif text-[28px] font-normal leading-tight text-shark md:text-[38px]">
              Um sobrado, uma placa e um telefone de sete dígitos
            </h2>

            <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-shark-500">
              <span className="text-shark">Compra · Vende · Administra.</span> A placa já
              dizia tudo o que a Pimenta faria pelas três décadas seguintes — e o
              &ldquo;sede própria&rdquo; no canto direito era o orgulho de quem tinha acabado
              de sair do aluguel.
            </p>

            <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-shark-500">
              O escritório funcionava no andar de cima, o carro da empresa dormia na
              garagem e a carteira inteira cabia em um fichário. O que mudou desde então
              foi a escala; o jeito de atender continua o mesmo.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeading
          label="Nossa história"
          titulo="Três décadas, negócio a negócio"
        />

        <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {marcos.map((marco) => (
            <li key={marco.periodo} className="border-t-2 border-shark-100 pt-5">
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.12em] text-brand-ink">
                {marco.periodo}
              </p>
              <h3 className="mt-3 font-serif text-[20px] leading-snug text-shark">
                {marco.titulo}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-shark-500">{marco.texto}</p>
            </li>
          ))}
        </ol>
      </SectionWrapper>

      <FamilyBusiness />

      <SectionWrapper className="bg-white">
        <SectionHeading label="No que acreditamos" align="center" />

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {valores.map((valor) => (
            <div key={valor.titulo} className="ds-card p-6 md:p-8">
              <h3 className="font-serif text-[20px] leading-snug text-shark">{valor.titulo}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-shark-500">{valor.texto}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <Stats />

      <SectionWrapper className="bg-shark">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-[28px] font-normal leading-tight text-white md:text-[36px]">
            Vamos conversar sobre o seu imóvel?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">
            Seja para vender, alugar ou encontrar o próximo endereço, começa com uma
            conversa sem compromisso.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contato" className="ds-btn-primary bg-brand px-6 text-shark hover:bg-brand-600">
              Falar com a Pimenta
            </Link>
            <Link
              href="/busca"
              className="ds-btn-secondary border-white/20 px-6 text-white hover:border-white/40 hover:bg-white/10"
            >
              Ver imóveis disponíveis
            </Link>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
