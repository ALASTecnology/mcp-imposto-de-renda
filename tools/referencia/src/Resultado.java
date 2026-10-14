import java.util.LinkedHashMap;
import java.util.Map;

import serpro.ppgd.irpf.negocio.DeclaracaoIRPF;
import serpro.ppgd.irpf.negocio.resumo.ModeloCompleta;
import serpro.ppgd.irpf.negocio.resumo.ModeloSimplificada;

/**
 * Extrai do cálculo oficial os valores do bloco "esperado" dos casos de referência.
 * Todos os valores saem em centavos inteiros como texto; a alíquota efetiva sai em centésimos
 * de ponto percentual ("682" = 6,82%).
 */
final class Resultado {
    private Resultado() {
    }

    static Map<String, Object> extrair(DeclaracaoIRPF d) {
        ModeloCompleta c = d.getModeloCompleta();
        ModeloSimplificada s = d.getModeloSimplificada();
        boolean simplificado = d.simplesEhMelhor();

        Map<String, Object> e = new LinkedHashMap<>();
        e.put("rendimentosTributaveis", Referencia.valorParaCentavos(c.getTotalRendimentos()));
        e.put("deducoesCompleto", Referencia.valorParaCentavos(c.getTotalDeducoes()));
        e.put("baseCalculoCompleto", Referencia.valorParaCentavos(c.getBaseCalculo()));
        e.put("impostoDevidoCompleto", Referencia.valorParaCentavos(c.getImpostoDevido()));
        e.put("descontoSimplificado", Referencia.valorParaCentavos(s.getDescontoSimplificado()));
        e.put("baseCalculoSimplificado", Referencia.valorParaCentavos(s.getBaseCalculo()));
        e.put("impostoDevidoSimplificado", Referencia.valorParaCentavos(s.getImpostoDevido()));
        e.put("impostoRetidoTotal", Referencia.valorParaCentavos(c.getTotalImpostoPago()));
        e.put("saldoPagarCompleto", Referencia.valorParaCentavos(c.getSaldoImpostoPagar()));
        e.put("restituirCompleto", Referencia.valorParaCentavos(c.getImpostoRestituir()));
        e.put("saldoPagarSimplificado", Referencia.valorParaCentavos(s.getSaldoImpostoPagar()));
        e.put("restituirSimplificado", Referencia.valorParaCentavos(s.getImpostoRestituir()));
        e.put("modeloMaisVantajoso", simplificado ? "simplificado" : "completo");
        e.put("aliquotaEfetiva", Referencia.valorParaCentavos(
                simplificado ? s.getAliquotaEfetiva() : c.getAliquotaEfetiva()));
        return e;
    }
}
