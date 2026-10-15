import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import br.gov.serpro.gcap.acoes.VerificarPendenciasAction;
import br.gov.serpro.gcap.entidades.DemonstrativoGCAP;
import br.gov.serpro.gcap.entidades.IdDemonstrativoGCAP;
import br.gov.serpro.gcap.entidades.especie.ColecaoOperacaoEspecie;
import br.gov.serpro.gcap.entidades.especie.MoedaAlienada;
import br.gov.serpro.gcap.gui.ControladorGui;
import br.gov.serpro.gcap.negocio.GCAPFacade;
import br.gov.serpro.gcap.txt.gravacaorestauracao.GravadorCopiaSeguranca;
import serpro.ppgd.negocio.Colecao;
import serpro.ppgd.negocio.Informacao;
import serpro.ppgd.negocio.Pendencia;

/**
 * Harness de referência do Demonstrativo de Ganhos de Capital (programa GCAP 2025 avulso, cujo
 * "Exportar para o IRPF2026" alimenta a declaração do exercício 2026).
 *
 * Usa as classes do programa, baixado pelo desenvolvedor, como biblioteca: cria o demonstrativo
 * do titular, inclui as alienações do bloco "ganhosCapital" do caso, deixa o próprio programa
 * calcular (os cálculos ficam nos observadores das entidades de negócio e disparam a cada campo
 * preenchido, na ordem em que a interface pede os campos), confere que não há pendências e grava
 * o arquivo de exportação para o IRPF pelo mesmo método que a ação "Exportar para o IRPF2026"
 * usa. Também grava em JSON os valores apurados pelo programa.
 *
 * A API foi descoberta com javap -p (assinaturas), reflexão e JDI (observação de chamadas e
 * argumentos em tempo de execução); nenhum bytecode foi descompilado e nenhuma classe do
 * programa entra no repositório.
 *
 * Uso (normalmente via gerar.sh): Gcap gerar <caso.json> <arquivoExportado.DEC> <resultado.json>
 */
public final class Gcap {
    private Gcap() {
    }

