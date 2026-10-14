/** Tipos das entradas das tabelas de códigos (ver docs/mapeamento/tabelas/README.md). */

/** Entrada comum a todas as tabelas: código e descrição. */
export interface EntradaTabela {
  readonly codigo: string;
  readonly descricao: string;
  readonly descricaoResumida?: string;
  readonly descricaoCompleta?: string;
  readonly observacao?: string;
}

/** Código de bem ou direito; o código só é único dentro do grupo. */
export interface EntradaBemDireito extends EntradaTabela {
  readonly grupo: string;
  readonly grupoDescricao: string;
}

/** Banco da rede arrecadadora; `indicadores` guarda as colunas originais sem interpretação. */
export interface EntradaBanco extends EntradaTabela {
  readonly indicadores: Readonly<Record<string, string>>;
}

/**
 * Banco com parâmetros de dígito verificador. Interpretação adotada (inferida,
 * não confirmada na fonte): `COL3` é o tamanho da agência e `COL4` o tamanho
 * máximo da conta sem o DV.
 */
export interface EntradaBancoDv extends EntradaTabela {
  readonly parametrosDV: { readonly COL3: string; readonly COL4: string };
}

/** Fundo dos direitos da criança e do adolescente ou da pessoa idosa; `codigo` é o CNPJ. */
export interface EntradaFundo extends EntradaTabela {
  readonly uf?: string;
  readonly municipio?: string;
  readonly esfera: string;
}

/** Município da tabela do programa (código próprio de 4 dígitos, não IBGE). */
export interface EntradaMunicipio extends EntradaTabela {
  readonly uf: string;
}

/** País (código de 3 dígitos; 105 é o Brasil). */
export type EntradaPais = EntradaTabela;

/** País da tabela do demonstrativo de ganhos de capital. */
export interface EntradaPaisGcap extends EntradaTabela {
  readonly tributacaoFavorecida: boolean;
}

/** Representação diplomática brasileira usada no endereço no exterior (Cód. EXT). */
export interface EntradaRepresentacao extends EntradaTabela {
  readonly pais: string;
  readonly tipoRepresentacao: string;
}

/** Parâmetro de cálculo do ano-calendário (tabela progressiva, limites, deduções). */
export interface EntradaParametro extends EntradaTabela {
  readonly valorBruto: string;
  readonly valor: number;
  readonly tipo: string;
  readonly grupo: string;
  readonly mes?: number;
}
