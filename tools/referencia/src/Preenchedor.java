import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import serpro.ppgd.irpf.negocio.DeclaracaoIRPF;
import serpro.ppgd.irpf.negocio.alimentandos.Alimentando;
import serpro.ppgd.irpf.negocio.dependentes.Dependente;
import serpro.ppgd.irpf.negocio.doacaodeclaracao.EstatutoCriancaAdolescente;
import serpro.ppgd.irpf.negocio.doacaodeclaracao.EstatutoIdoso;
import serpro.ppgd.irpf.negocio.pagamentos.Pagamento;
import serpro.ppgd.irpf.negocio.rendIsentos.ItemQuadroAuxiliarAb;
import serpro.ppgd.irpf.negocio.rendpf.MesRendPF;
import serpro.ppgd.irpf.negocio.rendpf.RendPF;
import serpro.ppgd.irpf.negocio.rendpj.RendPJDependente;
import serpro.ppgd.irpf.negocio.rendpj.RendPJTitular;
import serpro.ppgd.negocio.Colecao;
import serpro.ppgd.negocio.Informacao;

/**
 * Preenche uma declaração do programa oficial a partir do bloco "entrada" de um caso JSON.
 * Campos não exigidos pelo formato do caso (endereço, ocupação, nomes de beneficiários) são
 * completados com valores sintéticos fixos.
 */
final class Preenchedor {
    /** Quadros de rendimentos isentos suportados, por código da ficha. */
    private static final Map<String, String> QUADROS_ISENTOS = new LinkedHashMap<>();
    /** Quadros de rendimentos de tributação exclusiva suportados, por código da ficha. */
    private static final Map<String, String> QUADROS_EXCLUSIVOS = new LinkedHashMap<>();

    static {
        QUADROS_ISENTOS.put("01", "getBolsaEstudosQuadroAuxiliar");
        QUADROS_ISENTOS.put("02", "getMedicosResidentesQuadroAuxiliar");
        QUADROS_ISENTOS.put("04", "getIndenizacoesQuadroAuxiliar");
        QUADROS_ISENTOS.put("09", "getLucroRecebidoQuadroAuxiliar");
        QUADROS_ISENTOS.put("10", "getParcIsentaAposentadoriaQuadroAuxiliar");
        QUADROS_ISENTOS.put("11", "getPensaoQuadroAuxiliar");
        QUADROS_ISENTOS.put("12", "getPoupancaQuadroAuxiliar");
        QUADROS_ISENTOS.put("13", "getRendSocioQuadroAuxiliar");
        QUADROS_ISENTOS.put("14", "getTransferenciasQuadroAuxiliar");
        QUADROS_ISENTOS.put("26", "getOutrosQuadroAuxiliar");
        QUADROS_EXCLUSIVOS.put("06", "getRendAplicacoesQuadroAuxiliar");
        QUADROS_EXCLUSIVOS.put("10", "getJurosCapitalProprioQuadroAuxiliar");
        QUADROS_EXCLUSIVOS.put("11", "getParticipacaoLucrosResultadosQuadroAuxiliar");
        QUADROS_EXCLUSIVOS.put("12", "getOutrosQuadroAuxiliar");
    }

    private static final String[] MESES = {
        "getJaneiro", "getFevereiro", "getMarco", "getAbril", "getMaio", "getJunho",
        "getJulho", "getAgosto", "getSetembro", "getOutubro", "getNovembro", "getDezembro"
    };

    private final DeclaracaoIRPF d;
    private final String cpfTitular;
    private final Map<String, String> nomesDependentes = new HashMap<>();
    private final Map<String, String> nomesAlimentandos = new HashMap<>();
    private final List<String> avisos = new ArrayList<>();
    private int sequenciaFonte = 900;

    Preenchedor(DeclaracaoIRPF d, String cpfTitular) {
        this.d = d;
        this.cpfTitular = cpfTitular;
    }

    List<String> avisos() {
        return avisos;
    }

