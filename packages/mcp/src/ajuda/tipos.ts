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

/** Atalho de teclado do programa oficial e o que o cobre no MCP Imposto de Renda. */
export interface AtalhoPrograma {
  /** Tecla ou combinação como a Ajuda escreve (Ctrl+P, F5, "Alt, T, R, L"). */
  readonly tecla: string;
  /** Item das notas de mapeamento onde o atalho aparece. */
  readonly id: string;
  /** Função do programa acionada pelo atalho. */
  readonly funcao: string;
  /** Status do item na matriz de cobertura (implementada, parcial, não se aplica). */
  readonly status: string;
  /** Ferramentas do servidor que cobrem o item. */
  readonly ferramentas: readonly string[];
}