    public static void main(String[] args) {
        int status;
        try {
            if (args.length != 4 || !"gerar".equals(args[0])) {
                System.err.println("uso: Gcap gerar <caso.json> <saida.DEC> <resultado.json>");
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
    private static int gerar(File arqCaso, File arqSaida, File arqResultado) throws Exception {
        Map<String, Object> caso = (Map<String, Object>) Json.ler(
                new String(Files.readAllBytes(arqCaso.toPath()), StandardCharsets.UTF_8));
        Map<String, Object> entrada = mapa(caso, "entrada");
        Map<String, Object> titular = mapa(entrada, "titular");
        String cpf = digitos(texto(titular, "cpf"));
        List<Object> alienacoes = lista(entrada, "ganhosCapital");
        if (alienacoes.isEmpty()) {
            throw new IllegalArgumentException("caso sem ganhosCapital");
        }

        DemonstrativoGCAP d = abrir(cpf, texto(titular, "nome"));
        List<Object> resultados = new ArrayList<>();
        for (Object o : alienacoes) {
            Map<String, Object> a = (Map<String, Object>) o;
            String tipo = texto(a, "tipo");
            Object alienacao;
            switch (tipo) {
                case "imovel":
                    alienacao = novo(d.getBensImoveis());
                    imovel(alienacao, a);
                    break;
                case "movel":
                    alienacao = novo(d.getBensMoveis());
                    movel(alienacao, a);
                    break;
                case "participacao":
                    alienacao = novo(d.getParticipacoesSocietarias());
                    participacao(alienacao, a);
                    break;
                case "moeda":
                    alienacao = novo(d.getMoedasAlienadas());
                    moeda((MoedaAlienada) alienacao, a);
                    break;
                default:
                    throw new IllegalArgumentException("tipo de alienação não suportado: " + tipo);
            }
            for (Object op : lista(a, "campos")) {
                List<Object> par = (List<Object>) op;
                def(alienacao, par.get(0).toString(), par.get(1).toString());
            }
            resultados.add("moeda".equals(tipo) ? resultadoMoeda((MoedaAlienada) alienacao)
                    : resultado(tipo, alienacao, Boolean.TRUE.equals(a.get("exterior"))));
        }

        VerificarPendenciasAction.PendenciasDemonstrativo pd = new VerificarPendenciasAction().obterPendencias(d);
        List<Object> pendencias = new ArrayList<>();
        for (Pendencia p : pd.getPendencias()) {
            pendencias.add(p.getSeveridade() + " " + p.getMsg());
        }
        if (pd.getTotalErros() > 0) {
            throw new IllegalStateException("o demonstrativo tem pendências de erro: " + pendencias);
        }

        GCAPFacade.getInstancia().salvarDeclaracao(d);
        arqSaida.getParentFile().mkdirs();
        new GravadorCopiaSeguranca().exportarParaIRPF(arqSaida, d.getIdDemonstrativo());

        Map<String, Object> r = new LinkedHashMap<>();
        r.put("programa", "GCAP 2025 (exportação para o IRPF 2026)");
        r.put("alienacoes", resultados);
        Map<String, Object> cons = new LinkedHashMap<>();
        cons.put("rendimentosIsentos", centavos(d.getConsolidacaoBrasil(), "getTotalRendIsentosNaoTributaveis"));
        cons.put("rendimentosTributaveis", centavos(d.getConsolidacaoBrasil(), "getTotalRendSujeitosTributacao"));
        cons.put("impostoDevido", centavos(d.getConsolidacaoBrasil(), "getImpostoDevidoAnoAtual"));
        cons.put("impostoPago", centavos(d.getConsolidacaoBrasil(), "getTotalImpostoPago"));
        r.put("consolidacao", cons);
        Map<String, Object> ext = new LinkedHashMap<>();
        ext.put("rendimentosIsentos", centavos(d.getConsolidacaoExterior(), "getTotalRendIsentosNaoTributaveis"));
        ext.put("rendimentosTributaveis", centavos(d.getConsolidacaoExterior(), "getTotalRendSujeitosTributacao"));
        ext.put("impostoDevido", centavos(d.getConsolidacaoExterior(), "getImpostoDevidoAnoAtual"));
        ext.put("impostoPago", centavos(d.getConsolidacaoExterior(), "getTotalImpostoPago"));
        r.put("consolidacaoExterior", ext);
        if (!d.getMoedasAlienadas().itens().isEmpty()) {
            Map<String, Object> esp = new LinkedHashMap<>();
            Object t = d.getTotalizacaoMoedasAlienadas();
            esp.put("totalAlienacoesDolar", centavos(t, "getTotalAlienacoesDolarConsolidado"));
            esp.put("ganhoCapital", centavos(t, "getTotalGanhosCapital"));
            esp.put("ganhoTributavel", centavos(t, "getTotalGanhosCapitalTributavel"));
            esp.put("impostoDevido", centavos(t, "getTotalImpostoDevido"));
            esp.put("impostoPago", centavos(t, "getTotalImpostoPago"));
            r.put("moedaEspecie", esp);
        }
        r.put("pendencias", pendencias);
        Files.write(arqResultado.toPath(), Json.escrever(r).getBytes(StandardCharsets.UTF_8));
        System.out.println("gcap: " + resultados.size() + " alienação(ões), imposto devido " + cons.get("impostoDevido"));
        return 0;
    }

    // ------------------------------------------------------------ alienações

    /** Campos que abrem toda alienação: residência no Brasil, natureza e data. */
    private static void inicio(Object al, Map<String, Object> a) throws Exception {
        def(al, "getPaisResidencia", "105");
        def(al, "getNatureza", padrao(texto(a, "natureza"), "1"));
        def(al, "getDataAlienacao", texto(a, "dataAlienacao"));
        def(al, "getAlienacaoParcial", "0");
    }

    /** Campos que fecham toda alienação: à vista, valor, corretagem e imposto pago. */
    private static void operacao(Object al, Map<String, Object> a) throws Exception {
        def(al, "getAlienacaoAPrazo", "0");
        def(al, "getValorAlienacao", pgd(texto(a, "valorAlienacao")));
        def(al, "getCustoCorretagem", pgd(texto(a, "custoCorretagem")));
        // Até R$ 35.000,00 o programa pergunta se o conjunto de bens da mesma natureza alienados
        // no mês passa do limite; o caso responde com conjuntoMesAcimaLimite (padrão: não).
        if (Long.parseLong(padrao(digitos(texto(a, "valorAlienacao")), "0")) <= 3500000L) {
            def(al, "getBemGrandeValor", Boolean.TRUE.equals(a.get("conjuntoMesAcimaLimite")) ? "1" : "0");
        }
        if (temValor(texto(a, "impostoPago"))) {
            def(al, "getCalculoImposto.getImpostoPago", pgd(texto(a, "impostoPago")));
        }
    }

    private static void adquirente(Object bem, Map<String, Object> a) throws Exception {
        Map<String, Object> adq = mapa(a, "adquirente");
        Object item = novo((Colecao<?>) obter(bem, "getAdquirentes"));
        def(item, "getCpfCnpj", padrao(digitos(texto(adq, "cpf")), Documentos.cpf(9101)));
        def(item, "getNome", padrao(texto(adq, "nome"), "ADQUIRENTE FICTICIO"));
    }

    private static void imovel(Object al, Map<String, Object> a) throws Exception {
        inicio(al, a);
        def(al, "getBemImovel.getEspecificacao", padrao(texto(a, "descricao"), "IMOVEL FICTICIO"));
        def(al, "getBemImovel.getEndereco.getTipoLogradouro", "RUA");
        def(al, "getBemImovel.getEndereco.getLogradouro", "RUA FICTICIA");
        def(al, "getBemImovel.getEndereco.getNumero", "10");
        def(al, "getBemImovel.getEndereco.getUf", "DF");
        def(al, "getBemImovel.getEndereco.getMunicipio", "9701");
        def(al, "getBemImovel.getEndereco.getCep", "70000000");
        def(al, "getAquisicao.getDataAquisicao", texto(a, "dataAquisicao"));
        def(al, "getAquisicao.getOrigemRendimentos", "1");
        def(al, "getAquisicao.getBemAtualizado", "0");
        // A ordem importa: "houve reforma" antes do custo, senão o custo não chega à apuração.
        def(al, "getAquisicao.getHouveReforma", "0");
        def(al, "getAquisicao.getCustoAquisicao", pgd(texto(a, "custoAquisicao")));
        operacao(al, a);
        // Perguntas da isenção do único imóvel: "possui outro imóvel" antes de "outra alienação
        // em 5 anos" (na ordem inversa o programa limpa a segunda resposta).
        boolean unico = Boolean.TRUE.equals(a.get("unicoImovel"));
        def(al, "getPerguntas.getPropriedadeOutroImovel", unico ? "0" : "1");
        if (unico) {
            def(al, "getPerguntas.getOutraAlienacao", "0");
        } else {
            // Imóvel residencial abre a pergunta da reaplicação em 180 dias (art. 39 da Lei
            // 11.196/2005); o harness responde "não adquiri outro imóvel" (opção 2).
            boolean residencial = Boolean.TRUE.equals(a.get("residencial"));
            def(al, "getPerguntas.getImovelResidencial", residencial ? "1" : "0");
            if (residencial) {
                def(al, "getPerguntas.getMP252", "2");
            }
        }
        adquirente(obter(al, "getBemImovel"), a);
    }

    private static void movel(Object al, Map<String, Object> a) throws Exception {
        inicio(al, a);
        def(al, "getBemMovel.getEspecificacao", padrao(texto(a, "descricao"), "BEM MOVEL FICTICIO"));
        def(al, "getBemMovel.getSujeitoRegistroPublico", "0");
        if (Boolean.TRUE.equals(a.get("exterior"))) {
            def(al, "getBemMovel.getBemAdquiridoNoBrasil", "0");
            exterior(al, a);
        } else {
            def(al, "getAquisicao.getDataAquisicao", texto(a, "dataAquisicao"));
            def(al, "getAquisicao.getOrigemRendimentos", "1");
            def(al, "getAquisicao.getCustoAquisicao", pgd(texto(a, "custoAquisicao")));
            operacao(al, a);
        }
        adquirente(obter(al, "getBemMovel"), a);
    }

    /**
     * Bem adquirido no exterior: valores em dólar e cotações informadas, na ordem da interface.
     * `origem` diz com que rendimentos o bem foi comprado (nacional, estrangeira ou ambas, códigos
     * 1, 2 e 3 do programa); a parte de origem nacional é informada em dólar e convertida pela
     * cotação da data de aquisição, a de origem estrangeira fica em dólar.
     */
    private static void exterior(Object al, Map<String, Object> a) throws Exception {
        String origem = padrao(texto(a, "origem"), "estrangeira");
        String codigo;
        switch (origem) {
            case "nacional": codigo = "1"; break;
            case "estrangeira": codigo = "2"; break;
            case "ambas": codigo = "3"; break;
            default: throw new IllegalArgumentException("origem desconhecida: " + origem);
        }
        def(al, "getAquisicao.getDataAquisicao", texto(a, "dataAquisicao"));
        def(al, "getAquisicao.getOrigemRendimentos", codigo);
        def(al, "getAquisicao.getMoedaEstrangeira", padrao(texto(a, "moeda"), "USA"));
        if (!"2".equals(codigo)) {
            def(al, "getAquisicao.getCotacaoDolarDataAquisicao", texto(a, "cotacaoAquisicao"));
            def(al, "getAquisicao.getCustoAquisicaoOrigemNacionalDolar", pgd(texto(a, "custoAquisicaoNacionalDolar")));
        }
        if (!"1".equals(codigo)) {
            def(al, "getAquisicao.getCustoAquisicaoOrigemMEDolar", pgd(texto(a, "custoAquisicaoDolar")));
        }
        def(al, "getAlienacaoAPrazo", "0");
        def(al, "getValorAlienacaoDolar", pgd(texto(a, "valorAlienacaoDolar")));
        def(al, "getValorCorretagemDolar", pgd(texto(a, "custoCorretagemDolar")));
        def(al, "getCotacaoDolarDataAlienacao", texto(a, "cotacaoAlienacao"));
        // Valor em reais até R$ 35.000,00: a mesma pergunta do conjunto alienado no mês.
        long cotacao = Long.parseLong(padrao(digitos(texto(a, "cotacaoAlienacao")), "0"));
        long reais = Long.parseLong(padrao(digitos(texto(a, "valorAlienacaoDolar")), "0")) * cotacao / 10000L;
        if (reais <= 3500000L) {
            def(al, "getBemGrandeValor", Boolean.TRUE.equals(a.get("conjuntoMesAcimaLimite")) ? "1" : "0");
        }
        if (temValor(texto(a, "impostoPago"))) {
            def(al, "getCalculoImposto.getImpostoPago", pgd(texto(a, "impostoPago")));
        }
    }

    /**
     * Moeda estrangeira em espécie: estoque e saldo em reais de 1º de janeiro e as operações do
     * ano em ordem (compras e vendas; a venda traz a cotação do dólar e o adquirente). O custo
     * médio, o estoque e o ganho de cada venda são calculados pelo programa.
     */
    @SuppressWarnings("unchecked")
    private static void moeda(MoedaAlienada m, Map<String, Object> a) throws Exception {
        def(m, "getMoeda", padrao(texto(a, "moeda"), "USA"));
        def(m, "getEstoqueInicial", pgd(texto(a, "estoqueInicial")));
        def(m, "getSaldoInicial", pgd(texto(a, "saldoInicial")));
        ColecaoOperacaoEspecie ops = m.getOperacoesEspecie();
        for (Object o : lista(a, "operacoes")) {
            Map<String, Object> op = (Map<String, Object>) o;
            boolean venda = "venda".equals(texto(op, "tipo"));
            int i = venda ? ops.inserirNovaOperacaoVenda() : ops.inserirNovaOperacaoCompra();
            Object item = ops.itens().get(i);
            def(item, "getData", texto(op, "data"));
            def(item, "getQuantidade", pgd(texto(op, "quantidade")));
            def(item, "getValor", pgd(texto(op, "valor")));
            if (venda) {
                def(item, "getCotacaoDolar", texto(op, "cotacaoDolar"));
                Map<String, Object> adq = mapa(op, "adquirente");
                def(item, "getNiAdquirente", padrao(digitos(texto(adq, "cpf")), Documentos.cpf(9102)));
                def(item, "getNomeAdquirente", padrao(texto(adq, "nome"), "ADQUIRENTE FICTICIO"));
            }
        }
    }

    private static void participacao(Object al, Map<String, Object> a) throws Exception {
        inicio(al, a);
        def(al, "getParticipacaoSocietaria.getCnpj", padrao(digitos(texto(a, "cnpj")), Documentos.cnpj(9101)));
        def(al, "getParticipacaoSocietaria.getNome", padrao(texto(a, "descricao"), "SOCIEDADE FICTICIA LTDA"));
        def(al, "getParticipacaoSocietaria.getEspecie", "3");
        def(al, "getParticipacaoSocietaria.getUf", "DF");
        def(al, "getParticipacaoSocietaria.getMunicipio", "9701");
        // Quotas: o programa calcula o custo da parcela como quantidade x custo médio.
        long quantidade = Long.parseLong(digitos(texto(a, "quantidade")));
        long custo = Long.parseLong(padrao(digitos(texto(a, "custoAquisicao")), "0"));
        if (quantidade <= 0 || (custo * 10000L) % quantidade != 0) {
            throw new IllegalArgumentException("custoAquisicao / quantidade precisa ter no máximo 6 casas decimais");
        }
        Object parcela = novo((Colecao<?>) obter(al, "getColecaoParcelaAquisicaoParticipacaoSocietaria"));
        def(parcela, "getData", texto(a, "dataAquisicao"));
        def(parcela, "getEspecieAquisicao", "3");
        def(parcela, "getQuantidadeQuotas", String.valueOf(quantidade));
        long medio = custo * 10000L / quantidade; // centavos com 4 casas extras = 6 casas em reais
        def(parcela, "getCustoMedio", (medio / 1000000L) + "," + String.format("%06d", medio % 1000000L));
        operacao(al, a);
        adquirente(al, a);
    }

    // ------------------------------------------------------------- resultado

    private static Map<String, Object> resultadoMoeda(MoedaAlienada m) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("tipo", "moeda");
        r.put("custoMedioInicial", formatado(m, "getCustoMedioInicial"));
        List<Object> ops = new ArrayList<>();
        for (Object o : m.getOperacoesEspecie().itens()) {
            Map<String, Object> x = new LinkedHashMap<>();
            x.put("estoque", centavos(o, "getEstoque"));
            x.put("saldo", centavos(o, "getSaldo"));
            x.put("custoMedio", formatado(o, "getCustoMedio"));
            x.put("custoAlienacao", centavos(o, "getCustoAlienacao"));
            x.put("ganhoCapital", centavos(o, "getGanhoCapital"));
            ops.add(x);
        }
        r.put("operacoes", ops);
        r.put("ganhoCapital", centavos(m, "getOperacoesEspecie.getTotalGanhoCapital"));
        return r;
    }

    private static Map<String, Object> resultado(String tipo, Object al, boolean exterior) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("tipo", tipo);
        if (exterior) {
            Map<String, Object> ex = new LinkedHashMap<>();
            ex.put("valorLiquidoDolar", centavos(al, "getApuracao.getValorLiquidoAlienacaoDolar"));
            ex.put("custoNacionalReal", centavos(al, "getApuracao.getCustoAquisicaoOrigemNacionalReal"));
            ex.put("ganhoNacionalReal", centavos(al, "getApuracao.getGanhoCapital1OrigemNacionalReal"));
            ex.put("ganhoEstrangeiraDolar", centavos(al, "getApuracao.getGanhoCapital1OrigemMEDolar"));
            ex.put("ganhoEstrangeiraReal", centavos(al, "getApuracao.getGanhoCapital1OrigemMEReal"));
            ex.put("ganhoTotal", centavos(al, "getApuracao.getGanhoCapitalTotalExterior"));
            ex.put("percentualEstrangeira", formatado(al, "getApuracao.getPercentualCustoAquisicaoOrigemME"));
            r.put("exterior", ex);
        }
        r.put("valorLiquido", centavos(al, "getApuracao.getValorLiquidoAlienacao"));
        r.put("custoAquisicao", centavos(al, "getApuracao.getCustoAquisicao"));
        r.put("ganhoBruto", centavos(al, "getApuracao.getGanhoCapital1"));
        Map<String, Object> red = new LinkedHashMap<>();
        red.put("lei7713", centavos(al, "getApuracao.getValorReducaoLei7713"));
        red.put("fr1", centavos(al, "getApuracao.getValorReducaoLei11196FR1"));
        red.put("fr2", centavos(al, "getApuracao.getValorReducaoLei11196FR2"));
        red.put("outroImovel", centavos(al, "getApuracao.getValorReducaoAplicacaoOutroImovel"));
        red.put("unicoImovel", centavos(al, "getApuracao.getValorReducaoUnicoImovel"));
        red.put("pequenoValor", centavos(al, "getApuracao.getValorReducaoBemPequenoValor"));
        r.put("reducoes", red);
        Map<String, Object> pct = new LinkedHashMap<>();
        pct.put("lei7713", formatado(al, "getApuracao.getPercentualReducaoLei7713"));
        pct.put("fr1", formatado(al, "getApuracao.getPercentualReducaoLei11196FR1"));
        pct.put("fr2", formatado(al, "getApuracao.getPercentualReducaoLei11196FR2"));
        r.put("percentuaisReducao", pct);
        r.put("ganhoTributavel", centavos(al, "getCalculoImposto.getGanhoCapitalTotal"));
        r.put("impostoDevido", centavos(al, "getCalculoImposto.getImpostoDevido"));
        r.put("aliquotaMedia", formatado(al, "getCalculoImposto.getAliquotaMedia"));
        r.put("rendimentoIsento", centavos(al, "getConsolidacao.getTotalRendIsentosNaoTributaveis"));
        r.put("rendimentoTributavel", centavos(al, "getConsolidacao.getTotalRendSujeitosTributacao"));
        return r;
    }

    // ------------------------------------------------------------ utilidades

    /**
     * Cria e abre o demonstrativo do residente (período de 01/01 a 31/12 do ano-calendário).
     * Fora da interface gráfica, o nome do arquivo do demonstrativo depende do demonstrativo
     * "aberto" no controlador da interface, por isso o campo estático é preenchido por reflexão.
     */
    private static DemonstrativoGCAP abrir(String cpf, String nome) throws Exception {
        IdDemonstrativoGCAP id = new IdDemonstrativoGCAP();
        id.getCpf().setConteudo(cpf);
        id.getNome().setConteudo(nome);
        id.getExercicio().setConteudo("2025");
        id.getDataInicioPermanencia().setConteudo("01012025");
        id.getDataFimPermanencia().setConteudo("31122025");
        id.getPaisDeclarante().setConteudo("105");
        DemonstrativoGCAP inicial = new DemonstrativoGCAP(id);
        Field aberto = ControladorGui.class.getDeclaredField("demonstrativoAberto");
        aberto.setAccessible(true);
        aberto.set(null, inicial);
        GCAPFacade.setCacheIdDeclaracao(true);
        GCAPFacade.criarDeclaracao(inicial);
        GCAPFacade.abreDeclaracaoSemUI(id);
        DemonstrativoGCAP d = GCAPFacade.getInstancia().getDeclaracao();
        aberto.set(null, d);
        return d;
    }

    private static Object novo(Colecao<?> c) {
        int i = c.novoObjeto();
        return c.itens().get(i);
    }

    static Object obter(Object raiz, String caminho) throws Exception {
        Object o = raiz;
        for (String p : caminho.split("\\.")) {
            Method m = o.getClass().getMethod(p);
            o = m.invoke(o);
        }
        return o;
    }

    /** Define um campo e confere que o programa aceitou o valor (campo calculado falha aqui). */
    static void def(Object raiz, String caminho, String valor) throws Exception {
        Informacao<?> i = (Informacao<?>) obter(raiz, caminho);
        if (i.isReadOnly()) {
            throw new IllegalStateException("campo somente leitura: " + caminho);
        }
        i.setConteudo(valor);
        String lido = digitos(i.naoFormatado());
        if (!valor.isEmpty() && lido.isEmpty() && !digitos(valor).isEmpty()) {
            throw new IllegalStateException("o programa não aceitou " + caminho + "=" + valor);
        }
    }

    private static String centavos(Object raiz, String caminho) {
        try {
            String t = ((Informacao<?>) obter(raiz, caminho)).naoFormatado();
            String d = digitos(t);
            return d.isEmpty() ? "0" : String.valueOf(Long.parseLong(d));
        } catch (Exception e) {
            return "0";
        }
    }

    private static String formatado(Object raiz, String caminho) {
        try {
            return ((Informacao<?>) obter(raiz, caminho)).formatado().trim();
        } catch (Exception e) {
            return "";
        }
    }

    /** Centavos inteiros ("123456") no texto do programa ("1234,56"). */
    private static String pgd(String centavos) {
        String c = padrao(digitos(centavos), "0");
        long v = Long.parseLong(c);
        return (v / 100) + "," + String.format("%02d", v % 100);
    }

    private static boolean temValor(String centavos) {
        String d = digitos(centavos);
        return !d.isEmpty() && Long.parseLong(d) != 0;
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
