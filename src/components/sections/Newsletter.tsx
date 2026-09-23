import SectionWrapper from "@/components/ui/SectionWrapper";

/**
 * Newsletter no padrão do Coelho: bloco escuro de largura total.
 */
export default function Newsletter() {
  return (
    <SectionWrapper className="bg-shark">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand">
          Newsletter
        </p>
        <h2 className="mt-4 font-serif text-[28px] font-normal leading-tight text-white md:text-[36px]">
          Tenha propriedade sobre o mercado imobiliário
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-white/70 md:text-[16px]">
          Receba a curadoria da Pimenta com lançamentos, oportunidades e leitura de
          mercado. Sem excesso, só o que importa.
        </p>

        <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Seu e-mail
          </label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            placeholder="Seu melhor e-mail"
            className="ds-input border-white/15 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white/40 focus-visible:bg-white/15"
          />
          <button
            type="submit"
            className="ds-btn-primary shrink-0 bg-brand px-8 text-shark hover:bg-brand-600"
          >
            Assinar
          </button>
        </form>
      </div>
    </SectionWrapper>
  );
}
