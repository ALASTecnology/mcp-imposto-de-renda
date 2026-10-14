/**
 * Gerador determinístico de CPF e CNPJ sintéticos com dígitos verificadores válidos.
 *
 * A mesma semente sempre produz o mesmo número, o que mantém os casos de referência estáveis.
 * Os números só têm estrutura válida (módulo 11); não correspondem a pessoas ou empresas reais
 * de forma intencional.
 */
final class Documentos {
    private Documentos() {
    }

    /** CPF de 11 dígitos derivado da semente (1 a 999999). */
    static String cpf(long semente) {
        long base = (semente * 7_919L + 104_729L * (semente % 97) + 100_000_007L) % 1_000_000_000L;
        String b = String.format("%09d", base);
        if (b.chars().distinct().count() == 1) {
            b = String.format("%09d", (base + 1) % 1_000_000_000L);
        }
        int d1 = dvCpf(b, 10);
        int d2 = dvCpf(b + d1, 11);
        return b + d1 + d2;
    }

    private static int dvCpf(String digitos, int pesoInicial) {
        int soma = 0;
        for (int k = 0; k < digitos.length(); k++) {
            soma += (digitos.charAt(k) - '0') * (pesoInicial - k);
        }
        int r = 11 - (soma % 11);
        return r >= 10 ? 0 : r;
    }

    /** CNPJ de 14 dígitos (matriz 0001) derivado da semente. */
    static String cnpj(long semente) {
        long raiz = (semente * 15_485_863L + 10_000_019L) % 100_000_000L;
        String b = String.format("%08d", raiz) + "0001";
        int d1 = dvCnpj(b);
        int d2 = dvCnpj(b + d1);
        return b + d1 + d2;
    }

    /** NIT/PIS/PASEP de 11 dígitos derivado da semente. */
    static String nit(long semente) {
        String b = String.format("%010d", (semente * 104_723L + 1_200_000_003L) % 10_000_000_000L);
        if (b.charAt(0) == '0') {
            b = "1" + b.substring(1);
        }
        int[] pesos = {3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int soma = 0;
        for (int k = 0; k < 10; k++) {
            soma += (b.charAt(k) - '0') * pesos[k];
        }
        int r = 11 - (soma % 11);
        return b + (r >= 10 ? 0 : r);
    }

    private static int dvCnpj(String digitos) {
        int[] pesos = digitos.length() == 12
                ? new int[] {5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2}
                : new int[] {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};
        int soma = 0;
        for (int k = 0; k < digitos.length(); k++) {
            soma += (digitos.charAt(k) - '0') * pesos[k];
        }
        int r = soma % 11;
        return r < 2 ? 0 : 11 - r;
    }
}
