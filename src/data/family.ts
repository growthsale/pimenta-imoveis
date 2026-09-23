export type FamilyMember = {
  nome: string;
  cargo: string;
  foto: string;
  /** ajuste fino do enquadramento no círculo — as fotos são 5:8 */
  objectPosition?: string;
};

/**
 * Os primeiros nomes vieram dos arquivos enviados pelo cliente.
 * TODO: confirmar sobrenomes e preencher os cargos reais.
 */
export const family: FamilyMember[] = [
  { nome: "Orlando",    cargo: "Cargo a definir", foto: "/images/family/orlando.jpg",    objectPosition: "center 22%" },
  { nome: "Warly",      cargo: "Cargo a definir", foto: "/images/family/warly.jpg",      objectPosition: "center 22%" },
  { nome: "Alessandra", cargo: "Cargo a definir", foto: "/images/family/alessandra.jpg", objectPosition: "center 22%" },
  { nome: "Paula",      cargo: "Cargo a definir", foto: "/images/family/paula.jpg",      objectPosition: "center 22%" },
];
