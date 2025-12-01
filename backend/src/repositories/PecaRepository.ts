import { PrismaClient, Peca, TipoPeca, StatusPeca } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class PecaRepository {
  
  async create(data: {
    nome: string;
    tipo: TipoPeca;
    fornecedor: string;
    status?: StatusPeca;
  }): Promise<Peca> {
    return await prisma.peca.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
        fornecedor: data.fornecedor,
        status: data.status || StatusPeca.EM_PRODUCAO
      }
    });
  }

  async findAll(): Promise<Peca[]> {
    return await prisma.peca.findMany({
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }

  async findByNome(nome: string): Promise<Peca | null> {
    return await prisma.peca.findUnique({
      where: { nome },
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }

  async findById(id: number): Promise<Peca | null> {
    return await prisma.peca.findUnique({
      where: { id },
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }

  async update(nome: string, data: Partial<{
    tipo: TipoPeca;
    fornecedor: string;
    status: StatusPeca;
  }>): Promise<Peca> {
    return await prisma.peca.update({
      where: { nome },
      data
    });
  }

  async updateStatus(nome: string, novoStatus: StatusPeca): Promise<Peca> {
    return await prisma.peca.update({
      where: { nome },
      data: { status: novoStatus }
    });
  }

  async delete(nome: string): Promise<void> {
    await prisma.peca.delete({
      where: { nome }
    });
  }

  async findByStatus(status: StatusPeca): Promise<Peca[]> {
    return await prisma.peca.findMany({
      where: { status },
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }

  async findByTipo(tipo: TipoPeca): Promise<Peca[]> {
    return await prisma.peca.findMany({
      where: { tipo },
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }

  async findByFornecedor(fornecedor: string): Promise<Peca[]> {
    return await prisma.peca.findMany({
      where: { fornecedor },
      include: {
        aeronaves: {
          include: {
            aeronave: true
          }
        }
      }
    });
  }
}