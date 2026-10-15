import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import serpro.atividaderural.AtividadeRuralFacade;
import serpro.atividaderural.entidades.DeclaracaoAtividadeRural;
import serpro.atividaderural.entidades.IdDeclaracaoAtividadeRural;
import serpro.atividaderural.entidades.livrocaixa.consolidacao.MesConsolidacao;
import serpro.atividaderural.entidades.livrocaixa.escrituracao.Conta;
import serpro.atividaderural.entidades.livrocaixa.escrituracao.MesEscrituracao;
import serpro.atividaderural.gui.JanelaPrincipalAtividadeRural;
import serpro.atividaderural.txt.ExportarIRPF;
import serpro.ppgd.infraestrutura.PlataformaPPGD;
import serpro.ppgd.negocio.Informacao;

/**
 * Harness de referência do Livro Caixa da Atividade Rural (programa AR 2025 avulso, cujo
 * "Exportar para o IRPF" grava o arquivo `<CPF>-ARURAL-2025-2025-EXPORTA-IRPF2026.DEC` que o
 * IRPF 2026 importa; o AR 2026 exporta para o IRPF 2027 e o IRPF 2026 o recusa).
 *
 * Usa as classes do programa, baixado pelo desenvolvedor, como biblioteca: cria a declaração do
 * livro caixa do titular, escritura os lançamentos do bloco "livroCaixaRural" do caso (o
 * programa soma cada lançamento no mês e no demonstrativo pelos observadores das entidades) e
 * grava o arquivo de exportação com `ExportarIRPF.gravaDeclaracao`, o método da ação de
 * exportação. Também grava em JSON o demonstrativo mensal calculado pelo programa.
 *
 * Fora da interface gráfica, a soma dos lançamentos consulta a janela principal para habilitar
 * menus; o harness registra uma janela que nunca é construída (alocada sem construtor) e cujo
 * único método chamado não faz nada. A API foi descoberta com javap -p (assinaturas) e
 * reflexão; nenhum bytecode foi descompilado e nenhuma classe do programa entra no repositório.
 *
 * Uso (normalmente via gerar.sh): Ar gerar <caso.json> <pastaSaida> <resultado.json>
 */
public final class Ar {
    private Ar() {
    }

    private static final String[] MESES = {"getJaneiro", "getFevereiro", "getMarco", "getAbril", "getMaio",
        "getJunho", "getJulho", "getAgosto", "getSetembro", "getOutubro", "getNovembro", "getDezembro"};

    /** Janela principal sem interface: alocada sem construtor, nunca exibida. */
    static final class JanelaSemInterface extends JanelaPrincipalAtividadeRural {
        private static final long serialVersionUID = 1L;

        @Override
        public void existeRegistroDeEscrituracao(boolean existe) {
            // Só habilita menus na interface gráfica.
        }
    }

    public static void main(String[] args) {
        int status;
        try {
            if (args.length != 4 || !"gerar".equals(args[0])) {
                System.err.println("uso: Ar gerar <caso.json> <pastaSaida> <resultado.json>");
                status = 2;
            } else {
                status = gerar(new File(args[1]), new File(args[2]), new File(args[3]));
            }
        } catch (Throwable t) {
            System.err.println("ERRO: " + t);
            t.printStackTrace();
            status = 1;
        }
        System.out.flush();
        System.err.flush();
        // O programa cria threads não daemon; encerra a JVM explicitamente.
        Runtime.getRuntime().halt(status);
    }

