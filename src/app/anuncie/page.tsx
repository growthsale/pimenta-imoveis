import type { Metadata } from "next";
import FormCaptacao from "@/components/captacao/FormCaptacao";

export const metadata: Metadata = {
  title: "Anuncie seu imóvel | Pimenta Imóveis",
  description:
    "Cadastre seu imóvel em quatro passos. O anúncio sai pronto no formato do catálogo e segue direto para um corretor da Pimenta.",
};

export default function AnunciePage() {
  return <FormCaptacao />;
}
