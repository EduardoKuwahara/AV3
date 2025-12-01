import { StatusPeca } from "../enums/StatusPeca";
import { TipoPeca } from "../enums/TipoPeca";

export class Peca {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;

    constructor(nome: string, tipo: TipoPeca, fornecedor: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.fornecedor = fornecedor;
        this.status = StatusPeca.EM_PRODUCAO; 
    }

    atualizarStatus(novoStatus: StatusPeca): void {
        this.status = novoStatus;
        console.log(`O status da peça '${this.nome}' foi atualizado para '${novoStatus}'.`);
    }

    detalhes(): void {
        console.log(`Peça: ${this.nome}, Tipo: ${this.tipo}, Fornecedor: ${this.fornecedor}, Status: ${this.status}`);
    }
}