"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";
import { areaLinks, institutionalLinks, regionTabs } from "@/data/navigation";

type Props = { open: boolean; onClose: () => void };

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Mega-menu do Jardins & Co: painel branco que desce do topo.
 * .menu-nav { position:fixed; top:-100% -> 0; border-radius:0 0 20px 20px; transition:all .5s }
 *
 * No celular o conteudo e mais alto que a tela, entao o painel e limitado a
 * 100svh e rola por dentro (o body fica travado enquanto o menu esta aberto).
 */
export default function MegaMenu({ open, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    }, 120);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[55] bg-shark/40 transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        className={`fixed inset-x-0 z-[60] max-h-[100svh] w-full overflow-y-auto overscroll-contain rounded-b-[20px] bg-white transition-all duration-500 ease-in-out ${
          open ? "top-0" : "pointer-events-none -top-full"
        }`}
      >
        <div className="ds-container py-6 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" onClick={onClose} aria-label="Pimenta Imóveis — página inicial">
              <BrandLogo variant="on-light" size="sm" />
            </Link>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-shark transition hover:bg-shark-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M1 1L17 17M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <form action="/busca" className="mt-6 flex flex-col gap-3 sm:flex-row md:mt-8">
            <input
              name="q"
              type="search"
              placeholder="Digite o bairro ou código do imóvel"
              aria-label="Buscar imóvel"
              className="ds-input sm:max-w-[500px]"
            />
            <button type="submit" className="ds-btn-primary shrink-0 px-8">
              Buscar
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2 md:mt-8">
            {regionTabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/busca?operacao=${tab.id}`}
                onClick={onClose}
                className="ds-btn-secondary px-4 text-[14px] sm:px-5"
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 border-t border-shark-100 pt-8 md:mt-10 md:grid-cols-2 md:gap-10 md:pt-10">
            <div>
              <p className="ds-label">Tipos de imóvel</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
                {areaLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="inline-block py-1 font-serif text-[17px] text-shark transition hover:text-shark-500 md:text-[18px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="ds-label">Institucional</p>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
                {institutionalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="inline-block py-1 font-serif text-[17px] text-shark transition hover:text-shark-500 md:text-[18px]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
