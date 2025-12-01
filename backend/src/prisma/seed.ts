import { PrismaClient } from '@prisma/client';
import { TipoAeronave, NivelPermissao, TipoPeca, StatusPeca, StatusEtapa, TipoTeste, ResultadoTeste } from '@prisma/client';
import { randomBytes, scryptSync } from 'crypto';

const prisma = new PrismaClient();

function gerarHash(senha: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(senha, salt, 64);
  return { hash: derived.toString('hex'), salt };
}

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    const { hash: hashAdmin, salt: saltAdmin } = gerarHash('admin123');
    const { hash: hashEng, salt: saltEng } = gerarHash('eng123');
    const { hash: hashOp, salt: saltOp } = gerarHash('op123');

    const funcionarios = await Promise.all([
      prisma.funcionario.create({
        data: {
          idFuncionario: 'ADMIN001',
          nome: 'Carlos Administrador',
          telefone: '(11) 99999-0001',
          endereco: 'Rua Admin, 100',
          usuario: 'admin',
          senhaHash: hashAdmin,
          salt: saltAdmin,
          nivelPermissao: NivelPermissao.ADMINISTRADOR
        }
      }),
      prisma.funcionario.create({
        data: {
          idFuncionario: 'ENG001',
          nome: 'Maria Engenheira',
          telefone: '(11) 99999-0002',
          endereco: 'Rua Engenheiro, 200',
          usuario: 'maria.eng',
          senhaHash: hashEng,
          salt: saltEng,
          nivelPermissao: NivelPermissao.ENGENHEIRO
        }
      }),
      prisma.funcionario.create({
        data: {
          idFuncionario: 'OP001',
          nome: 'João Operador',
          telefone: '(11) 99999-0003',
          endereco: 'Rua Operador, 300',
          usuario: 'joao.op',
          senhaHash: hashOp,
          salt: saltOp,
          nivelPermissao: NivelPermissao.OPERADOR
        }
      })
    ]);

    console.log('✅ Funcionários criados:', funcionarios.length);

    const pecas = await Promise.all([
      prisma.peca.create({
        data: {
          nome: 'Motor Turbina CFM56',
          tipo: TipoPeca.IMPORTADA,
          fornecedor: 'CFM International',
          status: StatusPeca.PRONTA
        }
      }),
      prisma.peca.create({
        data: {
          nome: 'Asa Principal',
          tipo: TipoPeca.NACIONAL,
          fornecedor: 'Embraer',
          status: StatusPeca.EM_PRODUCAO
        }
      }),
      prisma.peca.create({
        data: {
          nome: 'Sistema Hidráulico',
          tipo: TipoPeca.IMPORTADA,
          fornecedor: 'Parker Aerospace',
          status: StatusPeca.PRONTA
        }
      }),
      prisma.peca.create({
        data: {
          nome: 'Avionics Package',
          tipo: TipoPeca.IMPORTADA,
          fornecedor: 'Honeywell',
          status: StatusPeca.EM_PRODUCAO
        }
      })
    ]);

    console.log('✅ Peças criadas:', pecas.length);

    const etapas = await Promise.all([
      prisma.etapa.create({
        data: {
          nome: 'Montagem da Fuselagem',
          prazo: '30 dias',
          status: StatusEtapa.CONCLUIDA
        }
      }),
      prisma.etapa.create({
        data: {
          nome: 'Instalação dos Motores',
          prazo: '15 dias',
          status: StatusEtapa.ANDAMENTO
        }
      }),
      prisma.etapa.create({
        data: {
          nome: 'Testes de Sistema',
          prazo: '20 dias',
          status: StatusEtapa.PENDENTE
        }
      }),
      prisma.etapa.create({
        data: {
          nome: 'Pintura e Acabamento',
          prazo: '10 dias',
          status: StatusEtapa.PENDENTE
        }
      })
    ]);

    console.log('✅ Etapas criadas:', etapas.length);

    await Promise.all([
      prisma.etapaFuncionario.create({
        data: {
          etapaId: etapas[0].id,
          funcionarioId: funcionarios[1].id 
        }
      }),
      prisma.etapaFuncionario.create({
        data: {
          etapaId: etapas[1].id,
          funcionarioId: funcionarios[1].id 
        }
      }),
      prisma.etapaFuncionario.create({
        data: {
          etapaId: etapas[1].id,
          funcionarioId: funcionarios[2].id
        }
      })
    ]);

    console.log('✅ Associações funcionário-etapa criadas');

    const aeronaves = await Promise.all([
      prisma.aeronave.create({
        data: {
          codigo: 'AER001',
          modelo: 'EMB-190',
          tipo: TipoAeronave.COMERCIAL,
          capacidade: 100,
          alcance: 4500
        }
      }),
      prisma.aeronave.create({
        data: {
          codigo: 'AER002',
          modelo: 'Super Tucano',
          tipo: TipoAeronave.MILITAR,
          capacidade: 2,
          alcance: 1500
        }
      }),
      prisma.aeronave.create({
        data: {
          codigo: 'AER003',
          modelo: 'E-Jet E2',
          tipo: TipoAeronave.COMERCIAL,
          capacidade: 146,
          alcance: 5900
        }
      })
    ]);

    console.log('✅ Aeronaves criadas:', aeronaves.length);

    await Promise.all([
      prisma.aeronavePeca.create({
        data: {
          aeronaveId: aeronaves[0].id,
          pecaId: pecas[0].id 
        }
      }),
      prisma.aeronavePeca.create({
        data: {
          aeronaveId: aeronaves[0].id,
          pecaId: pecas[1].id
        }
      }),
      prisma.aeronavePeca.create({
        data: {
          aeronaveId: aeronaves[1].id,
          pecaId: pecas[2].id
        }
      }),
      prisma.aeronavePeca.create({
        data: {
          aeronaveId: aeronaves[2].id,
          pecaId: pecas[0].id 
        }
      }),
      prisma.aeronavePeca.create({
        data: {
          aeronaveId: aeronaves[2].id,
          pecaId: pecas[3].id
        }
      })
    ]);

    console.log('✅ Associações aeronave-peça criadas');
    await Promise.all([
      prisma.aeronaveEtapa.create({
        data: {
          aeronaveId: aeronaves[0].id,
          etapaId: etapas[0].id 
        }
      }),
      prisma.aeronaveEtapa.create({
        data: {
          aeronaveId: aeronaves[0].id,
          etapaId: etapas[1].id 
        }
      }),
      prisma.aeronaveEtapa.create({
        data: {
          aeronaveId: aeronaves[1].id,
          etapaId: etapas[0].id 
        }
      }),
      prisma.aeronaveEtapa.create({
        data: {
          aeronaveId: aeronaves[2].id,
          etapaId: etapas[2].id 
        }
      })
    ]);

    console.log('✅ Associações aeronave-etapa criadas');

    const testes = await Promise.all([
      prisma.teste.create({
        data: {
          tipo: TipoTeste.ELETRICO,
          resultado: ResultadoTeste.APROVADO,
          aeronaveId: aeronaves[0].id
        }
      }),
      prisma.teste.create({
        data: {
          tipo: TipoTeste.HIDRAULICO,
          resultado: ResultadoTeste.APROVADO,
          aeronaveId: aeronaves[0].id
        }
      }),
      prisma.teste.create({
        data: {
          tipo: TipoTeste.AERODINAMICO,
          resultado: ResultadoTeste.REPROVADO,
          aeronaveId: aeronaves[1].id
        }
      })
    ]);

    console.log('✅ Testes criados:', testes.length);

    const relatorios = await Promise.all([
      prisma.relatorio.create({
        data: {
          cliente: 'AZUL Linhas Aéreas',
          dataEntrega: '15/12/2024',
          arquivo: 'relatorio_AER001.txt',
          conteudo: 'Relatório completo da aeronave AER001 - EMB-190',
          aeronaveId: aeronaves[0].id
        }
      }),
      prisma.relatorio.create({
        data: {
          cliente: 'FAB - Força Aérea Brasileira',
          dataEntrega: '20/01/2025',
          arquivo: 'relatorio_AER002.txt',
          conteudo: 'Relatório completo da aeronave AER002 - Super Tucano',
          aeronaveId: aeronaves[1].id
        }
      })
    ]);

    console.log('✅ Relatórios criados:', relatorios.length);

    console.log('🎉 Seed concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seed;