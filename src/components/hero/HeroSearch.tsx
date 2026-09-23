"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const tabs = [
  { id: "venda", label: "Comprar" },
  { id: "locacao", label: "Alugar" },
] as const;

type TabId = (typeof tabs)[number]["id"];

/**
 * Busca do hero, no padrao .header-search-overlay do Jardins & Co:
 * abas Comprar/Alugar + input de 500px + botao.
 *
 * A aba ativa usa o amarelo da marca — sobre o video escuro ele tem 14.8:1
 * de contraste com o texto shark, entao funciona como destaque de verdade.
 */
export default function HeroSearch() {
  const router = useRouter();
  const [operacao, setOperacao] = useState<TabId>("venda");
  const [termo, setTermo] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams({ operacao });
    if (termo.trim()) params.set("q", termo.trim());
    router.push(`/busca?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-[560px]">
      <div
        role="tablist"
        aria-label="Tipo de operação"
        className="mx-auto mb-3 flex w-fit gap-1 rounded-full bg-black/30 p-1 backdrop-blur-[8px]"
      >
        {tabs.map((tab) => {
          const active = operacao === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setOperacao(tab.id)}
              className={`h-9 rounded-full px-5 text-[13px] font-medium transition ${
                active ? "bg-brand text-shark" : "text-white/85 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="search"
          value={termo}
          onChange={(event) => setTermo(event.target.value)}
          placeholder="Digite o bairro ou código do imóvel"
          aria-label="Buscar por bairro ou código do imóvel"
          className="ds-input bg-white/95 sm:max-w-[500px]"
        />
        <button type="submit" className="ds-btn-primary shrink-0 px-8">
          Buscar
        </button>
      </form>
    </div>
  );
}
