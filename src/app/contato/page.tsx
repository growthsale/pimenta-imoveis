import type { Metadata } from "next";
import EmBreve from "@/components/ui/EmBreve";

export const metadata: Metadata = {
  title: "Contato | Pimenta Imóveis",
  description: "Fale com a Pimenta Imóveis sobre compra, venda ou locação.",
};

export default function ContatoPage() {
  return (
    <EmBreve
      titulo="Fale com a Pimenta"
      descricao="O formulário de contato entra na próxima etapa do projeto. Enquanto isso, o WhatsApp é o caminho mais rápido — um corretor responde direto, sem fila de atendimento."
    />
  );
}
