// Carregador usado só no teste de integração: permite executar o código-fonte TypeScript do
// workspace direto no Node (remoção de tipos nativa), trocando importações ".js" pelo ".ts"
// correspondente quando o arquivo .js não existe.
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

registerHooks({
  resolve(especificador, contexto, proximo) {
    if (especificador.endsWith(".js") && contexto.parentURL?.endsWith(".ts")) {
      const ts = new URL(especificador.replace(/\.js$/, ".ts"), contexto.parentURL);
      if (ts.protocol === "file:" && existsSync(fileURLToPath(ts)))
        return proximo(ts.href, contexto);
    }
    return proximo(especificador, contexto);
  },
});
