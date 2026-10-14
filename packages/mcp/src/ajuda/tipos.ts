/** Um tópico de ajuda: ficha, demonstrativo, menu ou regra do programa, das notas de mapeamento. */
export interface TopicoAjuda {
  /** Identificador estável das notas (ex.: F-IDENT, D-GCAP-IMOVEL). */
  readonly id: string;
  readonly nome: string;
  /** Arquivo das notas de onde o tópico veio. */
  readonly fonte: string;
  /** Itens do tópico (Onde, Campos, Validações conhecidas, Regras de cálculo...). */
  readonly itens: readonly { readonly campo: string; readonly texto: string }[];
}
