import java.io.File;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import serpro.ppgd.irpf.negocio.DeclaracaoIRPF;
import serpro.ppgd.irpf.negocio.IRPFFacade;
import serpro.ppgd.irpf.negocio.IdentificadorDeclaracao;
import serpro.ppgd.irpf.negocio.resumo.ModeloSimplificada;
import serpro.ppgd.irpf.txt.gravacaorestauracao.GravadorTXT;
import serpro.ppgd.irpf.txt.gravacaorestauracao.ImportadorTxt;
import serpro.ppgd.negocio.Pendencia;
import serpro.ppgd.negocio.Valor;

/**
 * Harness de referência do AutoIR.
 *
 * Usa as classes do programa oficial IRPF 2026, baixado pelo desenvolvedor, como biblioteca:
 * monta declarações sintéticas a partir de casos JSON, executa o cálculo oficial, extrai o
 * resultado esperado (golden) e grava a cópia de segurança (.DBK) e o arquivo de entrega (.DEC)
 * pelo próprio mecanismo de persistência do programa. Também restaura um DBK de terceiros e
 * lista as pendências apontadas pelo programa.
 *
 * Roda apenas no ambiente de desenvolvimento (ver docs/adr/0002). Nenhuma classe do programa
 * oficial é copiada para o repositório; este código só chama a API pública do JAR.
 *
 * Uso (normalmente via gerar.sh):
 *   Referencia gerar <caso.json> <golden.json> <dirFixtures>
 *   Referencia verificar <arquivo.DBK|.DEC>
 *   Referencia cpf <semente> | cnpj <semente>
 */
public final class Referencia {
    static final String EXERCICIO = "2026";

    private Referencia() {
    }

    public static void main(String[] args) throws Exception {
        int status;
        try {
            status = executar(args);
        } catch (Throwable t) {
            System.err.println("ERRO: " + t);
            t.printStackTrace();
            status = 1;
        }
        System.out.flush();
        System.err.flush();
        // O programa oficial cria threads não daemon; encerra a JVM explicitamente.
        Runtime.getRuntime().halt(status);
    }

    private static int executar(String[] args) throws Exception {
        if (args.length == 0) {
            System.err.println("uso: gerar <caso.json> <golden.json> <dirFixtures> | verificar <arquivo> | cpf <n> | cnpj <n>");
            return 2;
        }
        switch (args[0]) {
            case "cpf":
                System.out.println(Documentos.cpf(Long.parseLong(args[1])));
                return 0;
            case "cnpj":
                System.out.println(Documentos.cnpj(Long.parseLong(args[1])));
                return 0;
            case "gerar":
                return gerar(new File(args[1]), new File(args[2]), new File(args[3]));
            case "verificar":
                return verificar(new File(args[1]));
            default:
                System.err.println("comando desconhecido: " + args[0]);
                return 2;
        }
    }

    // ------------------------------------------------------------------ gerar

