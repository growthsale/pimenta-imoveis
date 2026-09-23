import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { family } from "@/data/family";

/**
 * Family Business do Coelho da Fonseca, adaptada de 3 para 4 membros.
 * Retrato circular com grayscale que colore no hover + anel sutil.
 * As fotos são 5:8, então o enquadramento é ancorado pelo objectPosition de cada membro.
 */
export default function FamilyBusiness() {
  return (
    <SectionWrapper>
      <div className="w-full">
        <h2 className="flex items-center gap-3">
          <span className="ds-rule" aria-hidden="true" />
          <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-shark">
            Family Business
          </span>
        </h2>

        <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-shark-500 md:text-[16px]">
          Uma empresa familiar construída sobre relações de confiança. Conheça quem
          está por trás de cada negociação da Pimenta Imóveis.
        </p>

        <div className="mx-auto mt-10 flex max-w-5xl flex-col items-center md:mt-14">
          {/* duas colunas ja no celular: quatro retratos de 208px empilhados deixavam a secao longa demais */}
          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-10 sm:gap-10 md:gap-12 lg:grid-cols-4">
            {family.map((membro) => (
              <div
                key={membro.nome}
                className="group flex w-full flex-col items-center text-center"
              >
                {/* o retrato acompanha a coluna em vez de ter lado fixo, para caber em telas de 320px */}
                <div className="relative aspect-square w-full max-w-[208px] overflow-hidden rounded-full bg-shark-50 ring-0 transition group-hover:ring-2 group-hover:ring-brand-ink/30 lg:max-w-[224px]">
                  <Image
                    src={membro.foto}
                    alt={`${membro.nome}, ${membro.cargo} da Pimenta Imóveis`}
                    fill
                    sizes="(min-width: 1024px) 224px, (min-width: 640px) 208px, 42vw"
                    className="object-cover grayscale transition duration-500 group-hover:grayscale-0"
                    style={{ objectPosition: membro.objectPosition ?? "center top" }}
                  />
                </div>

                <p className="mt-4 max-w-[220px] font-serif text-[15px] leading-snug text-shark md:text-[16px]">
                  {membro.nome}
                </p>
                <p className="ds-tech mt-1">{membro.cargo}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
