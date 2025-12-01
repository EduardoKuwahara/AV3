import { NivelPermissao } from "../enums/NivelPermissao";
import { randomBytes, scryptSync } from 'crypto';

export class Funcionario {
    id: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senhaHash: string;
    salt: string;
    nivelPermissao: NivelPermissao;

    constructor(id: string, nome: string, telefone: string, endereco: string, usuario: string, senhaHash: string, salt: string, nivelPermissao: NivelPermissao) {
        this.id = id;
        this.nome = nome;
        this.telefone = telefone;
        this.endereco = endereco;
        this.usuario = usuario;
        this.senhaHash = senhaHash;
        this.salt = salt;
        this.nivelPermissao = nivelPermissao;
    }

    static gerarHash(senha: string): { hash: string; salt: string } {
        const salt = randomBytes(16).toString('hex');
        const derived = scryptSync(senha, salt, 64);
        return { hash: derived.toString('hex'), salt };
    }

    verificarSenha(senha: string): boolean {
        const derived = scryptSync(senha, this.salt, 64);
        return derived.toString('hex') === this.senhaHash;
    }

    autenticar(usuario: string, senha: string): boolean {
        return this.usuario === usuario && this.verificarSenha(senha);
    }

    detalhes(): void {
        console.log(`ID: ${this.id}, Nome: ${this.nome}, Permissão: ${this.nivelPermissao}`);
    }

    salvar(): void {
        console.log(`Salvando funcionário ${this.id}...`);
    }
}