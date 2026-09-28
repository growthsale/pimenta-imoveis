export type Servico = {
  titulo: string;
  descricao: string;
  /** chave do icone desenhado em Differentials.tsx */
  icone: "avaliacao" | "curadoria" | "locacao" | "documentacao";
};

/** TODO: revisar os textos com a Pimenta antes de publicar */
export const servicos: Servico[] = [
  {
    icone: "avaliacao",
    titulo: "Avaliação de mercado",
    descricao:
      "Precificação a partir do que de fato foi negociado no bairro, não do que os anúncios pedem. Você entra na negociação sabendo o valor real.",
  },
  {
    icone: "curadoria",
    titulo: "Curadoria de compra",
    descricao:
      "Em vez de uma lista infinita, uma seleção curta e aderente ao seu perfil. Visitamos antes para não gastar o seu sábado à toa.",
  },
  {
    icone: "locacao",
    titulo: "Administração de locação",
    descricao:
      "Contrato, garantias, vistoria, repasse e reajuste. O proprietário acompanha; a Pimenta cuida da operação e do inquilino.",
  },
  {
    icone: "documentacao",
    titulo: "Assessoria documental",
    descricao:
      "Da proposta à escritura: certidões, financiamento e cartório acompanhados de perto, para o negócio não travar no fim.",
  },
];
