import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { asset } from "@/lib/asset";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  /* TODO: apontar NEXT_PUBLIC_SITE_URL para o dominio real no deploy —
     e a base que o Next usa para montar a URL absoluta da imagem de OG */
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Pimenta Imóveis | Imóveis de alto padrão",
  description:
    "Curadoria de imóveis de alto padrão. Encontre apartamentos, casas e condomínios com quem entende do mercado há mais de três décadas.",
  openGraph: {
    title: "Pimenta Imóveis | Imóveis de alto padrão",
    description:
      "Curadoria de imóveis de alto padrão. Encontre apartamentos, casas e condomínios com quem entende do mercado.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: asset("/images/brand/pimenta-logo.png"),
        width: 1080,
        height: 1080,
        alt: "Pimenta Imóveis",
      },
    ],
  },
};

/** themeColor pinta a barra do navegador no celular com o shark da marca */
export const viewport: Viewport = {
  themeColor: "#1d1d1f",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
