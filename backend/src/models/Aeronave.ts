import { TipoAeronave } from "../enums/TipoAeronave";
import { Etapa } from "./Etapa";
import { Peca } from "./Peca";
import { Teste } from "./Teste";

export class Aeronave {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
    pecas: Peca[];
    etapas: Etapa[];
    testes: Teste[];

    constructor(codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) {
        this.codigo = codigo;
        this.modelo = modelo;
        this.tipo = tipo;
        this.capacidade = capacidade;
        this.alcance = alcance;
        this.pecas = [];
        this.etapas = [];
        this.testes = [];
    }

    detalhes(): void {
        console.log("========================================");
        console.log(`Detalhes Completos da Aeronave [${this.codigo}]`);
        console.log("========================================");
        console.log(`Modelo: ${this.modelo}`);
        console.log(`Tipo: ${this.tipo}`);
        console.log(`Capacidade: ${this.capacidade} passageiros`);
        console.log(`Alcance: ${this.alcance} km`);
        console.log("\n--- Peças Associadas ---");
        this.pecas.length > 0 ? this.pecas.forEach(p => p.detalhes()) : console.log("Nenhuma peça associada.");
        console.log("\n--- Etapas de Produção ---");
        this.etapas.length > 0 ? this.etapas.forEach(e => console.log(`- ${e.nome} (${e.status})`)) : console.log("Nenhuma etapa definida.");
        console.log("\n--- Testes Realizados ---");
        this.testes.length > 0 ? this.testes.forEach(t => console.log(`- ${t.tipo}: ${t.resultado}`)) : console.log("Nenhum teste realizado.");
        console.log("========================================\n");
    }

    salvar(): void {
        console.log(`Salvando dados da aeronave ${this.codigo}...`);
    }

    carregar(codigo: string): void {
        console.log(`Carregando dados da aeronave ${codigo}...`);
    }
}