/**
 * Montagem do recibo de entrega (`HR`, `DR` e `R9`) a partir da declaração (header, fichas e
 * `T9`), para gerar o arquivo de entrega (DEC) a partir da cópia de segurança (DBK).
 *
 * Origem de cada campo do `DR`, inferida dos 37 pares DBK/DEC gravados pelo programa oficial
 * com dados sintéticos (`packages/core/test/fixtures/dbk/2026`) e conferida byte a byte:
 *
 * - `NR_CPF` e `IN_COMPLETA`: header `IR`;
 * - nome, endereço (`TIP_LOGRA` a `SG_UF`), telefone, `IN_RETIFICADORA`, `NR_QUOTAS`,
 *   banco, agência, conta, DV da conta e `IN_DEBITO_PRIMEIRA_QUOTA`: ficha 16, campo de mesmo nome;
 * - `VR_TOTTRIB`: `VR_TOTAL_RENDTRIB_PFPJ_TITDEP` do header;
 * - `VR_IMPDEV`: `VR_IMPDEVIDO` do header;
 * - `VR_IMPPAGAR`: `VR_SOMA_IMPOSTO_PAGAR` do header;
 * - `VR_IMPREST` e `VR_QUOTA`: Resumo do modelo gravado (`VR_IMPREST`/`VR_QUOTA` do registro 20
 *   na completa, `VR_IMPRESTIT`/`VR_QUOTA` do registro 18 na simplificada);
 * - `NM_EMAIL` fica em branco: o programa não copia o e-mail da ficha 16 para o recibo;
 * - `VR_GCIMPOSTOPAGO` e `VR_VCMOEDAEST`: imposto pago de ganhos de capital e de moeda
 *   estrangeira em espécie, que nenhum par dos fixtures preenche (ver docs/formato-dbk.md);
 * - `HR` e `R9`: CPF do header; os controles (`NR_CONTROLE`, `NR_HASH` do `R9`) saem de
 *   `recalcularControles`.
 */

import { criarRegistro, type Registro, type ValorCampo } from "./codec.js";
import { ArquivoDeclaracaoError } from "./erros.js";
import type { Leiaute } from "./leiaute.js";

/** Campos do `DR` copiados da ficha 16 com o mesmo nome. */
const CAMPOS_DA_FICHA_16 = [
  "NM_NOME",
  "TIP_LOGRA",
  "NM_LOGRA",
  "NR_NUMERO",
  "NM_COMPLEM",
  "NM_BAIRRO",
  "NR_CEP",
  "CD_MUNICIP",
  "NM_MUNICIP",
  "SG_UF",
  "NR_DDD_TELEFONE",
  "NR_TELEFONE",
  "IN_RETIFICADORA",
  "NR_QUOTAS",
  "NR_BANCO",
  "NR_AGENCIA",
  "NR_DV_CONTA",
  "NR_CONTA",
  "IN_DEBITO_PRIMEIRA_QUOTA",
] as const;

function valor(campos: Readonly<Record<string, ValorCampo>> | undefined, chave: string) {
  const v = campos?.[chave];
  return v === undefined ? null : v;
}

/** Copia só os campos presentes e não vazios; os demais ficam com o padrão do registro. */
function preenchidos(valores: Record<string, ValorCampo>): Record<string, ValorCampo> {
  return Object.fromEntries(Object.entries(valores).filter(([, v]) => v !== null && v !== ""));
}

/**
 * Monta os registros `HR`, `DR` e `R9` da declaração, com os controles zerados (o chamador
 * recalcula com `recalcularControles(..., { tipoArquivo: "DEC" })`). Exige o header `IR` e a
 * ficha 16, de onde vêm o CPF, o nome e o endereço do recibo.
 */
export function montarRecibo(registros: readonly Registro[], leiaute: Leiaute): Registro[] {
  const header = registros.find((r) => r.tipo === "IR");
  if (!header) {
    throw new ArquivoDeclaracaoError("conversão para DEC exige o header IR da declaração");
  }
  const ficha16 = registros.find((r) => r.tipo === "16");
  if (!ficha16) {
    throw new ArquivoDeclaracaoError(
      "conversão para DEC exige a ficha 16 (identificação do contribuinte), de onde vêm nome e endereço do recibo",
    );
  }
  const ir = header.campos;
  const completa = valor(ir, "IN_COMPLETA") === "S";
  const resumo = registros.find((r) => r.tipo === (completa ? "20" : "18"))?.campos;
  const cpf = valor(ir, "NR_CPF");

  const doRecibo: Record<string, ValorCampo> = {
    NR_CPF: cpf,
    IN_COMPLETA: valor(ir, "IN_COMPLETA"),
    VR_TOTTRIB: valor(ir, "VR_TOTAL_RENDTRIB_PFPJ_TITDEP"),
    VR_IMPDEV: valor(ir, "VR_IMPDEVIDO"),
    VR_IMPPAGAR: valor(ir, "VR_SOMA_IMPOSTO_PAGAR"),
    VR_IMPREST: valor(resumo, completa ? "VR_IMPREST" : "VR_IMPRESTIT"),
    VR_QUOTA: valor(resumo, "VR_QUOTA"),
  };
  for (const chave of CAMPOS_DA_FICHA_16) doRecibo[chave] = valor(ficha16.campos, chave);

  const comCpf = preenchidos({ NR_CPF: cpf });
  return [
    criarRegistro(leiaute, "HR", comCpf),
    criarRegistro(leiaute, "DR", preenchidos(doRecibo)),
    criarRegistro(leiaute, "R9", comCpf),
  ];
}

/** Campos da conta do Resumo que o programa descarta no arquivo de entrega sem débito automático. */
const CAMPOS_CONTA = ["NR_BANCO", "NR_AGENCIA", "NR_DV_CONTA", "NR_CONTA"] as const;

/**
 * Ajustes que o programa faz na declaração ao gravar o arquivo de entrega: com saldo a pagar e
 * sem débito automático, a conta informada no Resumo não vai para a DEC (header e ficha 16),
 * embora fique na cópia de segurança (caso `conta-sem-debito-pagar-01`). Devolve novos
 * registros; a entrada não muda.
 */
export function ajustarParaEntrega(registros: readonly Registro[]): Registro[] {
  const ir = registros.find((r) => r.tipo === "IR")?.campos;
  const r16 = registros.find((r) => r.tipo === "16")?.campos;
  const pagar = ir?.VR_SOMA_IMPOSTO_PAGAR;
  const descartar = typeof pagar === "bigint" && pagar > 0n && r16?.IN_DEBITO_AUTOM !== "S";
  if (!descartar) return [...registros];
  return registros.map((r) => {
    if (r.tipo !== "IR" && r.tipo !== "16") return r;
    const campos: Record<string, ValorCampo> = { ...r.campos };
    for (const c of CAMPOS_CONTA) {
      if (Object.hasOwn(campos, c)) campos[c] = typeof campos[c] === "bigint" ? 0n : "";
    }
    return { tipo: r.tipo, campos };
  });
}
