import { ResultadoTeste } from "../enums/ResultadoTeste";
import { TipoTeste } from "../enums/TipoTeste";

export class Teste {
    tipo: TipoTeste;
    resultado: ResultadoTeste;

    constructor(tipo: TipoTeste) {
        this.tipo = tipo;
        this.resultado = ResultadoTeste.REPROVADO; 
    }

    executarTeste(aprovado: boolean): void {
        this.resultado = aprovado ? ResultadoTeste.APROVADO : ResultadoTeste.REPROVADO;
        console.log(`Teste ${this.tipo} executado com resultado: ${this.resultado}.`);
    }

    salvar(): void {
        console.log(`Salvando resultado do teste ${this.tipo}...`);
    }
}