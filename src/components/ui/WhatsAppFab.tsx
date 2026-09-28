import { contato, linkWhatsApp } from "@/data/contato";

/**
 * Botao flutuante de WhatsApp, padrao em site de imobiliaria.
 *
 * Fica acima da safe area do iPhone e usa o token --color-whatsapp, que ja
 * existia no globals.css sem uso.
 */
export default function WhatsAppFab() {
  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Falar com a Pimenta Imóveis no WhatsApp: ${contato.whatsappExibicao}`}
      className="group fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] transition hover:scale-105 md:right-6"
      style={{ bottom: "max(16px, env(safe-area-inset-bottom))" }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.15a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1 12.73-10.2 8.14 8.14 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.16 8.24z" />
      </svg>

      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-shark px-3 py-2 text-[13px] text-white opacity-0 transition group-hover:opacity-100 md:block">
        Fale com um corretor
      </span>
    </a>
  );
}
