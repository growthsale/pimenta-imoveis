"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MegaMenu from "./MegaMenu";
import BrandLogo from "@/components/brand/BrandLogo";
import { institutionalLinks } from "@/data/navigation";

/**
 * Rotas que abrem com hero escuro de tela cheia — so nelas o header comeca
 * transparente. Nas demais ele nasce solido, senao a marca branca some sobre
 * o fundo branco da pagina.
 */
const ROTAS_COM_HERO = ["/", "/business"];

/**
 * Barra fixa sobre o hero (layout do Jardins & Co) que ganha fundo solido apos o scroll,
 * usando o tratamento do .ds-header do Coelho: bg 90% + backdrop-blur(12px) + border-b.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // "solido" cobre tanto a pagina interna quanto a home depois do scroll
  const solido = scrolled || !ROTAS_COM_HERO.includes(pathname);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ease-in-out md:h-20 ${
          solido
            ? "border-b border-shark-100 bg-surface/90 backdrop-blur-[12px]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="ds-container flex h-full items-center justify-between gap-4">
          <Link href="/" aria-label="Pimenta Imóveis — página inicial" className="shrink-0">
            <BrandLogo variant={solido ? "on-light" : "on-dark"} size="sm" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {institutionalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[14px] font-medium transition-colors ${
                  solido ? "text-shark hover:text-shark-500" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            className={`flex h-11 shrink-0 items-center gap-3 rounded-[8px] px-3 text-[14px] font-medium transition sm:px-4 ${
              solido ? "text-shark hover:bg-shark-50" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="hidden sm:inline">Menu</span>
            <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden="true">
              <path
                d="M0 1h20M0 6h20M0 11h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
