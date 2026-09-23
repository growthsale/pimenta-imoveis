/**
 * Cabecalho de secao no padrao "Family Business" do Coelho:
 * filete ds-rule (amarelo da marca + shark) + label em caixa alta.
 */
export default function SectionHeading({
  label,
  titulo,
  descricao,
  align = "left",
}: {
  label: string;
  titulo?: string;
  descricao?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";

  return (
    <div className={centered ? "text-center" : ""}>
      <h2 className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <span className="ds-rule" aria-hidden="true" />
        <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-shark">
          {label}
        </span>
      </h2>

      {titulo && (
        <p className="mt-5 font-serif text-[28px] font-medium leading-tight text-shark md:text-[34px]">
          {titulo}
        </p>
      )}

      {descricao && (
        <p
          className={`mt-4 text-[14px] leading-relaxed text-shark-500 md:text-[16px] ${
            centered ? "mx-auto max-w-3xl" : "max-w-2xl"
          }`}
        >
          {descricao}
        </p>
      )}
    </div>
  );
}
