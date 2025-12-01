import { StatusEtapa } from "../enums/StatusEtapa";
import { Funcionario } from "./Funcionario";

export class Etapa {
    nome: string;
    prazo: string;
    status: StatusEtapa;
    funcionarios: Funcionario[];

    constructor(nome: string, prazo: string) {
        this.nome = nome;
        this.prazo = prazo;
        this.status = StatusEtapa.PENDENTE;
        this.funcionarios = [];
    }

    iniciar(): void {
        this.status = StatusEtapa.ANDAMENTO;
        console.log(`Etapa '${this.nome}' iniciada.`);
    }

    finalizar(): void {
        this.status = StatusEtapa.CONCLUIDA;
        console.log(`Etapa '${this.nome}' concluída.`);
    }

    associarFuncionario(funcionario: Funcionario): void {
        if (!this.funcionarios.find(f => f.id === funcionario.id)) {
            this.funcionarios.push(funcionario);
            console.log(`Funcionário ${funcionario.nome} associado à etapa '${this.nome}'.`);
        } else {
            console.log(`Funcionário ${funcionario.nome} já está associado a esta etapa.`);
        }
    }

    listarFuncionarios(): void {
        console.log(`--- Funcionários da Etapa: ${this.nome} ---`);
        this.funcionarios.forEach(f => f.detalhes());
    }
}