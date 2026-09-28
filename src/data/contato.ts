/**
 * Dados de contato da Pimenta.
 *
 * TODO: substituir pelos dados reais — telefone, WhatsApp, e-mail, endereco e
 * CRECI. Ate la o rodape e o botao flutuante leem daqui, para a troca
 * acontecer em um lugar so.
 */
export const contato = {
  /** somente digitos, no formato do link do WhatsApp: 55 + DDD + numero */
  whatsapp: "5511900000000",
  whatsappExibicao: "(11) 90000-0000",
  telefone: "(11) 0000-0000",
  email: "contato@pimentaimoveis.com.br",
  endereco: "Endereço a definir",
  creci: "CRECI a definir",
} as const;

export const mensagemWhatsApp =
  "Olá! Vim pelo site da Pimenta Imóveis e gostaria de falar com um corretor.";

export function linkWhatsApp(mensagem: string = mensagemWhatsApp): string {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}