    @SuppressWarnings("unchecked")
    private static int gerar(File arqCaso, File pastaSaida, File arqResultado) throws Exception {
        Map<String, Object> caso = (Map<String, Object>) Json.ler(
                new String(Files.readAllBytes(arqCaso.toPath()), StandardCharsets.UTF_8));
        Map<String, Object> entrada = mapa(caso, "entrada");
        Map<String, Object> titular = mapa(entrada, "titular");
        Map<String, Object> livro = mapa(entrada, "livroCaixaRural");
        List<Object> lancamentos = lista(livro, "lancamentos");
        if (lancamentos.isEmpty()) {
            throw new IllegalArgumentException("caso sem livroCaixaRural.lancamentos");
        }
        semInterface();

        IdDeclaracaoAtividadeRural id = new IdDeclaracaoAtividadeRural();
        def(id, "getCpf", digitos(texto(titular, "cpf")));
        def(id, "getNome", texto(titular, "nome"));
        def(id, "getPais", padrao(texto(livro, "pais"), "105"));
        AtividadeRuralFacade.setCacheIdDeclaracao(true);
        AtividadeRuralFacade.criarDeclaracao(id);
        AtividadeRuralFacade.abreDeclaracao(id);
        DeclaracaoAtividadeRural d = AtividadeRuralFacade.getInstancia().getDeclaracao();

        int n = 0;
        for (Object o : lancamentos) {
            Map<String, Object> l = (Map<String, Object>) o;
            String data = texto(l, "data");
            int mes = Integer.parseInt(data.substring(2, 4));
            MesEscrituracao m = (MesEscrituracao) obter(d.getEscrituracao(), MESES[mes - 1]);
            Conta c = m.itens().get(m.novoObjeto());
            def(c, "getData", data);
            def(c, "getHistorico", padrao(texto(l, "historico"), "LANCAMENTO FICTICIO " + (++n)));
            def(c, "getCodTipoContaSelecao", texto(l, "conta"));
            def(c, "getClassificacaoConta", texto(l, "conta"));
            def(c, "getValor", pgd(texto(l, "valor")));
        }
        AtividadeRuralFacade.getInstancia().salvarDeclaracao(d);

        File tmp = Files.createTempDirectory("mcp-imposto-de-renda-ar").toFile();
        if (!new ExportarIRPF().gravaDeclaracao(tmp, id)) {
            throw new IllegalStateException("o programa não gravou o arquivo de exportação");
        }
        File[] gerados = tmp.listFiles((dir, nome) -> nome.toUpperCase().endsWith(".DEC"));
        if (gerados == null || gerados.length != 1) {
            throw new IllegalStateException("esperado um arquivo de exportação em " + tmp);
        }
        pastaSaida.mkdirs();
        Files.copy(gerados[0].toPath(), new File(pastaSaida, gerados[0].getName()).toPath(),
                StandardCopyOption.REPLACE_EXISTING);

        Map<String, Object> r = new LinkedHashMap<>();
        r.put("programa", "Atividade Rural 2025 (exportação para o IRPF 2026)");
        r.put("arquivo", gerados[0].getName());
        List<Object> meses = new ArrayList<>();
        int i = 0;
        for (MesConsolidacao mc : d.getConsolidacao().getMeses()) {
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("mes", ++i);
            x.put("receitas", centavos(mc, "getReceitas"));
            x.put("despesas", centavos(mc, "getDespesas"));
            x.put("despesasNaoDedutiveis", centavos(mc, "getDespesasNaoDedutiveis"));
            x.put("produtoEntregueAdiantamento", centavos(mc, "getProdEntregueAdiantamento"));
            x.put("adiantamentoRecebido", centavos(mc, "getAdiantamentoRecebidoEntregaFutura"));
            meses.add(x);
        }
        r.put("meses", meses);
        Files.write(arqResultado.toPath(), Json.escrever(r).getBytes(StandardCharsets.UTF_8));
        System.out.println("ar: " + lancamentos.size() + " lançamento(s), " + gerados[0].getName());
        return 0;
    }

    /** Registra a plataforma com a janela que nunca é construída (ver comentário da classe). */
    private static void semInterface() throws Exception {
        Field f = Class.forName("sun.misc.Unsafe").getDeclaredField("theUnsafe");
        f.setAccessible(true);
        Object unsafe = f.get(null);
        Method alocar = unsafe.getClass().getMethod("allocateInstance", Class.class);
        final JanelaSemInterface janela = (JanelaSemInterface) alocar.invoke(unsafe, JanelaSemInterface.class);
        PlataformaPPGD.setPlataforma(new PlataformaPPGD() {
            @Override
            public javax.swing.JFrame getJanelaPrincipal() {
                return janela;
            }
        });
    }

    // ------------------------------------------------------------ utilidades

    static Object obter(Object raiz, String caminho) throws Exception {
        Object o = raiz;
        for (String p : caminho.split("\\.")) {
            o = o.getClass().getMethod(p).invoke(o);
        }
        return o;
    }

    /** Define um campo e confere que o programa aceitou o valor. */
    static void def(Object raiz, String caminho, String valor) throws Exception {
        Informacao<?> i = (Informacao<?>) obter(raiz, caminho);
        i.setConteudo(valor);
        String lido = digitos(i.naoFormatado());
        if (!valor.isEmpty() && lido.isEmpty() && !digitos(valor).isEmpty()) {
            throw new IllegalStateException("o programa não aceitou " + caminho + "=" + valor);
        }
    }

    private static String centavos(Object raiz, String caminho) {
        try {
            String d = digitos(((Informacao<?>) obter(raiz, caminho)).naoFormatado());
            return d.isEmpty() ? "0" : String.valueOf(Long.parseLong(d));
        } catch (Exception e) {
            return "0";
        }
    }

    /** Centavos inteiros ("123456") no texto do programa ("1234,56"). */
    private static String pgd(String centavos) {
        long v = Long.parseLong(padrao(digitos(centavos), "0"));
        return (v / 100) + "," + String.format("%02d", v % 100);
    }

    private static String padrao(String v, String p) {
        return v == null || v.isEmpty() ? p : v;
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> mapa(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v instanceof Map ? (Map<String, Object>) v : new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    private static List<Object> lista(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v instanceof List ? (List<Object>) v : new ArrayList<>();
    }

    private static String texto(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v == null ? "" : v.toString();
    }

    private static String digitos(String s) {
        return s == null ? "" : s.replaceAll("\\D", "");
    }
}