    @SuppressWarnings("unchecked")
    private static int gerar(File arqCaso, File arqGolden, File dirFixtures) throws Exception {
        Map<String, Object> caso = (Map<String, Object>) Json.ler(
                new String(Files.readAllBytes(arqCaso.toPath()), StandardCharsets.UTF_8));
        String idCaso = (String) caso.get("id");
        Map<String, Object> entrada = (Map<String, Object>) caso.get("entrada");
        Map<String, Object> titular = mapa(entrada, "titular");
        String cpf = digitos(texto(titular, "cpf"));

        IdentificadorDeclaracao id = new IdentificadorDeclaracao(cpf, EXERCICIO);
        id.getNome().setConteudo(texto(titular, "nome"));
        IRPFFacade.setCacheIdDeclaracao(true);
        IRPFFacade.criarDeclaracao(id);
        IRPFFacade.abreDeclaracao(id);
        IRPFFacade facade = IRPFFacade.getInstancia();
        DeclaracaoIRPF d = facade.getDeclaracao();

        Preenchedor p = new Preenchedor(d, cpf);
        p.preencher(entrada);
        d.recalcularDeclaracao();

        Map<String, Object> esperado = Resultado.extrair(d);
        List<String> avisos = p.avisos();

        // Grava com o modelo mais vantajoso selecionado, como faria o contribuinte no PGD.
        boolean simplificado = "simplificado".equals(esperado.get("modeloMaisVantajoso"));
        id.getTipoDeclaracao().setConteudo(simplificado ? "1" : "0");
        if (simplificado) {
            d.setModeloSimplificada();
        } else {
            d.setModeloCompleta();
        }
        d.recalcularDeclaracao();
        // Operações que o programa desfaz quando o resultado muda (a conta de restituição é
        // limpa a cada recálculo que altera o imposto): aplicadas depois do cálculo final.
        p.finalizar(entrada);
        facade.salvarDeclaracao(d);

        File tmp = Files.createTempDirectory("autoir-ref-saida").toFile();
        GravadorTXT.copiarDeclaracao(id, tmp.getAbsolutePath());
        GravadorTXT.gravarDeclaracao(id, tmp.getAbsolutePath());
        dirFixtures.mkdirs();
        int copiados = 0;
        File[] gerados = tmp.listFiles();
        if (gerados != null) {
            for (File g : gerados) {
                String nome = g.getName().toUpperCase();
                String ext = nome.endsWith(".DBK") ? ".DBK" : nome.endsWith(".DEC") ? ".DEC" : null;
                if (ext != null) {
                    Files.copy(g.toPath(), new File(dirFixtures, idCaso + ext).toPath(),
                            StandardCopyOption.REPLACE_EXISTING);
                    copiados++;
                }
                g.delete();
            }
        }
        tmp.delete();

        Map<String, Object> golden = new LinkedHashMap<>();
        golden.put("id", idCaso);
        golden.put("descricao", caso.get("descricao"));
        golden.put("entrada", entrada);
        golden.put("esperado", esperado);
        arqGolden.getParentFile().mkdirs();
        Files.write(arqGolden.toPath(), Json.escrever(golden).getBytes(StandardCharsets.UTF_8));

        System.out.println(idCaso + ": " + esperado.get("modeloMaisVantajoso")
                + " completo(base=" + esperado.get("baseCalculoCompleto")
                + " imposto=" + esperado.get("impostoDevidoCompleto") + ")"
                + " simplificado(base=" + esperado.get("baseCalculoSimplificado")
                + " imposto=" + esperado.get("impostoDevidoSimplificado") + ")"
                + " arquivos=" + copiados);
        for (String a : avisos) {
            System.out.println("  aviso: " + a);
        }
        return copiados == 2 ? 0 : 3;
    }

    // -------------------------------------------------------------- verificar

    private static int verificar(File arquivo) throws Exception {
        if (!arquivo.isFile()) {
            System.err.println("arquivo não encontrado: " + arquivo);
            return 2;
        }
        IRPFFacade.setCacheIdDeclaracao(true);
        ImportadorTxt imp = new ImportadorTxt();
        DeclaracaoIRPF d;
        try {
            d = imp.restaurarDeclaracao(arquivo, false);
        } catch (Exception e) {
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("arquivo", arquivo.getName());
            r.put("restaurado", Boolean.FALSE);
            r.put("erro", String.valueOf(e.getMessage()));
            r.put("classeErro", e.getClass().getName());
            r.put("integridade", Integridade.verificar(arquivo));
            System.out.print(Json.escrever(r));
            return 1;
        }
        d.recalcularDeclaracao();
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("arquivo", arquivo.getName());
        r.put("restaurado", Boolean.TRUE);
        r.put("integridade", Integridade.verificar(arquivo));
        IdentificadorDeclaracao id = d.getIdentificadorDeclaracao();
        r.put("cpf", id.getCpf().naoFormatado());
        r.put("nome", id.getNome().naoFormatado());
        r.put("modeloGravado", d.getModelo() instanceof ModeloSimplificada ? "simplificado" : "completo");
        r.put("resultado", Resultado.extrair(d));
        List<Object> pend = new ArrayList<>();
        int erros = 0;
        for (Pendencia p : pendencias(d)) {
            Map<String, Object> m = new LinkedHashMap<>();
            boolean erro = p.isErro() || p.getSeveridade() >= 3;
            m.put("tipo", erro ? "erro" : p.getSeveridade() == 1 ? "atencao" : "aviso");
            m.put("severidade", String.valueOf(p.getSeveridade()));
            m.put("ficha", primeiro(p.getNomeAba(), p.getEntidade(), simples(p.getClassePainel())));
            m.put("campo", primeiro(p.getDescricaoCampo(), p.getCampo()));
            m.put("item", String.valueOf(p.getNumItem()));
            m.put("mensagem", limparHtml(nvl(p.getMsg())));
            pend.add(m);
            if (erro) {
                erros++;
            }
        }
        r.put("totalErros", String.valueOf(erros));
        r.put("totalPendencias", String.valueOf(pend.size()));
        r.put("pendencias", pend);
        System.out.print(Json.escrever(r));
        return 0;
    }

