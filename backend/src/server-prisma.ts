import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import { AeronaveRepository } from './repositories/AeronaveRepository';
import { FuncionarioRepository } from './repositories/FuncionarioRepository';
import { PecaRepository } from './repositories/PecaRepository';
import { TipoAeronave, NivelPermissao, TipoPeca, StatusPeca, StatusEtapa, TipoTeste, ResultadoTeste } from '@prisma/client';
import { Relatorio } from './models/Relatorio';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

const aeronaveRepo = new AeronaveRepository();
const funcionarioRepo = new FuncionarioRepository();
const pecaRepo = new PecaRepository();

app.get('/api/aeronaves', async (req, res) => {
    try {
        console.log('📡 [GET] /api/aeronaves - Buscando todas as aeronaves...');
        const aeronaves = await aeronaveRepo.findAll();
        
        const aeronavesMapeadas = aeronaves.map(aeronave => ({
            codigo: aeronave.codigo,
            modelo: aeronave.modelo,
            tipo: aeronave.tipo,
            capacidade: aeronave.capacidade,
            alcance: aeronave.alcance,
            pecas: aeronave.pecas.map(ap => ap.peca.nome),
            etapas: aeronave.etapas.map(ae => ae.etapa.nome),
            testes: aeronave.testes.map(t => ({ tipo: t.tipo, resultado: t.resultado }))
        }));

        res.json(aeronavesMapeadas);
    } catch (error) {
        console.error('❌ Erro ao buscar aeronaves:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves', async (req, res) => {
    try {
        console.log('📡 [POST] /api/aeronaves - Dados recebidos:', req.body);
        const { codigo, modelo, tipo, capacidade, alcance } = req.body;

        if (!codigo || !modelo || !tipo || capacidade === undefined || alcance === undefined) {
            return res.status(400).json({ error: 'Dados obrigatórios não fornecidos' });
        }

        const aeronaveExistente = await aeronaveRepo.findByCodigo(codigo);
        if (aeronaveExistente) {
            return res.status(400).json({ error: 'Aeronave com este código já existe' });
        }

        const novaAeronave = await aeronaveRepo.create({
            codigo,
            modelo,
            tipo: tipo as TipoAeronave,
            capacidade: parseInt(capacidade),
            alcance: parseInt(alcance)
        });

        res.status(201).json({
            codigo: novaAeronave.codigo,
            modelo: novaAeronave.modelo,
            tipo: novaAeronave.tipo,
            capacidade: novaAeronave.capacidade,
            alcance: novaAeronave.alcance,
            pecas: [],
            etapas: [],
            testes: []
        });
    } catch (error) {
        console.error('❌ Erro ao criar aeronave:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/aeronaves/:codigo', async (req, res) => {
    try {
        console.log(`📡 [GET] /api/aeronaves/${req.params.codigo}`);
        const aeronave = await aeronaveRepo.findByCodigo(req.params.codigo);
        
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        res.json(aeronave);
    } catch (error: any) {
        console.error('❌ Erro ao buscar aeronave:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/aeronaves/:codigo', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/aeronaves/${req.params.codigo} - Dados:`, req.body);
        const { codigo } = req.params;
        const { modelo, tipo, capacidade, alcance } = req.body;

        const aeronaveAtualizada = await aeronaveRepo.update(codigo, {
            modelo,
            tipo: tipo as TipoAeronave,
            capacidade: parseInt(capacidade),
            alcance: parseInt(alcance)
        });

        res.json({
            codigo: aeronaveAtualizada.codigo,
            modelo: aeronaveAtualizada.modelo,
            tipo: aeronaveAtualizada.tipo,
            capacidade: aeronaveAtualizada.capacidade,
            alcance: aeronaveAtualizada.alcance
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar aeronave:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/aeronaves/:codigo', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/aeronaves/${req.params.codigo}`);
        await aeronaveRepo.delete(req.params.codigo);
        res.json({ message: 'Aeronave removida com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar aeronave:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/pecas', async (req, res) => {
    try {
        console.log('📡 [GET] /api/pecas - Buscando todas as peças...');
        const pecas = await pecaRepo.findAll();
        
        const pecasMapeadas = pecas.map(peca => ({
            nome: peca.nome,
            tipo: peca.tipo,
            fornecedor: peca.fornecedor,
            status: peca.status
        }));

        res.json(pecasMapeadas);
    } catch (error) {
        console.error('❌ Erro ao buscar peças:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/pecas', async (req, res) => {
    try {
        console.log('📡 [POST] /api/pecas - Dados recebidos:', req.body);
        const { nome, tipo, fornecedor } = req.body;

        const pecaExistente = await pecaRepo.findByNome(nome);
        if (pecaExistente) {
            return res.status(400).json({ error: 'Peça com este nome já existe' });
        }

        const novaPeca = await pecaRepo.create({
            nome,
            tipo: tipo as TipoPeca,
            fornecedor
        });

        res.status(201).json({
            nome: novaPeca.nome,
            tipo: novaPeca.tipo,
            fornecedor: novaPeca.fornecedor,
            status: novaPeca.status
        });
    } catch (error) {
        console.error('❌ Erro ao criar peça:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/pecas/:nome', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/pecas/${req.params.nome} - Dados:`, req.body);
        const { nome } = req.params;
        const { tipo, fornecedor, status } = req.body;

        const pecaAtualizada = await pecaRepo.update(nome, {
            tipo: tipo as TipoPeca,
            fornecedor,
            status: status as StatusPeca
        });

        res.json({
            nome: pecaAtualizada.nome,
            tipo: pecaAtualizada.tipo,
            fornecedor: pecaAtualizada.fornecedor,
            status: pecaAtualizada.status
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar peça:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/pecas/:nome', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/pecas/${req.params.nome}`);
        await pecaRepo.delete(req.params.nome);
        res.json({ message: 'Peça removida com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar peça:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/funcionarios', async (req, res) => {
    try {
        console.log('📡 [GET] /api/funcionarios - Buscando todos os funcionários...');
        const funcionarios = await funcionarioRepo.findAll();
        
        const funcionariosMapeados = funcionarios.map(funcionario => ({
            id: funcionario.idFuncionario,
            nome: funcionario.nome,
            telefone: funcionario.telefone,
            endereco: funcionario.endereco,
            usuario: funcionario.usuario,
            nivelPermissao: funcionario.nivelPermissao
        }));

        res.json(funcionariosMapeados);
    } catch (error) {
        console.error('❌ Erro ao buscar funcionários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/funcionarios', async (req, res) => {
    try {
        console.log('📡 [POST] /api/funcionarios - Dados recebidos:', req.body);
        const { id, nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;

        const funcionarioExistente = await funcionarioRepo.findByIdFuncionario(id);
        if (funcionarioExistente) {
            return res.status(400).json({ error: 'Funcionário com este ID já existe' });
        }

        const usuarioExistente = await funcionarioRepo.findByUsuario(usuario);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Nome de usuário já existe' });
        }

        const novoFuncionario = await funcionarioRepo.create({
            idFuncionario: id,
            nome,
            telefone,
            endereco,
            usuario,
            senha,
            nivelPermissao: nivelPermissao as NivelPermissao
        });

        res.status(201).json({
            id: novoFuncionario.idFuncionario,
            nome: novoFuncionario.nome,
            telefone: novoFuncionario.telefone,
            endereco: novoFuncionario.endereco,
            usuario: novoFuncionario.usuario,
            nivelPermissao: novoFuncionario.nivelPermissao
        });
    } catch (error) {
        console.error('❌ Erro ao criar funcionário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/funcionarios/:id', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/funcionarios/${req.params.id} - Dados:`, req.body);
        const { id } = req.params;
        const { nome, telefone, endereco, usuario, nivelPermissao } = req.body;

        const funcionarioAtualizado = await funcionarioRepo.update(id, {
            nome,
            telefone,
            endereco,
            usuario,
            nivelPermissao: nivelPermissao as NivelPermissao
        });

        res.json({
            id: funcionarioAtualizado.idFuncionario,
            nome: funcionarioAtualizado.nome,
            telefone: funcionarioAtualizado.telefone,
            endereco: funcionarioAtualizado.endereco,
            usuario: funcionarioAtualizado.usuario,
            nivelPermissao: funcionarioAtualizado.nivelPermissao
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar funcionário:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/funcionarios/:id', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/funcionarios/${req.params.id}`);
        await funcionarioRepo.delete(req.params.id);
        res.json({ message: 'Funcionário removido com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar funcionário:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        console.log('📡 [POST] /api/auth/register - Dados recebidos:', req.body);
        const { nome, telefone, endereco, usuario, senha } = req.body;

        console.log('🔍 Debug - Campos:', { nome, telefone, endereco, usuario, senha: senha ? '***' : undefined });

        if (!nome?.trim()) {
            console.log('❌ Erro: Nome vazio ou undefined');
            return res.status(400).json({ error: 'Nome é obrigatório' });
        }
        
        if (!telefone?.trim()) {
            console.log('❌ Erro: Telefone vazio ou undefined');
            return res.status(400).json({ error: 'Telefone é obrigatório' });
        }
        
        if (!endereco?.trim()) {
            console.log('❌ Erro: Endereço vazio ou undefined');
            return res.status(400).json({ error: 'Endereço é obrigatório' });
        }
        
        if (!usuario?.trim()) {
            console.log('❌ Erro: Usuário vazio ou undefined');
            return res.status(400).json({ error: 'Nome de usuário é obrigatório' });
        }
        
        if (!senha?.trim()) {
            console.log('❌ Erro: Senha vazia ou undefined');
            return res.status(400).json({ error: 'Senha é obrigatória' });
        }

        const usuarioExistente = await funcionarioRepo.findByUsuario(usuario);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Nome de usuário já existe' });
        }

        const idGerado = `F${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const novoFuncionario = await funcionarioRepo.create({
            idFuncionario: idGerado,
            nome,
            telefone,
            endereco,
            usuario,
            senha,
            nivelPermissao: 'OPERADOR'
        });

        res.status(201).json({
            id: novoFuncionario.idFuncionario,
            nome: novoFuncionario.nome,
            telefone: novoFuncionario.telefone,
            endereco: novoFuncionario.endereco,
            usuario: novoFuncionario.usuario,
            nivelPermissao: novoFuncionario.nivelPermissao,
            message: 'Usuário registrado com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro no registro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('📡 [POST] /api/auth/login - Tentativa de login:', req.body.usuario);
        const { usuario, senha } = req.body;

        const funcionarioAutenticado = await funcionarioRepo.autenticar(usuario, senha);
        
        if (!funcionarioAutenticado) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        res.json({
            token: `jwt_${funcionarioAutenticado.idFuncionario}_${Date.now()}`,
            usuario: {
                id: funcionarioAutenticado.idFuncionario,
                nome: funcionarioAutenticado.nome,
                nivelPermissao: funcionarioAutenticado.nivelPermissao
            },
            message: 'Login realizado com sucesso'
        });
    } catch (error) {
        console.error('❌ Erro na autenticação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }
        
        const tokenParts = token.split('_');
        if (tokenParts.length < 3 || tokenParts[0] !== 'jwt') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        
        const userId = tokenParts[1];
        const funcionario = await funcionarioRepo.findByIdFuncionario(userId);
        
        if (!funcionario) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        
        res.json({
            id: funcionario.idFuncionario,
            nome: funcionario.nome,
            nivelPermissao: funcionario.nivelPermissao
        });
    } catch (error) {
        console.error('❌ Erro ao obter usuário atual:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/auth/logout', async (req, res) => {
    try {
        res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
        console.error('❌ Erro no logout:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/etapas', async (req, res) => {
    try {
        console.log('📡 [GET] /api/etapas - Buscando todas as etapas...');
        const etapas = await prisma.etapa.findMany({
            include: {
                funcionarios: {
                    include: {
                        funcionario: true
                    }
                },
                aeronaves: {
                    include: {
                        aeronave: true
                    }
                }
            }
        });
        
        const etapasMapeadas = etapas.map(etapa => ({
            id: etapa.id,
            nome: etapa.nome,
            prazo: etapa.prazo,
            status: etapa.status,
            funcionarios: etapa.funcionarios.map(ef => ef.funcionario.nome),
            aeronaves: etapa.aeronaves.map(ae => ae.aeronave.codigo)
        }));

        res.json(etapasMapeadas);
    } catch (error) {
        console.error('❌ Erro ao buscar etapas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/etapas', async (req, res) => {
    try {
        console.log('📡 [POST] /api/etapas - Dados recebidos:', req.body);
        const { nome, prazo, status } = req.body;

        if (!nome || !prazo) {
            return res.status(400).json({ error: 'Nome e prazo são obrigatórios' });
        }

        const etapaExistente = await prisma.etapa.findFirst({
            where: { nome }
        });
        if (etapaExistente) {
            return res.status(400).json({ error: 'Etapa com este nome já existe' });
        }

        const novaEtapa = await prisma.etapa.create({
            data: {
                nome,
                prazo,
                status: status || 'PENDENTE'
            }
        });

        res.status(201).json({
            id: novaEtapa.id,
            nome: novaEtapa.nome,
            prazo: novaEtapa.prazo,
            status: novaEtapa.status,
            funcionarios: [],
            aeronaves: []
        });
    } catch (error) {
        console.error('❌ Erro ao criar etapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/etapas/:nome', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/etapas/${req.params.nome} - Dados:`, req.body);
        const { nome } = req.params;
        const { novoNome, prazo, status } = req.body;

        const etapaAtual = await prisma.etapa.findFirst({ where: { nome } });
        if (!etapaAtual) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        const etapaAtualizada = await prisma.etapa.update({
            where: { id: etapaAtual.id },
            data: {
                nome: novoNome || nome,
                prazo,
                status: status as StatusEtapa
            },
            include: {
                funcionarios: {
                    include: {
                        funcionario: true
                    }
                },
                aeronaves: {
                    include: {
                        aeronave: true
                    }
                }
            }
        });

        res.json({
            id: etapaAtualizada.id,
            nome: etapaAtualizada.nome,
            prazo: etapaAtualizada.prazo,
            status: etapaAtualizada.status,
            funcionarios: etapaAtualizada.funcionarios.map(ef => ef.funcionario.nome),
            aeronaves: etapaAtualizada.aeronaves.map(ae => ae.aeronave.codigo)
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar etapa:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/etapas/:nome', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/etapas/${req.params.nome}`);
        const { nome } = req.params;

        const etapa = await prisma.etapa.findFirst({ where: { nome } });
        if (!etapa) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        await prisma.etapa.delete({ where: { id: etapa.id } });
        res.json({ message: 'Etapa removida com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar etapa:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


app.get('/api/relatorios', async (req, res) => {
    try {
        console.log('📡 [GET] /api/relatorios - Buscando todos os relatórios...');
        const relatorios = await prisma.relatorio.findMany({
            include: {
                aeronave: true
            }
        });
        
        const relatoriosMapeados = relatorios.map(relatorio => ({
            id: relatorio.id,
            aeronaveCodigo: relatorio.aeronave.codigo,
            aeronaveModelo: relatorio.aeronave.modelo,
            tipo: relatorio.aeronave.tipo,
            capacidade: relatorio.aeronave.capacidade,
            alcance: relatorio.aeronave.alcance,
            cliente: relatorio.cliente,
            dataEntrega: relatorio.dataEntrega,
            arquivo: relatorio.arquivo,
            message: relatorio.conteudo
        }));

        res.json(relatoriosMapeados);
    } catch (error) {
        console.error('❌ Erro ao buscar relatórios:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/relatorios', async (req, res) => {
    try {
        console.log('📡 [POST] /api/relatorios - Dados recebidos:', req.body);
        const { cliente, dataEntrega, aeronaveId, arquivo, conteudo } = req.body;

        if (!cliente || !dataEntrega || !aeronaveId) {
            return res.status(400).json({ error: 'Cliente, data de entrega e aeronave são obrigatórios' });
        }

        // Verificar se a aeronave existe
        const aeronave = await prisma.aeronave.findUnique({
            where: { codigo: aeronaveId }
        });
        if (!aeronave) {
            return res.status(400).json({ error: 'Aeronave não encontrada' });
        }

        const novoRelatorio = await prisma.relatorio.create({
            data: {
                cliente,
                dataEntrega,
                arquivo: arquivo || `relatorio_${aeronaveId}_${Date.now()}.pdf`,
                conteudo: conteudo || `Relatório para ${cliente} - Aeronave ${aeronaveId}`,
                aeronaveId: aeronave.id
            },
            include: {
                aeronave: true
            }
        });

        res.status(201).json({
            id: novoRelatorio.id,
            cliente: novoRelatorio.cliente,
            dataEntrega: novoRelatorio.dataEntrega,
            arquivo: novoRelatorio.arquivo,
            conteudo: novoRelatorio.conteudo,
            aeronave: novoRelatorio.aeronave.codigo
        });
    } catch (error) {
        console.error('❌ Erro ao criar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/relatorios/:id', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/relatorios/${req.params.id} - Dados:`, req.body);
        const { id } = req.params;
        const { cliente, dataEntrega, arquivo, conteudo, aeronaveId } = req.body;

        let updateData: any = {
            cliente,
            dataEntrega,
            arquivo,
            conteudo
        };

        if (aeronaveId) {
            const aeronave = await prisma.aeronave.findUnique({
                where: { codigo: aeronaveId }
            });
            if (!aeronave) {
                return res.status(400).json({ error: 'Aeronave não encontrada' });
            }
            updateData.aeronaveId = aeronave.id;
        }

        const relatorioAtualizado = await prisma.relatorio.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                aeronave: true
            }
        });

        res.json({
            id: relatorioAtualizado.id,
            cliente: relatorioAtualizado.cliente,
            dataEntrega: relatorioAtualizado.dataEntrega,
            arquivo: relatorioAtualizado.arquivo,
            conteudo: relatorioAtualizado.conteudo,
            aeronave: relatorioAtualizado.aeronave.codigo
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar relatório:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/relatorios/:id', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/relatorios/${req.params.id}`);
        await prisma.relatorio.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Relatório removido com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar relatório:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/testes', async (req, res) => {
    try {
        console.log('📡 [GET] /api/testes - Buscando todos os testes...');
        const testes = await prisma.teste.findMany({
            include: {
                aeronave: true
            }
        });
        
        const testesMapeados = testes.map(teste => ({
            id: teste.id,
            tipo: teste.tipo,
            resultado: teste.resultado,
            aeronave: teste.aeronave.codigo
        }));

        res.json(testesMapeados);
    } catch (error) {
        console.error('❌ Erro ao buscar testes:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/testes', async (req, res) => {
    try {
        console.log('📡 [POST] /api/testes - Dados recebidos:', req.body);
        const { tipo, resultado, aeronaveId } = req.body;

        if (!tipo || !resultado || !aeronaveId) {
            return res.status(400).json({ error: 'Tipo, resultado e aeronave são obrigatórios' });
        }

        const tiposValidos = ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO'];
        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({ 
                error: `Tipo de teste inválido. Valores aceitos: ${tiposValidos.join(', ')}` 
            });
        }

        // Validação de enum ResultadoTeste
        const resultadosValidos = ['APROVADO', 'REPROVADO'];
        if (!resultadosValidos.includes(resultado)) {
            return res.status(400).json({ 
                error: `Resultado de teste inválido. Valores aceitos: ${resultadosValidos.join(', ')}` 
            });
        }

        // Verificar se a aeronave existe
        const aeronave = await prisma.aeronave.findUnique({
            where: { codigo: aeronaveId }
        });
        if (!aeronave) {
            return res.status(400).json({ error: 'Aeronave não encontrada' });
        }

        const novoTeste = await prisma.teste.create({
            data: {
                tipo: tipo as TipoTeste,
                resultado: resultado as ResultadoTeste,
                aeronaveId: aeronave.id
            },
            include: {
                aeronave: true
            }
        });

        res.status(201).json({
            id: novoTeste.id,
            tipo: novoTeste.tipo,
            resultado: novoTeste.resultado,
            aeronave: novoTeste.aeronave.codigo
        });
    } catch (error) {
        console.error('❌ Erro ao criar teste:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/testes/:id', async (req, res) => {
    try {
        console.log(`📡 [PUT] /api/testes/${req.params.id} - Dados:`, req.body);
        const { id } = req.params;
        const { tipo, resultado, aeronaveId } = req.body;

        if (tipo) {
            const tiposValidos = ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO'];
            if (!tiposValidos.includes(tipo)) {
                return res.status(400).json({ 
                    error: `Tipo de teste inválido. Valores aceitos: ${tiposValidos.join(', ')}` 
                });
            }
        }

        if (resultado) {
            const resultadosValidos = ['APROVADO', 'REPROVADO'];
            if (!resultadosValidos.includes(resultado)) {
                return res.status(400).json({ 
                    error: `Resultado de teste inválido. Valores aceitos: ${resultadosValidos.join(', ')}` 
                });
            }
        }

        let updateData: any = {
            tipo: tipo as TipoTeste,
            resultado: resultado as ResultadoTeste
        };

        if (aeronaveId) {
            const aeronave = await prisma.aeronave.findUnique({
                where: { codigo: aeronaveId }
            });
            if (!aeronave) {
                return res.status(400).json({ error: 'Aeronave não encontrada' });
            }
            updateData.aeronaveId = aeronave.id;
        }

        const testeAtualizado = await prisma.teste.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                aeronave: true
            }
        });

        res.json({
            id: testeAtualizado.id,
            tipo: testeAtualizado.tipo,
            resultado: testeAtualizado.resultado,
            aeronave: testeAtualizado.aeronave.codigo
        });
    } catch (error: any) {
        console.error('❌ Erro ao atualizar teste:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Teste não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/testes/:id', async (req, res) => {
    try {
        console.log(`📡 [DELETE] /api/testes/${req.params.id}`);
        await prisma.teste.delete({ where: { id: parseInt(req.params.id) } });
        res.json({ message: 'Teste removido com sucesso' });
    } catch (error: any) {
        console.error('❌ Erro ao deletar teste:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Teste não encontrado' });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:aeronaveId/pecas/:pecaId', async (req, res) => {
    try {
        console.log(`📡 [POST] Associando peça ${req.params.pecaId} à aeronave ${req.params.aeronaveId}`);
        
        const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.aeronaveId } });
        const peca = await prisma.peca.findUnique({ where: { nome: req.params.pecaId } });
        
        if (!aeronave || !peca) {
            return res.status(404).json({ error: 'Aeronave ou peça não encontrada' });
        }
        
        const associacao = await prisma.aeronavePeca.create({
            data: {
                aeronaveId: aeronave.id,
                pecaId: peca.id
            }
        });
        
        res.status(201).json({ message: 'Peça associada com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Peça já está associada a esta aeronave' });
        }
        console.error('❌ Erro ao associar peça:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:aeronaveId/etapas/:etapaId', async (req, res) => {
    try {
        console.log(`📡 [POST] Associando etapa ${req.params.etapaId} à aeronave ${req.params.aeronaveId}`);
        
        const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.aeronaveId } });
        const etapa = await prisma.etapa.findFirst({ where: { nome: req.params.etapaId } });
        
        if (!aeronave || !etapa) {
            return res.status(404).json({ error: 'Aeronave ou etapa não encontrada' });
        }
        
        const associacao = await prisma.aeronaveEtapa.create({
            data: {
                aeronaveId: aeronave.id,
                etapaId: etapa.id
            }
        });
        
        res.status(201).json({ message: 'Etapa associada com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Etapa já está associada a esta aeronave' });
        }
        console.error('❌ Erro ao associar etapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:codigo/testes', async (req, res) => {
    try {
        console.log(`📡 [POST] Associando teste à aeronave ${req.params.codigo} - Dados:`, req.body);
        const { tipoTeste, resultado } = req.body;
        
        if (!tipoTeste || !resultado) {
            return res.status(400).json({ error: 'Tipo de teste e resultado são obrigatórios' });
        }
        
        const tiposValidos = ['ELETRICO', 'HIDRAULICO', 'AERODINAMICO'];
        if (!tiposValidos.includes(tipoTeste)) {
            return res.status(400).json({ 
                error: `Tipo de teste inválido. Valores aceitos: ${tiposValidos.join(', ')}` 
            });
        }

        // Validação de enum ResultadoTeste
        const resultadosValidos = ['APROVADO', 'REPROVADO'];
        if (!resultadosValidos.includes(resultado)) {
            return res.status(400).json({ 
                error: `Resultado de teste inválido. Valores aceitos: ${resultadosValidos.join(', ')}` 
            });
        }
        
        const aeronave = await prisma.aeronave.findUnique({ 
            where: { codigo: req.params.codigo },
            include: {
                pecas: { include: { peca: true } },
                etapas: { include: { etapa: true } },
                testes: true
            }
        });
        
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        
        const novoTeste = await prisma.teste.create({
            data: {
                tipo: tipoTeste,
                resultado: resultado,
                aeronaveId: aeronave.id
            }
        });
        
        const aeronaveAtualizada = await prisma.aeronave.findUnique({ 
            where: { codigo: req.params.codigo },
            include: {
                pecas: { include: { peca: true } },
                etapas: { include: { etapa: true } },
                testes: true
            }
        });
        
        const aeronaveFormatada = {
            codigo: aeronaveAtualizada!.codigo,
            modelo: aeronaveAtualizada!.modelo,
            tipo: aeronaveAtualizada!.tipo,
            capacidade: aeronaveAtualizada!.capacidade,
            alcance: aeronaveAtualizada!.alcance,
            pecas: aeronaveAtualizada!.pecas.map(ap => ap.peca),
            etapas: aeronaveAtualizada!.etapas.map(ae => ae.etapa),
            testes: aeronaveAtualizada!.testes
        };
        
        console.log(`✅ Teste ${tipoTeste} associado à aeronave ${req.params.codigo} com sucesso`);
        res.status(201).json(aeronaveFormatada);
    } catch (error: any) {
        console.error('❌ Erro ao associar teste:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/etapas/:etapaId/funcionarios/:funcionarioId', async (req, res) => {
    try {
        console.log(`📡 [POST] Associando funcionário ${req.params.funcionarioId} à etapa ${req.params.etapaId}`);
        
        const etapa = await prisma.etapa.findFirst({ where: { nome: req.params.etapaId } });
        const funcionario = await prisma.funcionario.findUnique({ where: { idFuncionario: req.params.funcionarioId } });
        
        if (!etapa || !funcionario) {
            return res.status(404).json({ error: 'Etapa ou funcionário não encontrado' });
        }
        
        const associacao = await prisma.etapaFuncionario.create({
            data: {
                etapaId: etapa.id,
                funcionarioId: funcionario.id
            }
        });
        
        res.status(201).json({ message: 'Funcionário associado com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Funcionário já está associado a esta etapa' });
        }
        console.error('❌ Erro ao associar funcionário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/aeronaves/:aeronaveId/pecas/:pecaId', async (req, res) => {
    try {
        console.log(`📡 [DELETE] Desassociando peça ${req.params.pecaId} da aeronave ${req.params.aeronaveId}`);
        const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.aeronaveId } });
        const peca = await prisma.peca.findUnique({ where: { nome: req.params.pecaId } });
        
        if (!aeronave || !peca) {
            return res.status(404).json({ error: 'Aeronave ou peça não encontrada' });
        }
        
        await prisma.aeronavePeca.delete({
            where: {
                aeronaveId_pecaId: {
                    aeronaveId: aeronave.id,
                    pecaId: peca.id
                }
            }
        });
        
        res.json({ message: 'Associação removida com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Associação não encontrada' });
        }
        console.error('❌ Erro ao remover associação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/aeronaves/:aeronaveId/etapas/:etapaId', async (req, res) => {
    try {
        console.log(`📡 [DELETE] Desassociando etapa ${req.params.etapaId} da aeronave ${req.params.aeronaveId}`);
        const aeronave = await prisma.aeronave.findUnique({ where: { codigo: req.params.aeronaveId } });
        const etapa = await prisma.etapa.findFirst({ where: { nome: req.params.etapaId } });
        
        if (!aeronave || !etapa) {
            return res.status(404).json({ error: 'Aeronave ou etapa não encontrada' });
        }
        
        await prisma.aeronaveEtapa.delete({
            where: {
                aeronaveId_etapaId: {
                    aeronaveId: aeronave.id,
                    etapaId: etapa.id
                }
            }
        });
        
        res.json({ message: 'Associação removida com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Associação não encontrada' });
        }
        console.error('❌ Erro ao remover associação etapa-aeronave:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/etapas/:etapaId/funcionarios/:funcionarioId', async (req, res) => {
    try {
        console.log(`📡 [DELETE] Desassociando funcionário ${req.params.funcionarioId} da etapa ${req.params.etapaId}`);
        const etapa = await prisma.etapa.findFirst({ where: { nome: req.params.etapaId } });
        const funcionario = await prisma.funcionario.findUnique({ where: { idFuncionario: req.params.funcionarioId } });
        
        if (!etapa || !funcionario) {
            return res.status(404).json({ error: 'Etapa ou funcionário não encontrado' });
        }
        
        await prisma.etapaFuncionario.delete({
            where: {
                etapaId_funcionarioId: {
                    etapaId: etapa.id,
                    funcionarioId: funcionario.id
                }
            }
        });
        
        res.json({ message: 'Associação removida com sucesso' });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Associação não encontrada' });
        }
        console.error('❌ Erro ao remover associação funcionário-etapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/aeronaves/:aeronaveId/pecas', async (req, res) => {
    try {
        console.log(`📡 [GET] Listando peças da aeronave ${req.params.aeronaveId}`);
        const aeronave = await prisma.aeronave.findUnique({
            where: { codigo: req.params.aeronaveId },
            include: {
                pecas: {
                    include: {
                        peca: true
                    }
                }
            }
        });
        
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        
        const pecas = aeronave.pecas.map(ap => ({
            nome: ap.peca.nome,
            tipo: ap.peca.tipo,
            fornecedor: ap.peca.fornecedor,
            status: ap.peca.status,
            associadoEm: ap.createdAt
        }));
        
        res.json({ aeronave: aeronave.codigo, pecas });
    } catch (error) {
        console.error('❌ Erro ao listar peças da aeronave:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/aeronaves/:aeronaveId/etapas', async (req, res) => {
    try {
        console.log(`📡 [GET] Listando etapas da aeronave ${req.params.aeronaveId}`);
        const aeronave = await prisma.aeronave.findUnique({
            where: { codigo: req.params.aeronaveId },
            include: {
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
                }
            }
        });
        
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        
        const etapas = aeronave.etapas.map(ae => ({
            nome: ae.etapa.nome,
            prazo: ae.etapa.prazo,
            status: ae.etapa.status,
            funcionarios: ae.etapa.funcionarios.map(ef => ({
                id: ef.funcionario.idFuncionario,
                nome: ef.funcionario.nome,
                nivelPermissao: ef.funcionario.nivelPermissao
            })),
            associadoEm: ae.createdAt
        }));
        
        res.json({ aeronave: aeronave.codigo, etapas });
    } catch (error) {
        console.error('❌ Erro ao listar etapas da aeronave:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/etapas/:etapaId/funcionarios', async (req, res) => {
    try {
        console.log(`📡 [GET] Listando funcionários da etapa ${req.params.etapaId}`);
        const etapa = await prisma.etapa.findFirst({
            where: { nome: req.params.etapaId },
            include: {
                funcionarios: {
                    include: {
                        funcionario: true
                    }
                }
            }
        });
        
        if (!etapa) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }
        
        const funcionarios = etapa.funcionarios.map(ef => ({
            id: ef.funcionario.idFuncionario,
            nome: ef.funcionario.nome,
            telefone: ef.funcionario.telefone,
            endereco: ef.funcionario.endereco,
            nivelPermissao: ef.funcionario.nivelPermissao,
            associadoEm: ef.createdAt
        }));
        
        res.json({ etapa: etapa.nome, funcionarios });
    } catch (error) {
        console.error('❌ Erro ao listar funcionários da etapa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/pecas/:pecaId/aeronaves', async (req, res) => {
    try {
        console.log(`📡 [GET] Listando aeronaves que usam a peça ${req.params.pecaId}`);
        const peca = await prisma.peca.findUnique({
            where: { nome: req.params.pecaId },
            include: {
                aeronaves: {
                    include: {
                        aeronave: true
                    }
                }
            }
        });
        
        if (!peca) {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }
        
        const aeronaves = peca.aeronaves.map(pa => ({
            codigo: pa.aeronave.codigo,
            modelo: pa.aeronave.modelo,
            tipo: pa.aeronave.tipo,
            capacidade: pa.aeronave.capacidade,
            alcance: pa.aeronave.alcance,
            associadoEm: pa.createdAt
        }));
        
        res.json({ peca: peca.nome, aeronaves });
    } catch (error) {
        console.error('❌ Erro ao listar aeronaves da peça:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/health', (req, res) => {
    console.log('✅ [HEALTH] Requisição recebida');
    try {
        const response = { status: 'OK', message: 'Servidor rodando com Prisma' };
        console.log('✅ [HEALTH] Enviando resposta:', response);
        res.json(response);
        console.log('✅ [HEALTH] Resposta enviada com sucesso');
    } catch (error) {
        console.error('❌ [HEALTH] Erro:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
});

app.post('/api/aeronaves/:codigo/relatorio', async (req, res) => {
    try {
        console.log(`📡 [POST] Gerando relatório para aeronave ${req.params.codigo} - Dados:`, req.body);
        const { cliente, dataEntrega } = req.body;
        const { codigo } = req.params;
        
        // Validação
        if (!cliente || !dataEntrega) {
            return res.status(400).json({ error: 'Cliente e data de entrega são obrigatórios' });
        }
        
        // Buscar aeronave completa com todas as associações
        const aeronaveDb = await prisma.aeronave.findUnique({
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
                testes: true
            }
        });
        
        if (!aeronaveDb) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }
        
        // Mapear dados para o formato esperado pela classe Relatorio
        const aeronaveFormatada = {
            codigo: aeronaveDb.codigo,
            modelo: aeronaveDb.modelo,
            tipo: aeronaveDb.tipo,
            capacidade: aeronaveDb.capacidade,
            alcance: aeronaveDb.alcance,
            pecas: aeronaveDb.pecas.map(ap => ({
                nome: ap.peca.nome,
                fornecedor: ap.peca.fornecedor,
                tipo: ap.peca.tipo
            })),
            etapas: aeronaveDb.etapas.map(ae => ({
                nome: ae.etapa.nome,
                prazo: ae.etapa.prazo,
                status: ae.etapa.status,
                funcionarios: ae.etapa.funcionarios.map(ef => ({
                    id: ef.funcionario.idFuncionario,
                    nome: ef.funcionario.nome,
                    nivelPermissao: ef.funcionario.nivelPermissao
                }))
            })),
            testes: aeronaveDb.testes.map(t => ({
                tipo: t.tipo,
                resultado: t.resultado
            }))
        };
        
        // Gerar conteúdo do relatório usando a classe existente
        const relatorio = new Relatorio();
        const conteudoRelatorio = relatorio.gerar(aeronaveFormatada as any, cliente, dataEntrega);
        
        // Salvar no banco de dados
        const relatorioSalvo = await prisma.relatorio.create({
            data: {
                cliente,
                dataEntrega,
                arquivo: `relatorio_${codigo}_${Date.now()}.txt`,
                conteudo: conteudoRelatorio,
                aeronaveId: aeronaveDb.id
            },
            include: {
                aeronave: true
            }
        });
        
        console.log(`✅ Relatório gerado com sucesso para aeronave ${codigo}`);
        
        // Retornar o relatório para download
        res.status(201).json({
            id: relatorioSalvo.id,
            cliente: relatorioSalvo.cliente,
            dataEntrega: relatorioSalvo.dataEntrega,
            arquivo: relatorioSalvo.arquivo,
            conteudo: relatorioSalvo.conteudo,
            aeronave: relatorioSalvo.aeronave.codigo
        });
        
    } catch (error) {
        console.error('❌ Erro ao gerar relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/relatorios/:id/download', async (req, res) => {
    try {
        console.log(`📡 [GET] Download do relatório ${req.params.id}`);
        
        const relatorio = await prisma.relatorio.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { aeronave: true }
        });
        
        if (!relatorio) {
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }
        
        // Configurar headers para download
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${relatorio.arquivo}"`);
        res.setHeader('Content-Length', Buffer.byteLength(relatorio.conteudo, 'utf8'));
        
        // Enviar conteúdo do relatório
        res.send(relatorio.conteudo);
        
        console.log(`✅ Download do relatório ${req.params.id} realizado com sucesso`);
        
    } catch (error) {
        console.error('❌ Erro no download do relatório:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.listen(PORT, () => {
    console.log('🚀 ===== SERVIDOR INICIADO =====');
    console.log(`🌐 Servidor rodando na porta ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log('💾 Usando Prisma ORM com MySQL');
    console.log('===================================');
});