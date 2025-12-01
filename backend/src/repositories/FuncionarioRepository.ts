import { PrismaClient, Funcionario, NivelPermissao } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { randomBytes, scryptSync } from 'crypto';

export class FuncionarioRepository {
  
  async create(data: {
    idFuncionario: string;
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    senha: string;
    nivelPermissao: NivelPermissao;
  }): Promise<Funcionario> {
    const { hash, salt } = this.gerarHash(data.senha);
    
    return await prisma.funcionario.create({
      data: {
        idFuncionario: data.idFuncionario,
        nome: data.nome,
        telefone: data.telefone,
        endereco: data.endereco,
        usuario: data.usuario,
        senhaHash: hash,
        salt,
        nivelPermissao: data.nivelPermissao
      }
    });
  }

  async findAll(): Promise<Funcionario[]> {
    return await prisma.funcionario.findMany({
      include: {
        etapas: {
          include: {
            etapa: true
          }
        }
      }
    });
  }

  async findByUsuario(usuario: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findUnique({
      where: { usuario },
      include: {
        etapas: {
          include: {
            etapa: true
          }
        }
      }
    });
  }

  async findByIdFuncionario(idFuncionario: string): Promise<Funcionario | null> {
    return await prisma.funcionario.findUnique({
      where: { idFuncionario },
      include: {
        etapas: {
          include: {
            etapa: true
          }
        }
      }
    });
  }

  async update(idFuncionario: string, data: Partial<{
    nome: string;
    telefone: string;
    endereco: string;
    usuario: string;
    nivelPermissao: NivelPermissao;
  }>): Promise<Funcionario> {
    return await prisma.funcionario.update({
      where: { idFuncionario },
      data
    });
  }

  async updateSenha(idFuncionario: string, novaSenha: string): Promise<void> {
    const { hash, salt } = this.gerarHash(novaSenha);
    
    await prisma.funcionario.update({
      where: { idFuncionario },
      data: {
        senhaHash: hash,
        salt
      }
    });
  }

  async delete(idFuncionario: string): Promise<void> {
    await prisma.funcionario.delete({
      where: { idFuncionario }
    });
  }

  async autenticar(usuario: string, senha: string): Promise<Funcionario | null> {
    const funcionario = await this.findByUsuario(usuario);
    
    if (!funcionario) {
      return null;
    }

    const isValid = this.verificarSenha(senha, funcionario.senhaHash, funcionario.salt);
    
    return isValid ? funcionario : null;
  }

  private gerarHash(senha: string): { hash: string; salt: string } {
    const salt = randomBytes(16).toString('hex');
    const derived = scryptSync(senha, salt, 64);
    return { hash: derived.toString('hex'), salt };
  }

  private verificarSenha(senha: string, hash: string, salt: string): boolean {
    const derived = scryptSync(senha, salt, 64);
    return derived.toString('hex') === hash;
  }
}