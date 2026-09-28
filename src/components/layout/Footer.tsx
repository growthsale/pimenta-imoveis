import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { contato, linkWhatsApp } from "@/data/contato";
import { areaLinks, institutionalLinks } from "@/data/navigation";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-shark text-white">
      <div className="ds-container py-12 md:py-16">
        {/* no celular as colunas de links viram duas, e o bloco da marca ocupa a linha inteira */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 md:gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Pimenta Imóveis — página inicial">
              <BrandLogo variant="on-dark" />
            </Link>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-relaxed text-white/60">
              Curadoria de imóveis de alto padrão, com o cuidado de uma empresa
              familiar.
            </p>
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              Imóveis
            </p>
            <ul className="mt-4 space-y-2.5">
              {areaLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/80 transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              Institucional
            </p>
            <ul className="mt-4 space-y-2.5">
              {institutionalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-white/80 transition hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">
              Contato
            </p>
            {/* TODO: dados reais em src/data/contato.ts */}
            <ul className="mt-4 space-y-2.5 text-[14px] text-white/80">
              <li>{contato.endereco}</li>
              <li>
                <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer" className="transition hover:text-brand">
                  WhatsApp {contato.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={`mailto:${contato.email}`} className="transition hover:text-brand">
                  {contato.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {ano} Pimenta Imóveis. Todos os direitos reservados.</p>
          <p>{contato.creci}</p>
        </div>
      </div>
    </footer>
  );
}
