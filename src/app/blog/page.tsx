import type { Metadata } from "next";
import EmBreve from "@/components/ui/EmBreve";

export const metadata: Metadata = {
  title: "Blog | Pimenta Imóveis",
  description: "Leitura de mercado imobiliário pela Pimenta Imóveis.",
};

export default function BlogPage() {
  return (
    <EmBreve
      titulo="Leitura de mercado, em breve"
      descricao="Estamos preparando o conteúdo sobre bairros, precificação e o que muda de fato no mercado imobiliário de São Paulo. Assine a newsletter na home para receber o primeiro."
    />
  );
}
