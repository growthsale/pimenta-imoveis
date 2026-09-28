import Link from "next/link";
import { contato, linkWhatsApp } from "@/data/contato";

type Props = {
  titulo: string;
  descricao: string;
};

/**
 * Pagina-ponte para as rotas ainda nao construidas. Existe para que nenhum link
 * do header, do mega-menu ou do rodape caia em 404 durante o prototipo — e para
 * que o visitante tenha um caminho real (WhatsApp) em vez de um beco.
 */
export default function EmBreve({ titulo, descricao }: Props) {
  return (
    <div className="ds-container flex min-h-[60svh] flex-col justify-center pb-20 pt-32 md:pt-40">
      <div className="max-w-[56ch]">
        <p className="ds-label">Em breve</p>

        <h1 className="mt-5 font-serif text-[34px] font-normal leading-[1.08] text-shark md:text-[52px]">
          {titulo}
        </h1>

        <p className="mt-6 text-[16px] leading-relaxed text-shark-500 md:text-[18px]">
          {descricao}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn-primary px-6"
          >
            Falar no WhatsApp
          </a>
          <Link href="/busca" className="ds-btn-secondary px-6">
            Ver imóveis
          </Link>
        </div>

        {/* TODO: dados reais em src/data/contato.ts */}
        <dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-5 border-t border-shark-100 pt-8 sm:grid-cols-2">
          {[
            { rotulo: "Telefone", valor: contato.telefone },
            { rotulo: "E-mail", valor: contato.email },
            { rotulo: "Endereço", valor: contato.endereco },
          ].map((item) => (
            <div key={item.rotulo} className="min-w-0">
              <dt className="ds-tech">{item.rotulo}</dt>
              <dd className="mt-1 break-words text-[15px] text-shark">{item.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
