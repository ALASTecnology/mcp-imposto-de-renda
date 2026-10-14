import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Leitor e escritor de JSON mínimo, sem dependências, suficiente para os casos de referência.
 * Objetos viram LinkedHashMap (preserva a ordem das chaves), listas viram ArrayList, números
 * ficam como texto (String) para não perder precisão, e literais true/false/null viram
 * Boolean/null.
 */
final class Json {
    private final String s;
    private int i;

    private Json(String s) {
        this.s = s;
    }

    static Object ler(String texto) {
        Json j = new Json(texto);
        j.espacos();
        Object v = j.valor();
        j.espacos();
        if (j.i != j.s.length()) {
            throw j.erro("conteúdo extra após o fim do documento");
        }
        return v;
    }

    private RuntimeException erro(String msg) {
        return new IllegalArgumentException("JSON inválido na posição " + i + ": " + msg);
    }

    private void espacos() {
        while (i < s.length() && Character.isWhitespace(s.charAt(i))) {
            i++;
        }
    }

    private Object valor() {
        if (i >= s.length()) {
            throw erro("fim inesperado");
        }
        char c = s.charAt(i);
        switch (c) {
            case '{':
                return objeto();
            case '[':
                return lista();
            case '"':
                return texto();
            case 't':
                literal("true");
                return Boolean.TRUE;
            case 'f':
                literal("false");
                return Boolean.FALSE;
            case 'n':
                literal("null");
                return null;
            default:
                return numero();
        }
    }

    private void literal(String l) {
        if (!s.startsWith(l, i)) {
            throw erro("esperado " + l);
        }
        i += l.length();
    }

    private String numero() {
        int ini = i;
        while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) {
            i++;
        }
        if (ini == i) {
            throw erro("valor inesperado '" + s.charAt(i) + "'");
        }
        return s.substring(ini, i);
    }

    private Map<String, Object> objeto() {
        Map<String, Object> m = new LinkedHashMap<>();
        i++;
        espacos();
        if (s.charAt(i) == '}') {
            i++;
            return m;
        }
        while (true) {
            espacos();
            String k = texto();
            espacos();
            if (s.charAt(i) != ':') {
                throw erro("esperado ':'");
            }
            i++;
            espacos();
            m.put(k, valor());
            espacos();
            char c = s.charAt(i++);
            if (c == '}') {
                return m;
            }
            if (c != ',') {
                throw erro("esperado ',' ou '}'");
            }
        }
    }

    private List<Object> lista() {
        List<Object> l = new ArrayList<>();
        i++;
        espacos();
        if (s.charAt(i) == ']') {
            i++;
            return l;
        }
        while (true) {
            espacos();
            l.add(valor());
            espacos();
            char c = s.charAt(i++);
            if (c == ']') {
                return l;
            }
            if (c != ',') {
                throw erro("esperado ',' ou ']'");
            }
        }
    }

    private String texto() {
        if (s.charAt(i) != '"') {
            throw erro("esperado '\"'");
        }
        i++;
        StringBuilder b = new StringBuilder();
        while (true) {
            char c = s.charAt(i++);
            if (c == '"') {
                return b.toString();
            }
            if (c == '\\') {
                char e = s.charAt(i++);
                switch (e) {
                    case 'n': b.append('\n'); break;
                    case 't': b.append('\t'); break;
                    case 'r': b.append('\r'); break;
                    case 'b': b.append('\b'); break;
                    case 'f': b.append('\f'); break;
                    case 'u':
                        b.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                        i += 4;
                        break;
                    default: b.append(e);
                }
            } else {
                b.append(c);
            }
        }
    }

    /** Serializa com indentação de 2 espaços e quebra de linha final. */
    static String escrever(Object v) {
        StringBuilder b = new StringBuilder();
        escrever(b, v, 0);
        b.append('\n');
        return b.toString();
    }

    @SuppressWarnings("unchecked")
    private static void escrever(StringBuilder b, Object v, int nivel) {
        if (v == null) {
            b.append("null");
        } else if (v instanceof Boolean) {
            b.append(v.toString());
        } else if (v instanceof Map) {
            Map<String, Object> m = (Map<String, Object>) v;
            if (m.isEmpty()) {
                b.append("{}");
                return;
            }
            b.append("{\n");
            int n = 0;
            for (Map.Entry<String, Object> e : m.entrySet()) {
                recuo(b, nivel + 1);
                aspas(b, e.getKey());
                b.append(": ");
                escrever(b, e.getValue(), nivel + 1);
                if (++n < m.size()) {
                    b.append(',');
                }
                b.append('\n');
            }
            recuo(b, nivel);
            b.append('}');
        } else if (v instanceof List) {
            List<Object> l = (List<Object>) v;
            if (l.isEmpty()) {
                b.append("[]");
                return;
            }
            b.append("[\n");
            for (int k = 0; k < l.size(); k++) {
                recuo(b, nivel + 1);
                escrever(b, l.get(k), nivel + 1);
                if (k + 1 < l.size()) {
                    b.append(',');
                }
                b.append('\n');
            }
            recuo(b, nivel);
            b.append(']');
        } else if (v instanceof Number) {
            b.append(v.toString());
        } else {
            aspas(b, v.toString());
        }
    }

    private static void recuo(StringBuilder b, int nivel) {
        for (int k = 0; k < nivel; k++) {
            b.append("  ");
        }
    }

    private static void aspas(StringBuilder b, String t) {
        b.append('"');
        for (int k = 0; k < t.length(); k++) {
            char c = t.charAt(k);
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 0x20) {
                        b.append(String.format("\\u%04x", (int) c));
                    } else {
                        b.append(c);
                    }
            }
        }
        b.append('"');
    }
}
