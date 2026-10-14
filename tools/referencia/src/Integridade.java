import java.io.File;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.CRC32;

import serpro.ppgd.irpf.txt.gravacaorestauracao.ConstantesRepositorio;
import serpro.ppgd.irpf.txt.gravacaorestauracao.RepositorioDeclaracaoCentralTxt;

/**
 * Verificações de integridade de um arquivo .DBK/.DEC.
 *
 * Combina três tipos de checagem:
 * - a do próprio programa oficial (validação de CRC e, para o .DEC, dos hashes de entrega);
 * - uma conferência própria, observada nos arquivos gerados: cada registro, exceto o header
 *   "IR", termina com 10 dígitos que são o CRC32 dos bytes anteriores da mesma linha.
 *
 * - o NR_CONTROLE do header "IR" (últimos 10 dígitos da linha), que o programa calcula com
 *   RegistroTxt.calculaCRCHeader(prefixo): CRC32 de (prefixo + linha do header sem os 10 dígitos
 *   finais), em que o prefixo é "<8 primeiros dígitos do CPF>.<extensão>", por exemplo
 *   "10011265.DBK" ou "10011265.DEC" (observado em tempo de execução). Por isso DBK e DEC com o
 *   mesmo header têm controles diferentes. Não depende de caminho, data ou hora.
 *
 * A restauração da cópia de segurança pelo programa oficial NÃO confere o CRC por linha nem os
 * hashes (um valor alterado com o CRC antigo é restaurado sem erro), por isso esta conferência é
 * reportada à parte.
 */
final class Integridade {
    private Integridade() {
    }

    static Map<String, Object> verificar(File arquivo) {
        Map<String, Object> r = new LinkedHashMap<>();
        boolean dec = arquivo.getName().toUpperCase().endsWith(".DEC");
        r.put("crcPrograma", tentar(() -> {
            RepositorioDeclaracaoCentralTxt rep = new RepositorioDeclaracaoCentralTxt(ConstantesRepositorio.ARQ_IRPF, arquivo);
            rep.lerDeclaracao();
            rep.getArquivo().validarCRC();
        }));
        r.put("hashPrograma", dec ? tentar(() -> {
            RepositorioDeclaracaoCentralTxt rep = new RepositorioDeclaracaoCentralTxt(ConstantesRepositorio.ARQ_IRPF, arquivo);
            rep.lerDeclaracao();
            rep.getArquivo().validarHashsDeclaracao();
        }) : "não se aplica (o .DBK não tem registros de hash)");
        r.put("controleHeader", controleHeader(arquivo));
        r.put("crcPorLinha", crcPorLinha(arquivo));
        return r;
    }

    interface Acao {
        void executar() throws Exception;
    }

    private static String tentar(Acao a) {
        try {
            a.executar();
            return "ok";
        } catch (Throwable t) {
            return "erro: " + t.getMessage();
        }
    }

    /** Prefixo do NR_CONTROLE: 8 primeiros dígitos do CPF, ponto e extensão em maiúsculas. */
    static String prefixoControle(String cpf, String extensao) {
        return cpf.substring(0, 8) + "." + extensao.toUpperCase();
    }

    private static Object controleHeader(File arquivo) {
        Map<String, Object> r = new LinkedHashMap<>();
        try {
            byte[] tudo = Files.readAllBytes(arquivo.toPath());
            int fim = 0;
            while (fim < tudo.length && tudo[fim] != '\r' && tudo[fim] != '\n') {
                fim++;
            }
            String header = new String(tudo, 0, fim, "ISO-8859-1");
            if (!header.startsWith("IR") || header.length() < 42) {
                r.put("situacao", "header IR ausente");
                return r;
            }
            String nome = arquivo.getName();
            String ext = nome.contains(".") ? nome.substring(nome.lastIndexOf('.') + 1) : "";
            String cpf = header.substring(21, 32);
            String prefixo = prefixoControle(cpf, ext);
            String gravado = header.substring(header.length() - 10);
            CRC32 crc = new CRC32();
            crc.update(prefixo.getBytes("ISO-8859-1"));
            crc.update(header.substring(0, header.length() - 10).getBytes("ISO-8859-1"));
            String calculado = String.format("%010d", crc.getValue());
            r.put("prefixo", prefixo);
            r.put("gravado", gravado);
            r.put("calculado", calculado);
            try {
                RepositorioDeclaracaoCentralTxt rep = new RepositorioDeclaracaoCentralTxt(ConstantesRepositorio.ARQ_IRPF, arquivo);
                rep.lerDeclaracao();
                r.put("calculadoPrograma", rep.recuperarRegistroHeader().calculaCRCHeader(prefixo));
            } catch (Exception e) {
                r.put("calculadoPrograma", "erro: " + e.getMessage());
            }
            r.put("situacao", calculado.equals(gravado) ? "ok" : "divergente");
        } catch (Exception e) {
            r.put("situacao", "erro: " + e.getMessage());
        }
        return r;
    }

    private static Object crcPorLinha(File arquivo) {
        List<Object> erros = new ArrayList<>();
        int conferidas = 0;
        try {
            byte[] tudo = Files.readAllBytes(arquivo.toPath());
            int ini = 0;
            int numero = 0;
            for (int k = 0; k <= tudo.length; k++) {
                boolean fim = k == tudo.length || tudo[k] == '\n';
                if (!fim) {
                    continue;
                }
                int f = k;
                if (f > ini && tudo[f - 1] == '\r') {
                    f--;
                }
                numero++;
                int tam = f - ini;
                if (tam > 12 && !(tudo[ini] == 'I' && tudo[ini + 1] == 'R')) {
                    String tipo = new String(tudo, ini, 2, "ISO-8859-1");
                    String esperado = new String(tudo, f - 10, 10, "ISO-8859-1");
                    CRC32 crc = new CRC32();
                    crc.update(tudo, ini, tam - 10);
                    String calculado = String.format("%010d", crc.getValue());
                    conferidas++;
                    if (!calculado.equals(esperado)) {
                        Map<String, Object> e = new LinkedHashMap<>();
                        e.put("linha", String.valueOf(numero));
                        e.put("registro", tipo);
                        e.put("gravado", esperado);
                        e.put("calculado", calculado);
                        erros.add(e);
                    }
                }
                ini = k + 1;
            }
        } catch (Exception e) {
            return "erro: " + e.getMessage();
        }
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("linhasConferidas", String.valueOf(conferidas));
        r.put("divergencias", erros);
        return r;
    }
}
