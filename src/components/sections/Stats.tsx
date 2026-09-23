import SectionWrapper from "@/components/ui/SectionWrapper";
import { stats } from "@/data/stats";

/**
 * "A Coelho em números" reinterpretada: 4 ds-card centralizados.
 */
export default function Stats() {
  return (
    <SectionWrapper className="bg-white">
      <div className="text-center">
        <h2 className="font-serif text-[28px] font-medium leading-tight text-shark md:text-[34px]">
          A Pimenta em <span className="font-normal text-shark-500">números</span>
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-[14px] leading-relaxed text-shark-500 md:text-[16px]">
          Três décadas de mercado construídas negócio a negócio, com o cuidado de
          uma empresa familiar e o alcance de uma imobiliária completa.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:mt-10 md:gap-8 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.legenda} className="ds-card p-4 text-center sm:p-6 md:p-8">
            <div className="font-sans text-[26px] font-semibold leading-none text-shark sm:text-[34px] md:text-[40px]">
              {item.valor}
            </div>
            <div className="ds-tech mt-3">{item.legenda}</div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
