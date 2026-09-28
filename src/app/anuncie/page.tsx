import type { Metadata } from "next";
import EmBreve from "@/components/ui/EmBreve";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel | Pimenta Imóveis",
  description: "Coloque seu imóvel na carteira da Pimenta Imóveis.",
};

export default function AnunciePage() {
  return (
    <EmBreve
      titulo="Anuncie seu imóvel"
      descricao="O cadastro online entra na próxima etapa. Por enquanto, mande uma mensagem com o endereço e a metragem: a avaliação sai em até dois dias úteis, sem custo."
    />
  );
}
