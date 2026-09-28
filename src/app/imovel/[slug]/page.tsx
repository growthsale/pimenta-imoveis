import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import { asset } from "@/lib/asset";
import { porSlug, relacionados, todosOsSlugs } from "@/lib/search";
import {
  formatArea,
  formatBRL,
  formatEndereco,
  formatHeadline,
  precoDe,
} from "@/lib/format";
import { LABEL_COMODIDADE, LABEL_OPERACAO, LABEL_TIPO } from "@/types/property";

type Props = { params: Promise<{ slug: string }> };

/** o export estatico precisa da lista completa de rotas em tempo de build */
export async function generateStaticParams() {
  const slugs = await todosOsSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const imovel = await porSlug(slug);
  if (!imovel) return { title: "Imóvel não encontrado | Pimenta Imóveis" };

  return {
    title: `${imovel.titulo} em ${imovel.endereco.bairro} | Pimenta Imóveis`,
    description: `${formatHeadline(imovel)} — ${formatArea(imovel.area)}, ${imovel.codigo}.`,
  };
}

export default async function ImovelPage({ params }: Props) {
  const { slug } = await params;
  const imovel = await porSlug(slug);
  if (!imovel) notFound();

  const sugestoes = await relacionados(imovel);
  const [capa, ...demais] = imovel.fotos;

  return (
    <div className="ds-container pb-16 pt-24 md:pt-28">
      <Link href="/busca" className="ds-tech inline-flex items-center gap-2 hover:text-shark">
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true">
          <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Voltar para a busca
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-[2fr_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-shark-100 md:aspect-[3/2]">
          <Image
            src={asset(capa)}
            alt={`${imovel.titulo} em ${imovel.endereco.bairro}`}
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="hidden grid-rows-2 gap-2 md:grid">
          {demais.slice(0, 2).map((foto, i) => (
            <div key={foto} className="relative overflow-hidden rounded-[16px] bg-shark-100">
              <Image
                src={asset(foto)}
                alt={`${imovel.titulo} — foto ${i + 2}`}
                fill
                sizes="33vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <span className="ds-tag-code">{LABEL_TIPO[imovel.tipo]}</span>

          <h1 className="mt-4 font-serif text-[30px] leading-tight text-shark md:text-[40px]">
            {imovel.titulo}
          </h1>
          <p className="ds-tech mt-2">{formatEndereco(imovel)}</p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-y border-shark-100 py-6 sm:grid-cols-4">
            {[
              { rotulo: "Área", valor: formatArea(imovel.area) },
              { rotulo: "Quartos", valor: imovel.dormitorios || "—" },
              { rotulo: "Suítes", valor: imovel.suites || "—" },
              { rotulo: "Vagas", valor: imovel.vagas || "—" },
            ].map((item) => (
              <div key={item.rotulo}>
                <dt className="ds-tech">{item.rotulo}</dt>
                <dd className="mt-1 font-sans text-[20px] font-semibold text-shark">{item.valor}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-8 font-serif text-[22px] text-shark">Sobre o imóvel</h2>
          {/* TODO: substituir pelo descritivo real de cada imóvel */}
          <p className="mt-3 max-w-[65ch] text-[15px] leading-relaxed text-shark-500">
            {imovel.titulo} de {formatArea(imovel.area)} em {imovel.endereco.bairro},{" "}
            {imovel.endereco.cidade}. São {imovel.dormitorios || "nenhum"} quarto
            {imovel.dormitorios === 1 ? "" : "s"}
            {imovel.suites > 0 && `, sendo ${imovel.suites} suíte${imovel.suites === 1 ? "" : "s"}`},{" "}
            {imovel.banheiros} banheiro{imovel.banheiros === 1 ? "" : "s"} e {imovel.vagas} vaga
            {imovel.vagas === 1 ? "" : "s"} de garagem.
          </p>

          {imovel.comodidades.length > 0 && (
            <>
              <h2 className="mt-8 font-serif text-[22px] text-shark">O que este imóvel oferece</h2>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {imovel.comodidades.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-[15px] text-shark">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-ink" aria-hidden="true" />
                    {LABEL_COMODIDADE[c]}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="ds-card p-6">
            {imovel.operacao.map((op) => (
              <div key={op} className="mb-4 last:mb-0">
                <p className="ds-tech">{LABEL_OPERACAO[op]}</p>
                <p className="font-sans text-[28px] font-semibold leading-none text-shark">
                  {formatBRL(precoDe(imovel, op))}
                  {op === "locacao" && <span className="ds-tech"> /mês</span>}
                </p>
              </div>
            ))}

            <dl className="mt-5 space-y-2 border-t border-shark-100 pt-5 text-[14px]">
              {imovel.condominio && (
                <div className="flex justify-between gap-3">
                  <dt className="text-shark-500">Condomínio</dt>
                  <dd className="tabular-nums">{formatBRL(imovel.condominio)}</dd>
                </div>
              )}
              {imovel.iptu && (
                <div className="flex justify-between gap-3">
                  <dt className="text-shark-500">IPTU</dt>
                  <dd className="tabular-nums">{formatBRL(imovel.iptu)}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-shark-500">Código</dt>
                <dd>{imovel.codigo}</dd>
              </div>
            </dl>

            <Link href="/contato" className="ds-btn-primary mt-6 w-full">
              Agendar visita
            </Link>
            <Link href="/contato" className="ds-btn-secondary mt-2 w-full">
              Falar com um corretor
            </Link>
          </div>
        </aside>
      </div>

      {sugestoes.length > 0 && (
        <section className="mt-16 border-t border-shark-100 pt-12">
          <h2 className="font-serif text-[26px] text-shark">Imóveis parecidos</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sugestoes.map((sugestao) => (
              <PropertyCard
                key={sugestao.id}
                imovel={sugestao}
                operacao={sugestao.operacao[0]}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 90vw"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
