import { AeronaveRepository } from '../repositories/AeronaveRepository';
import { FuncionarioRepository } from '../repositories/FuncionarioRepository';
import { PecaRepository } from '../repositories/PecaRepository';
import { TipoAeronave, NivelPermissao, TipoPeca } from '@prisma/client';

// Exemplo de uso dos repositories com Prisma

async function exemploUsoAeronaves() {
  const aeronaveRepo = new AeronaveRepository();

  // Criar uma nova aeronave
  const novaAeronave = await aeronaveRepo.create({
    codigo: 'AER001',
    modelo: 'Boeing 737',
    tipo: TipoAeronave.COMERCIAL,
    capacidade: 180,
    alcance: 5000
  });

  console.log('Aeronave criada:', novaAeronave);

  // Buscar todas as aeronaves
  const aeronaves = await aeronaveRepo.findAll();
  console.log('Todas as aeronaves:', aeronaves);

  // Buscar aeronave por código
  const aeronave = await aeronaveRepo.findByCodigo('AER001');
  console.log('Aeronave encontrada:', aeronave);
}

async function exemploUsoFuncionarios() {
  const funcionarioRepo = new FuncionarioRepository();

  // Criar um novo funcionário
  const novoFuncionario = await funcionarioRepo.create({
    idFuncionario: 'FUNC001',
    nome: 'João Silva',
    telefone: '(11) 99999-9999',
    endereco: 'Rua das Flores, 123',
    usuario: 'joao.silva',
    senha: 'senha123',
    nivelPermissao: NivelPermissao.ENGENHEIRO
  });

  console.log('Funcionário criado:', novoFuncionario);

  // Autenticar funcionário
  const funcionarioAutenticado = await funcionarioRepo.autenticar('joao.silva', 'senha123');
  console.log('Funcionário autenticado:', funcionarioAutenticado);
}

async function exemploUsoPecas() {
  const pecaRepo = new PecaRepository();

  // Criar uma nova peça
  const novaPeca = await pecaRepo.create({
    nome: 'Motor Turbina',
    tipo: TipoPeca.IMPORTADA,
    fornecedor: 'Rolls-Royce'
  });

  console.log('Peça criada:', novaPeca);

  // Buscar peças por tipo
  const pecasImportadas = await pecaRepo.findByTipo(TipoPeca.IMPORTADA);
  console.log('Peças importadas:', pecasImportadas);
}

export {
  exemploUsoAeronaves,
  exemploUsoFuncionarios,
  exemploUsoPecas
};