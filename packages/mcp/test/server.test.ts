import { calcularDvCnpj, calcularDvCpf } from "@autoir/core";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createServer } from "../src/index.js";

describe("createServer", () => {
  let client: Client;
  let fechar: () => Promise<void>;

  beforeEach(async () => {
    const server = createServer();
    const [ladoCliente, ladoServidor] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: "teste", version: "0.0.0" });
    await Promise.all([server.connect(ladoServidor), client.connect(ladoCliente)]);
    fechar = async () => {
      await client.close();
      await server.close();
    };
  });

  afterEach(async () => {
    await fechar();
  });

  it("anuncia a tool validar_documento", async () => {
    const { tools } = await client.listTools();
    const tool = tools.find((t) => t.name === "validar_documento");
    expect(tool).toBeDefined();
    expect(tool?.inputSchema.required).toEqual(["documento"]);
  });

  it("valida CPF e CNPJ sintéticos", async () => {
    const cpf = `246813579${calcularDvCpf("246813579")}`;
    const r1 = await client.callTool({ name: "validar_documento", arguments: { documento: cpf } });
    expect(r1.structuredContent).toEqual({ tipo: "cpf", valido: true, normalizado: cpf });

    const base = "135792460001";
    const cnpj = `${base}${calcularDvCnpj(base)}`;
    const r2 = await client.callTool({
      name: "validar_documento",
      arguments: { documento: `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}` },
    });
    expect(r2.structuredContent).toEqual({ tipo: "cnpj", valido: true, normalizado: cnpj });
  });

  it("informa documento inválido sem erro de protocolo", async () => {
    const r = await client.callTool({
      name: "validar_documento",
      arguments: { documento: "000" },
    });
    expect(r.isError).toBeFalsy();
    expect(r.structuredContent).toMatchObject({ tipo: "desconhecido", valido: false });
  });

  it("rejeita argumento ausente", async () => {
    const r = await client.callTool({ name: "validar_documento", arguments: {} });
    expect(r.isError).toBe(true);
  });
});