    void preencher(Map<String, Object> e) {
        identificacao(Referencia.mapa(e, "titular"));
        for (Object o : Referencia.lista(e, "dependentes")) {
            dependente(cast(o));
        }
        for (Object o : Referencia.lista(e, "rendimentosPJ")) {
            rendimentoPJ(cast(o));
        }
        for (Object o : Referencia.lista(Referencia.mapa(e, "rendimentosPF"), "meses")) {
            mesPF(cast(o));
        }
        for (Object o : Referencia.lista(e, "pagamentos")) {
            pagamento(cast(o));
        }
        for (Object o : Referencia.lista(e, "rendimentosIsentos")) {
            quadro(cast(o), d.getRendIsentos(), QUADROS_ISENTOS, "rendimentosIsentos");
        }
        for (Object o : Referencia.lista(e, "tributacaoExclusiva")) {
            quadro(cast(o), d.getRendTributacaoExclusiva(), QUADROS_EXCLUSIVOS, "tributacaoExclusiva");
        }
        impostoPago(Referencia.mapa(e, "impostoPago"));
        doacoes(Referencia.mapa(e, "doacoesDiretas"));
        if (!nomesAlimentandos.isEmpty()) {
            // Confirmação de que os alimentandos atendem aos requisitos ("S"); feita por último
            // porque a inclusão de pagamentos de pensão limpa o indicativo.
            d.getAlimentandos().getConfirmacao().setConteudo("S");
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> cast(Object o) {
        return (Map<String, Object>) o;
    }

    private static String t(Map<String, Object> m, String k) {
        return Referencia.texto(m, k);
    }

    private static void valor(Informacao<?> campo, Map<String, Object> m, String k) {
        if (m.containsKey(k) && m.get(k) != null) {
            campo.setConteudo(Referencia.centavosParaPgd(t(m, k)));
        }
    }

    private String proximoCnpj() {
        return Documentos.cnpj(++sequenciaFonte);
    }

    // ------------------------------------------------------------- titular

    private void identificacao(Map<String, Object> tit) {
        var c = d.getContribuinte();
        c.getDataNascimento().setConteudo(t(tit, "nascimento"));
        // Dados cadastrais sintéticos fixos; não influenciam o cálculo.
        c.getTipoLogradouro().setConteudo("RUA");
        c.getLogradouro().setConteudo("DAS FLORES FICTICIAS");
        c.getNumero().setConteudo("100");
        c.getBairro().setConteudo("CENTRO");
        c.getUf().setConteudo("DF");
        c.getMunicipio().setConteudo("9701");
        c.getCep().setConteudo("70040010");
        c.getNaturezaOcupacao().setConteudo("12");
        c.getOcupacaoPrincipal().setConteudo("212");
        // Indicativos da ficha de identificação: "0" = não (declaração original, sem alteração
        // cadastral, sem cônjuge, não assumiu residência em 2025).
        c.getDeclaracaoRetificadora().setConteudo("0");
        c.getEnderecoDiferente().setConteudo("0");
        c.getConjuge().setConteudo("0");
        c.getRetornoPais().setConteudo("0");
    }

    // ---------------------------------------------------------- dependentes

    private void dependente(Map<String, Object> m) {
        Dependente dep = d.getDependentes().instanciaNovoObjeto();
        String cpf = Referencia.digitos(t(m, "cpf"));
        dep.getCodigo().setConteudo(t(m, "codigo"));
        dep.getCpfDependente().setConteudo(cpf);
        dep.getNome().setConteudo(t(m, "nome"));
        dep.getDataNascimento().setConteudo(t(m, "nascimento"));
        d.getDependentes().add(dep);
        nomesDependentes.put(cpf, t(m, "nome"));
    }

    // -------------------------------------------------------- rendimentos PJ

    private void rendimentoPJ(Map<String, Object> m) {
        boolean dependente = "D".equalsIgnoreCase(t(m, "beneficiario"));
        RendPJTitular r;
        if (dependente) {
            RendPJDependente rd = d.getColecaoRendPJDependente().instanciaNovoObjeto();
            rd.getCpfDependente().setConteudo(Referencia.digitos(t(m, "cpfDependente")));
            r = rd;
        } else {
            r = d.getColecaoRendPJTitular().instanciaNovoObjeto();
        }
        r.getNIFontePagadora().setConteudo(Referencia.digitos(t(m, "cnpj")));
        r.getNomeFontePagadora().setConteudo(t(m, "nome"));
        valor(r.getRendRecebidoPJ(), m, "rendimento");
        valor(r.getContribuicaoPrevOficial(), m, "previdenciaOficial");
        valor(r.getImpostoRetidoFonte(), m, "irrf");
        valor(r.getDecimoTerceiro(), m, "decimoTerceiro");
        valor(r.getIRRFDecimoTerceiro(), m, "irrfDecimoTerceiro");
        if (dependente) {
            d.getColecaoRendPJDependente().add((RendPJDependente) r);
        } else {
            d.getColecaoRendPJTitular().add(r);
        }
    }

    // -------------------------------------------- rendimentos PF e exterior

    private void mesPF(Map<String, Object> m) {
        int mes = Integer.parseInt(t(m, "mes"));
        if (mes < 1 || mes > 12) {
            throw new IllegalArgumentException("mês inválido: " + mes);
        }
        RendPF rpf = d.getRendPFTitular();
        MesRendPF x = (MesRendPF) Referencia.chamar(rpf, MESES[mes - 1]);
        valor(x.getPessoaFisica(), m, "pessoaFisica");
        valor(x.getExterior(), m, "exterior");
        valor(x.getPrevidencia(), m, "previdenciaOficial");
        valor(x.getDependentes(), m, "dependentes");
        valor(x.getPensao(), m, "pensao");
        valor(x.getLivroCaixa(), m, "livroCaixa");
        // "carneLeao" é o imposto efetivamente pago em DARF no mês (coluna "Imposto pago").
        valor(x.getDarfPago(), m, "carneLeao");
        if (Referencia.temValor(t(m, "previdenciaOficial")) && rpf.getNITPISPASEP().isVazio()) {
            // O programa exige NIT/PIS/PASEP de quem informa previdência oficial no carnê-leão.
            rpf.getNITPISPASEP().setConteudo(Documentos.nit(Long.parseLong(Referencia.digitos(cpfTitular).substring(3))));
        }
    }

    // ------------------------------------------------------------ pagamentos

    private void pagamento(Map<String, Object> m) {
        String benef = t(m, "beneficiario").toUpperCase();
        if (benef.isEmpty()) {
            benef = "T";
        }
        String cpfDep = Referencia.digitos(t(m, "cpfDependente"));
        if ("A".equals(benef)) {
            garantirAlimentando(cpfDep);
        }
        Pagamento p = d.getPagamentos().instanciaNovoObjeto();
        p.getCodigo().setConteudo(t(m, "codigo"));
        p.getNiBeneficiario().setConteudo(Referencia.digitos(t(m, "cpfCnpj")));
        p.getNomeBeneficiario().setConteudo(nomeBeneficiario(t(m, "codigo")));
        p.getTipo().setConteudo(benef);
        if ("D".equals(benef)) {
            p.getDependenteOuAlimentando().setConteudo(nomesDependentes.getOrDefault(cpfDep, ""));
            p.getCPFDependente().setConteudo(cpfDep);
        } else if ("A".equals(benef)) {
            p.getDependenteOuAlimentando().setConteudo(nomesAlimentandos.get(cpfDep));
            p.getCPFAlimentando().setConteudo(cpfDep);
        }
        valor(p.getValorPago(), m, "valor");
        valor(p.getParcelaNaoDedutivel(), m, "parcelaNaoDedutivel");
        d.getPagamentos().add(p);
    }

    private static String nomeBeneficiario(String codigo) {
        return "BENEFICIARIO FICTICIO COD " + codigo;
    }

    private void garantirAlimentando(String cpf) {
        if (nomesAlimentandos.containsKey(cpf)) {
            return;
        }
        // O nome não pode ter dígitos; usa uma letra para distinguir os alimentandos.
        String nome = "ALIMENTANDO FICTICIO " + (char) ('A' + nomesAlimentandos.size());
        Alimentando a = d.getAlimentandos().instanciaNovoObjeto();
        a.getNome().setConteudo(nome);
        a.getCpf().setConteudo(cpf);
        a.getDtNascimento().setConteudo("01012012");
        a.getResidente().setConteudo("0");
        a.getCpfResponsavel().setConteudo(cpfTitular);
        // Pensão fixada por decisão judicial (opções do programa: J, C e A).
        a.getTipoProcesso().setConteudo("J");
        var dj = a.getDecisaoJudicial();
        dj.getNumProcessoJudicial().setConteudo("00012345620208070001");
        dj.getIdVaraCivil().setConteudo("0001");
        dj.getComarca().setConteudo("BRASILIA");
        dj.getUf().setConteudo("DF");
        dj.getDtDecisaoJud().setConteudo("15032020");
        d.getAlimentandos().add(a);
        nomesAlimentandos.put(cpf, nome);
    }

    // -------------------------------------------- isentos e tributação exclusiva

    @SuppressWarnings({"unchecked", "rawtypes"})
    private void quadro(Map<String, Object> m, Object ficha, Map<String, String> quadros, String nomeFicha) {
        String codigo = t(m, "codigo");
        String getter = quadros.get(codigo);
        if (getter == null) {
            throw new IllegalArgumentException(nomeFicha + ": código " + codigo
                    + " não suportado pelo harness (suportados: " + quadros.keySet() + ")");
        }
        Colecao col = (Colecao) Referencia.chamar(ficha, getter);
        ItemQuadroAuxiliarAb it = (ItemQuadroAuxiliarAb) col.instanciaNovoObjeto();
        boolean dependente = "D".equalsIgnoreCase(t(m, "beneficiario"));
        String cpfDep = Referencia.digitos(t(m, "cpfDependente"));
        it.getTipoBeneficiario().setConteudo(dependente ? "Dependente" : "Titular");
        it.getCpfBeneficiario().setConteudo(dependente ? cpfDep : cpfTitular);
        String cnpj = m.containsKey("cnpj") ? Referencia.digitos(t(m, "cnpj")) : proximoCnpj();
        String nome = m.containsKey("nome") ? t(m, "nome") : "FONTE PAGADORA FICTICIA " + codigo;
        definirSeExistir(it, "getNIFontePagadora", cnpj);
        definirSeExistir(it, "getCnpjEmpresa", cnpj);
        definirSeExistir(it, "getNomeFontePagadora", nome);
        definirSeExistir(it, "getNomeFonte", nome);
        definirSeExistir(it, "getDescricaoRendimento", "RENDIMENTO FICTICIO COD " + codigo);
        valor(it.getValor(), m, "valor");
        col.add(it);
    }

    private void definirSeExistir(Object alvo, String getter, String conteudo) {
        try {
            Object campo = alvo.getClass().getMethod(getter).invoke(alvo);
            if (campo instanceof Informacao) {
                ((Informacao<?>) campo).setConteudo(conteudo);
            }
        } catch (NoSuchMethodException e) {
            // Campo inexistente neste tipo de item; nada a preencher.
        } catch (ReflectiveOperationException e) {
            avisos.add("não foi possível preencher " + getter + ": " + e);
        }
    }

    // --------------------------------------------------------- imposto pago

    private void impostoPago(Map<String, Object> m) {
        var ip = d.getImpostoPago();
        valor(ip.getImpostoComplementar(), m, "complementar");
        valor(ip.getImpostoPagoExterior(), m, "exterior");
        valor(ip.getImpostoRetidoFonte(), m, "irrfLei11033");
    }

    // ------------------------------------------- doações direto na declaração

    private void doacoes(Map<String, Object> m) {
        if (Referencia.temValor(t(m, "eca"))) {
            EstatutoCriancaAdolescente e = d.getColecaoEstatutoCriancaAdolescente().instanciaNovoObjeto();
            e.getTipoFundo().setConteudo("E");
            e.getUf().setConteudo("DF");
            valor(e.getValor(), m, "eca");
            d.getColecaoEstatutoCriancaAdolescente().add(e);
        }
        if (Referencia.temValor(t(m, "idoso"))) {
            EstatutoIdoso e = d.getColecaoEstatutoIdoso().instanciaNovoObjeto();
            e.getTipoFundo().setConteudo("E");
            e.getUf().setConteudo("DF");
            valor(e.getValor(), m, "idoso");
            d.getColecaoEstatutoIdoso().add(e);
        }
    }
}
