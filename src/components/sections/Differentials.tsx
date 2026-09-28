import SectionWrapper from "@/components/ui/SectionWrapper";
import SectionHeading from "@/components/ui/SectionHeading";
import { servicos, type Servico } from "@/data/services";

/** traços simples, na mesma espessura do resto da interface (1.5px) */
const ICONES: Record<Servico["icone"], React.ReactNode> = {
  avaliacao: (
    <>
      <path d="M3 21h18M6 21V10M12 21V4M18 21v-8" />
      <path d="M3 10l3-3 6 6 6-9" />
    </>
  ),
  curadoria: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4.5-4.5" />
      <path d="M8.5 11.5l2 2 4-4.5" />
    </>
  ),
  locacao: (
    <>
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </>
  ),
  documentacao: (
    <>
      <path d="M14 3H6v18h12V7z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
};

/**
 * O que a Pimenta faz, entre os destaques e o Family Business — responde a
 * pergunta que o visitante faz depois de ver os imoveis.
 */
export default function Differentials() {
  return (
    <SectionWrapper>
      <SectionHeading
        label="Como trabalhamos"
        titulo="Três décadas de bairro, não de anúncio"
        descricao="A Pimenta acompanha o negócio inteiro — da avaliação à escritura — com a mesma equipe do início ao fim."
      />

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
        {servicos.map((servico) => (
          <div key={servico.titulo}>
            <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-shark text-brand">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {ICONES[servico.icone]}
              </svg>
            </span>

            <h3 className="mt-5 font-serif text-[20px] leading-snug text-shark">
              {servico.titulo}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-shark-500">{servico.descricao}</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