    /**
     * Lista as pendências da declaração. DeclaracaoIRPF.verificarPendencias não agrega as fichas
     * quando chamado fora da interface gráfica, então o harness percorre por reflexão todos os
     * getters públicos sem argumentos que devolvem fichas (ObjetoNegocio) e consulta cada uma,
     * como faz a ação "Verificar pendências" do programa. O argumento inteiro é 0, o mesmo para
     * todas as fichas. Duplicatas (mesma ficha, campo, item e mensagem) são removidas.
     */
    static List<Pendencia> pendencias(DeclaracaoIRPF d) {
        List<Pendencia> lista = new ArrayList<>();
        java.util.Set<String> vistos = new java.util.HashSet<>();
        List<Pendencia> brutas = new ArrayList<>();
        acumular(brutas, d);
        Method[] metodos = DeclaracaoIRPF.class.getMethods();
        java.util.Arrays.sort(metodos, java.util.Comparator.comparing(Method::getName));
        java.util.Set<Object> fichas = java.util.Collections.newSetFromMap(new java.util.IdentityHashMap<>());
        for (Method m : metodos) {
            if (!m.getName().startsWith("get") || m.getParameterCount() != 0
                    || !serpro.ppgd.negocio.ObjetoNegocio.class.isAssignableFrom(m.getReturnType())) {
                continue;
            }
            try {
                Object ficha = m.invoke(d);
                if (ficha != null && fichas.add(ficha)) {
                    acumular(brutas, (serpro.ppgd.negocio.ObjetoNegocio) ficha);
                }
            } catch (ReflectiveOperationException | RuntimeException e) {
                // Ficha que depende da interface gráfica; ignorada.
            }
        }
        for (Pendencia p : brutas) {
            String chave = p.getNomeAba() + "|" + p.getCampo() + "|" + p.getNumItem() + "|" + p.getMsg();
            if (vistos.add(chave)) {
                lista.add(p);
            }
        }
        return lista;
    }

    private static void acumular(List<Pendencia> destino, serpro.ppgd.negocio.ObjetoNegocio ficha) {
        try {
            List<Pendencia> l = ficha.verificarPendencias(0);
            if (l != null) {
                destino.addAll(l);
            }
        } catch (RuntimeException e) {
            // Algumas fichas consultam a janela principal ao verificar; ignoradas no modo headless.
        }
    }

    // ------------------------------------------------------------- utilidades

    @SuppressWarnings("unchecked")
    static Map<String, Object> mapa(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v instanceof Map ? (Map<String, Object>) v : new LinkedHashMap<>();
    }

    @SuppressWarnings("unchecked")
    static List<Object> lista(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v instanceof List ? (List<Object>) v : new ArrayList<>();
    }

    static String texto(Map<String, Object> m, String k) {
        Object v = m.get(k);
        return v == null ? "" : v.toString();
    }

    static String digitos(String s) {
        return s.replaceAll("\\D", "");
    }

    static String nvl(String s) {
        return s == null ? "" : s;
    }

    static String primeiro(String... opcoes) {
        for (String o : opcoes) {
            if (o != null && !o.trim().isEmpty()) {
                return o.trim();
            }
        }
        return "";
    }

    static String simples(String classe) {
        return classe == null ? "" : classe.substring(classe.lastIndexOf('.') + 1);
    }

    static String limparHtml(String s) {
        return s.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
    }

    /** Converte centavos inteiros ("123456") no texto do PGD ("1234,56"). */
    static String centavosParaPgd(String centavos) {
        String c = digitos(centavos == null ? "" : centavos);
        if (c.isEmpty()) {
            c = "0";
        }
        long v = Long.parseLong(c);
        return (v / 100) + "," + String.format("%02d", v % 100);
    }

    /** Converte um Valor do PGD em centavos inteiros como texto. */
    static String valorParaCentavos(Valor v) {
        String t = v.naoFormatado();
        boolean negativo = t.trim().startsWith("-");
        String d = digitos(t);
        if (d.isEmpty()) {
            return "0";
        }
        String n = String.valueOf(Long.parseLong(d));
        return negativo && !"0".equals(n) ? "-" + n : n;
    }

    static boolean temValor(String centavos) {
        String d = digitos(centavos == null ? "" : centavos);
        return !d.isEmpty() && Long.parseLong(d) != 0;
    }

    /** Chama um getter sem argumentos por reflexão (usado só para escolher quadros). */
    static Object chamar(Object alvo, String metodo) {
        try {
            Method m = alvo.getClass().getMethod(metodo);
            return m.invoke(alvo);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("método " + metodo + " indisponível em "
                    + alvo.getClass().getName(), e);
        }
    }
}
