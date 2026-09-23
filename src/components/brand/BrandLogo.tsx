import BrandMark from "./BrandMark";

type Props = {
  /** "on-dark" sobre hero/footer, "on-light" sobre superficies brancas */
  variant?: "on-dark" | "on-light";
  size?: "sm" | "md";
  className?: string;
};

/**
 * Lockup da Pimenta Imoveis, reproduzindo o logo enviado pelo cliente:
 * marca "P" | filete vertical | PIMENTA Imoveis.
 *
 * O wordmark e texto (nao imagem) para escalar bem em qualquer largura e
 * continuar nitido/selecionavel. O amarelo da marca (--color-brand) so aparece
 * sobre fundo escuro; sobre branco entra o brand-ink, o mesmo matiz em um tom
 * que passa em contraste.
 */
export default function BrandLogo({
  variant = "on-light",
  size = "md",
  className = "",
}: Props) {
  const onDark = variant === "on-dark";
  const markSize = size === "sm" ? 20 : 26;

  return (
    <span className={`inline-flex items-center gap-2.5 md:gap-3 ${className}`}>
      <BrandMark
        size={markSize}
        className={onDark ? "text-brand" : "text-shark"}
      />

      <span
        aria-hidden="true"
        className={`block w-px self-stretch ${onDark ? "bg-white/30" : "bg-shark-300"}`}
      />

      <span
        className={`font-sans font-bold uppercase leading-none tracking-[0.01em] ${
          size === "sm" ? "text-[15px]" : "text-[16px] md:text-[18px]"
        } ${onDark ? "text-white" : "text-shark"}`}
      >
        Pimenta{" "}
        <span
          className={`font-normal normal-case ${onDark ? "text-brand" : "text-brand-ink"}`}
        >
          Imóveis
        </span>
      </span>
    </span>
  );
}
