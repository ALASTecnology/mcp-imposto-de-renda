import java.io.File;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;

import serpro.ppgd.irpf.gui.basica.ControladorGui;
import serpro.ppgd.irpf.negocio.DeclaracaoIRPF;
import serpro.ppgd.irpf.txt.importacao.atividaderural.RepositorioTxtDadosAtividadeRural;

/**
 * Importa na declaração o arquivo que o programa da Atividade Rural 2025 grava em "Exportar
 * para o IRPF" (`<CPF>-ARURAL-2025-2025-EXPORTA-IRPF2026.DEC`, texto com o demonstrativo mensal
 * do livro caixa), pelo mesmo repositório que a ação "Importar Atividade Rural" do programa usa
 * (confere a versão, o CRC e distribui os meses pelas fichas da atividade rural).
 */
final class ImportacaoAr {
    private ImportacaoAr() {
    }

    static void importar(DeclaracaoIRPF d, File arquivo) throws Exception {
        // Fora da interface, as fichas consultam a declaração "aberta" no controlador da GUI.
        Field aberto = ControladorGui.class.getDeclaredField("demonstrativoAberto");
        aberto.setAccessible(true);
        aberto.set(null, d);
        String erro = new RepositorioTxtDadosAtividadeRural(arquivo.getAbsolutePath()).importaDados();
        if (erro != null && !erro.isEmpty()) {
            throw new IllegalStateException("o programa recusou o arquivo da atividade rural: " + erro);
        }
    }

    /** Copia o arquivo exportado para a pasta de fixtures (propriedade ar.fixtures) como `<id>.DEC`. */
    static int copiarExportado(File arquivo, String idCaso) throws Exception {
        File dir = new File(System.getProperty("ar.fixtures"));
        dir.mkdirs();
        Files.copy(arquivo.toPath(), new File(dir, idCaso + ".DEC").toPath(), StandardCopyOption.REPLACE_EXISTING);
        return 1;
    }
}
