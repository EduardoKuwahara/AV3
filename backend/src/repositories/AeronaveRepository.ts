import { PrismaClient, Aeronave, TipoAeronave, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

// Tipo para aeronave com todos os relacionamentos
type AeronaveCompleta = Prisma.AeronaveGetPayload<{
  include: {
    pecas: {
      include: {
        peca: true
      }
    },
    etapas: {
      include: {
        etapa: true
      }
    },
    testes: true,
    relatorios: true
  }
}>;

export class AeronaveRepository {
  
  async create(data: {
    codigo: string;
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
  }): Promise<Aeronave> {
    return await prisma.aeronave.create({
      data
    });
  }

  async findAll(): Promise<AeronaveCompleta[]> {
    return await prisma.aeronave.findMany({
      include: {
        pecas: {
          include: {
            peca: true
          }
        },
        etapas: {
          include: {
            etapa: true
          }
        },
        testes: true,
        relatorios: true
      }
    });
  }

  async findByCodigo(codigo: string): Promise<AeronaveCompleta | null> {
    return await prisma.aeronave.findUnique({
      where: { codigo },
      include: {
        pecas: {
          include: {
            peca: true
          }
        },
        etapas: {
          include: {
            etapa: {
              include: {
                funcionarios: {
                  include: {
                    funcionario: true
                  }
                }
              }
            }
          }
        },
        testes: true,
        relatorios: true
      }
    });
  }

  async update(codigo: string, data: Partial<{
    modelo: string;
    tipo: TipoAeronave;
    capacidade: number;
    alcance: number;
  }>): Promise<Aeronave> {
    return await prisma.aeronave.update({
      where: { codigo },
      data
    });
  }

  async delete(codigo: string): Promise<void> {
    await prisma.aeronave.delete({
      where: { codigo }
    });
  }

  async associarPeca(codigoAeronave: string, pecaId: number): Promise<void> {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    await prisma.aeronavePeca.create({
      data: {
        aeronaveId: aeronave.id,
        pecaId
      }
    });
  }

  async associarEtapa(codigoAeronave: string, etapaId: number): Promise<void> {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    await prisma.aeronaveEtapa.create({
      data: {
        aeronaveId: aeronave.id,
        etapaId
      }
    });
  }

  async desassociarPeca(codigoAeronave: string, pecaId: number): Promise<void> {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    await prisma.aeronavePeca.delete({
      where: {
        aeronaveId_pecaId: {
          aeronaveId: aeronave.id,
          pecaId
        }
      }
    });
  }

  async desassociarEtapa(codigoAeronave: string, etapaId: number): Promise<void> {
    const aeronave = await prisma.aeronave.findUnique({
      where: { codigo: codigoAeronave }
    });

    if (!aeronave) {
      throw new Error('Aeronave não encontrada');
    }

    await prisma.aeronaveEtapa.delete({
      where: {
        aeronaveId_etapaId: {
          aeronaveId: aeronave.id,
          etapaId
        }
      }
    });
  }
}