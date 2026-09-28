import { Suspense } from "react";
import type { Metadata } from "next";
import BuscaConteudo from "@/components/search/BuscaConteudo";

export const metadata: Metadata = {
  title: "Buscar imóveis | Pimenta Imóveis",
  description:
    "Apartamentos, casas, condomínios e imóveis comerciais para comprar ou alugar, com a curadoria da Pimenta Imóveis.",
};

/**
 * A busca le o estado da URL com useSearchParams, o que exige uma fronteira de
 * Suspense — no export estatico nao ha servidor para resolver os parametros, e
 * o conteudo so materializa no cliente.
 */
export default function BuscaPage() {
  return (
    <Suspense
      fallback={
        <div className="ds-container pb-16 pt-24 md:pt-28">
          <div className="h-9 w-2/3 max-w-md animate-pulse rounded bg-shark-50" />
          <div className="mt-6 h-12 w-48 animate-pulse rounded-full bg-shark-50" />
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="ds-card overflow-hidden">
                <div className="aspect-[4/3] animate-pulse bg-shark-50" />
                <div className="h-28" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <BuscaConteudo />
    </Suspense>
  );
}
