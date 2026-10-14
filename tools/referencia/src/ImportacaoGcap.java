import java.io.File;
import java.io.InputStream;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import serpro.ppgd.irpf.gui.basica.ControladorGui;
import serpro.ppgd.irpf.negocio.DeclaracaoIRPF;
import serpro.ppgd.irpf.negocio.gcap.DemonstrativoGCAP;
import serpro.ppgd.irpf.txt.importacao.gcap.RepositorioXMLDadosGCAP;

/**
 * Importa na declaração o arquivo que o GCAP 2025 grava em "Exportar para o IRPF2026"
 * (`<CPF>-0101-3112-GCAP-2025.DEC`, um zip com o XML do demonstrativo e um config.properties).
 *
 * Segue o fluxo de importação do programa a partir do XML: descompacta o zip, lê o XML com o
 * repositório de dados GCAP do IRPF, inclui o demonstrativo na ficha GCAP e recalcula os
 * valores que o demonstrativo transporta para a declaração. O passo que o programa executa
 * antes, a consulta online da versão do GCAP que gerou o arquivo, não é feito: fora da rede ele
 * falha ("Não foi possível verificar a versão do demonstrativo de Ganhos de Capital.").
 */
final class ImportacaoGcap {
    private ImportacaoGcap() {
    }

    static void importar(DeclaracaoIRPF d, File dec) throws Exception {
        File xml = extrairXml(dec, Files.createTempDirectory("mcp-imposto-de-renda-gcap").toFile());
        // Fora da interface, a ficha GCAP consulta a declaração "aberta" no controlador da GUI.
        Field aberto = ControladorGui.class.getDeclaredField("demonstrativoAberto");
        aberto.setAccessible(true);
        aberto.set(null, d);
        DemonstrativoGCAP dem = new RepositorioXMLDadosGCAP().importaDados(xml);
        d.getGCAP().incluirDemonstrativo(dem);
        d.getGCAP().recalcularGCAPDeclaracaoIRPF();
    }

    /**
     * Copia o arquivo exportado (`<id>.DEC`) e o XML de dentro dele (`<id>.xml`) para a pasta de
     * fixtures do GCAP (propriedade gcap.fixtures); devolve quantos copiou.
     */
    static int copiarExportado(File dec, String idCaso) throws Exception {
        File dirFixtures = new File(System.getProperty("gcap.fixtures"));
        dirFixtures.mkdirs();
        Files.copy(dec.toPath(), new File(dirFixtures, idCaso + ".DEC").toPath(),
                StandardCopyOption.REPLACE_EXISTING);
        File xml = extrairXml(dec, Files.createTempDirectory("mcp-imposto-de-renda-gcap").toFile());
        Files.copy(xml.toPath(), new File(dirFixtures, idCaso + ".xml").toPath(),
                StandardCopyOption.REPLACE_EXISTING);
        return 2;
    }

    private static File extrairXml(File dec, File destino) throws Exception {
        try (ZipFile z = new ZipFile(dec)) {
            java.util.Enumeration<? extends ZipEntry> en = z.entries();
            while (en.hasMoreElements()) {
                ZipEntry e = en.nextElement();
                String nome = new File(e.getName()).getName();
                if (nome.toLowerCase().endsWith(".xml")) {
                    File f = new File(destino, nome);
                    try (InputStream in = z.getInputStream(e)) {
                        Files.copy(in, f.toPath(), StandardCopyOption.REPLACE_EXISTING);
                    }
                    return f;
                }
            }
        }
        throw new IllegalArgumentException("o arquivo não contém o XML do demonstrativo: " + dec);
    }
}
