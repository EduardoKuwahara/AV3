import express from 'express';
import cors from 'cors';
import { Aeronave } from './models/Aeronave';
import { TipoAeronave } from './enums/TipoAeronave';
import { Peca } from './models/Peca';
import { TipoPeca } from './enums/TipoPeca';
import { StatusPeca } from './enums/StatusPeca';
import { Etapa } from './models/Etapa';
import { StatusEtapa } from './enums/StatusEtapa';
import { Funcionario } from './models/Funcionario';
import { NivelPermissao } from './enums/NivelPermissao';
import { Teste } from './models/Teste';
import { TipoTeste } from './enums/TipoTeste';
import { ResultadoTeste } from './enums/ResultadoTeste';
import { Persistencia } from './models/Persistencia';
import { Relatorio } from './models/Relatorio';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});

const PATH_AERONAVES = 'registros/aeronaves.json';
const PATH_PECAS = 'registros/pecas.json';
const PATH_ETAPAS = 'registros/etapas.json';
const PATH_FUNCIONARIOS = 'registros/funcionarios.json';
const PATH_TESTES = 'registros/testes.json';

function normEnumString(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value.toString().trim().toUpperCase();
}

let aeronaves: Aeronave[] = [];
let pecas: Peca[] = [];
let etapas: Etapa[] = [];
let funcionarios: Funcionario[] = [];
let testes: Teste[] = [];

function carregarDados() {
    const pecasRaw = Persistencia.carregarJSON<any>(PATH_PECAS) || [];
    pecas = pecasRaw.map((p: any) => {
        if (p.tipo) { const t = normEnumString(p.tipo); if (t && t !== p.tipo) { p.tipo = t; } }
        if (p.status) { const s = normEnumString(p.status); if (s && s !== p.status) { p.status = s; } }
        const obj = new Peca(p.nome, p.tipo, p.fornecedor);
        if (p.status) obj.status = p.status;
        return obj;
    });

    const funcionariosRaw = Persistencia.carregarJSON<any>(PATH_FUNCIONARIOS) || [];
    funcionarios = funcionariosRaw.map((f: any) => {
        if (f.nivelPermissao) {
            const np = normEnumString(f.nivelPermissao);
            if (np && np !== f.nivelPermissao) { f.nivelPermissao = np; }
        }
        return new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senhaHash || '', f.salt || '', f.nivelPermissao);
    });

    const testesRaw = Persistencia.carregarJSON<any>(PATH_TESTES) || [];
    testes = testesRaw.map((t: any) => {
        if (t.tipo) { const tt = normEnumString(t.tipo); if (tt && tt !== t.tipo) { t.tipo = tt; } }
        if (t.resultado) { const rr = normEnumString(t.resultado); if (rr && rr !== t.resultado) { t.resultado = rr; } }
        const ttObj = new Teste(t.tipo);
        if (t.resultado) ttObj.executarTeste(t.resultado === 'APROVADO');
        return ttObj;
    });

    const etapasRaw = Persistencia.carregarJSON<any>(PATH_ETAPAS) || [];
    etapas = etapasRaw.map((e: any) => {
        if (e.status) { const st = normEnumString(e.status); if (st && st !== e.status) { e.status = st; } }
        const ep = new Etapa(e.nome, e.prazo);
        ep.status = e.status || StatusEtapa.PENDENTE;
        
        ep.funcionarios = (e.funcionarios || []).map((f: any) => {
            const found = funcionarios.find(ff => ff.id === f.id);
            if (found) return found;
            const nf = new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senhaHash || '', f.salt || '', f.nivelPermissao);
            funcionarios.push(nf);
            return nf;
        });
        return ep;
    });

    const aeronavesRaw = Persistencia.carregarJSON<any>(PATH_AERONAVES) || [];
    aeronaves = aeronavesRaw.map((a: any) => {
        if (a.tipo) { const tt = normEnumString(a.tipo); if (tt && tt !== a.tipo) { a.tipo = tt; } }
        const at = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade || 0, a.alcance || 0);

        at.pecas = (a.pecas || []).map((p: any) => {
            const found = pecas.find(pp => pp.nome === p.nome);
            if (found) return found;
            const np = new Peca(p.nome, p.tipo, p.fornecedor);
            if (p.status) np.status = p.status;
            pecas.push(np);
            return np;
        });

        at.etapas = (a.etapas || []).map((e: any) => {
            const found = etapas.find(ep => ep.nome === e.nome);
            if (found) return found;
            const ne = new Etapa(e.nome, e.prazo);
            ne.status = e.status || StatusEtapa.PENDENTE;
            etapas.push(ne);
            return ne;
        });

        at.testes = (a.testes || []).map((t: any) => {
            const found = testes.find(tt => tt.tipo === t.tipo && tt.resultado === t.resultado);
            if (found) return found;
            const nt = new Teste(t.tipo);
            if (t.resultado) nt.executarTeste(t.resultado === 'APROVADO');
            testes.push(nt);
            return nt;
        });

        return at;
    });
}

interface AuthRequest extends express.Request {
    user?: any;
}

function authenticateToken(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    const tokenData = token.split('-');
    if (tokenData.length !== 2) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    const usuario = funcionarios.find(f => f.usuario === tokenData[0]);
    if (!usuario) {
        return res.status(403).json({ error: 'Usuário não encontrado' });
    }

    req.user = usuario;
    next();
}

app.post('/api/auth/register', (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        console.log(`[DEBUG] Tentativa de registro:`, { nome, email });
        
        // Gerar ID único baseado no timestamp
        const id = `user-${Date.now()}`;
        const usuario = email; // Usar email como nome de usuário
        
        // Verificar se o email já existe
        if (funcionarios.find(f => f.usuario === usuario)) {
            console.log(`[DEBUG] Erro: Email ${email} já está em uso`);
            return res.status(400).json({ error: 'Email já está em uso' });
        }

        const { hash, salt } = Funcionario.gerarHash(senha);
        const funcionario = new Funcionario(
            id, 
            nome, 
            '(00) 00000-0000', 
            'Não informado', 
            usuario, 
            hash, 
            salt, 
            NivelPermissao.OPERADOR
        );
        
        funcionarios.push(funcionario);
        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
        
        console.log(`[DEBUG] Usuário registrado com sucesso: ${funcionario.nome} (${funcionario.id})`);
        
        // Gerar token automaticamente para login direto
        const token = `${funcionario.usuario}-${Date.now()}`;
        
        res.status(201).json({
            message: 'Conta criada com sucesso',
            token,
            usuario: {
                id: funcionario.id,
                nome: funcionario.nome,
                nivelPermissao: funcionario.nivelPermissao
            }
        });
    } catch (error) {
        console.error(`[DEBUG] Erro ao registrar usuário:`, error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { usuario, senha } = req.body;

    const funcionario = funcionarios.find(f => f.usuario === usuario);
    if (!funcionario || !funcionario.verificarSenha(senha)) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = `${funcionario.usuario}-${Date.now()}`;
    
    res.json({
        token,
        usuario: {
            id: funcionario.id,
            nome: funcionario.nome,
            nivelPermissao: funcionario.nivelPermissao
        }
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso' });
});

app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
    const user = req.user;
    res.json({
        id: user.id,
        nome: user.nome,
        nivelPermissao: user.nivelPermissao
    });
});

app.get('/api/aeronaves', authenticateToken, (req, res) => {
    res.json(aeronaves);
});

app.get('/api/aeronaves/:codigo', authenticateToken, (req, res) => {
    const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
    if (!aeronave) {
        return res.status(404).json({ error: 'Aeronave não encontrada' });
    }
    res.json(aeronave);
});

app.post('/api/aeronaves', authenticateToken, (req: AuthRequest, res) => {
    try {
        const { codigo, modelo, tipo, capacidade, alcance } = req.body;
        
        if (aeronaves.find(a => a.codigo === codigo)) {
            return res.status(400).json({ error: 'Código já existe' });
        }

        const tipoEnum = tipo.toUpperCase() === 'MILITAR' ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
        const aeronave = new Aeronave(codigo, modelo, tipoEnum, capacidade, alcance);
        
        aeronaves.push(aeronave);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        
        res.status(201).json(aeronave);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/aeronaves/:codigo', authenticateToken, (req: AuthRequest, res) => {
    try {
        const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        const { modelo, tipo, capacidade, alcance } = req.body;
        if (modelo) aeronave.modelo = modelo;
        if (tipo) aeronave.tipo = tipo.toUpperCase() === 'MILITAR' ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
        if (capacidade !== undefined) aeronave.capacidade = capacidade;
        if (alcance !== undefined) aeronave.alcance = alcance;

        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        res.json(aeronave);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:codigo/pecas', authenticateToken, (req, res) => {
    try {
        const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        const { nomePeca } = req.body;
        const peca = pecas.find(p => p.nome === nomePeca);
        if (!peca) {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }

        if (aeronave.pecas.find(p => p.nome === peca.nome)) {
            return res.status(400).json({ error: 'Peça já associada' });
        }

        aeronave.pecas.push(peca);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        res.json(aeronave);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:codigo/etapas', authenticateToken, (req, res) => {
    try {
        const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        const { nomeEtapa } = req.body;
        const etapa = etapas.find(e => e.nome === nomeEtapa);
        if (!etapa) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        if (aeronave.etapas.find(e => e.nome === etapa.nome)) {
            return res.status(400).json({ error: 'Etapa já associada' });
        }

        aeronave.etapas.push(etapa);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        res.json(aeronave);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:codigo/testes', authenticateToken, (req, res) => {
    try {
        const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        const { tipoTeste, resultado } = req.body;
        const teste = new Teste(tipoTeste.toUpperCase() as TipoTeste);
        teste.executarTeste(resultado.toUpperCase() === 'APROVADO');

        aeronave.testes.push(teste);
        testes.push(teste);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        Persistencia.salvarJSON(PATH_TESTES, testes);
        res.json(aeronave);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/aeronaves/:codigo/relatorio', authenticateToken, (req: AuthRequest, res) => {
    try {
        const aeronave = aeronaves.find(a => a.codigo === req.params.codigo);
        if (!aeronave) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        const user = req.user;
        if (![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(user.nivelPermissao)) {
            return res.status(403).json({ error: 'Permissão insuficiente' });
        }

        const { cliente, dataEntrega } = req.body;
        const relatorio = new Relatorio();
        
        const conteudoRelatorio = relatorio.gerar(aeronave, cliente || 'Cliente não informado', dataEntrega || 'Não informada');
        
        relatorio.salvar(aeronave, cliente || 'Cliente não informado', dataEntrega || 'Não informada');
        
        res.json({
            message: conteudoRelatorio,
            arquivo: `relatorio_${aeronave.codigo}_${Date.now()}.txt`
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.get('/api/pecas', authenticateToken, (req, res) => {
    res.json(pecas);
});

app.post('/api/pecas', authenticateToken, (req, res) => {
    try {
        const { nome, tipo, fornecedor } = req.body;
        
        if (pecas.find(p => p.nome === nome)) {
            return res.status(400).json({ error: 'Peça já existe' });
        }

        const tipoEnum = tipo.toUpperCase() as TipoPeca;
        const peca = new Peca(nome, tipoEnum, fornecedor);
        
        pecas.push(peca);
        Persistencia.salvarJSON(PATH_PECAS, pecas);
        
        res.status(201).json(peca);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/pecas/:nome', authenticateToken, (req, res) => {
    try {
        const peca = pecas.find(p => p.nome === req.params.nome);
        if (!peca) {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }

        const { tipo, fornecedor, status } = req.body;
        if (tipo) peca.tipo = tipo.toUpperCase() as TipoPeca;
        if (fornecedor) peca.fornecedor = fornecedor;
        if (status) peca.status = status.toUpperCase() as StatusPeca;

        Persistencia.salvarJSON(PATH_PECAS, pecas);
        res.json(peca);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rotas de Etapas
app.get('/api/etapas', authenticateToken, (req, res) => {
    res.json(etapas);
});

app.post('/api/etapas', authenticateToken, (req, res) => {
    try {
        const { nome, prazo } = req.body;
        
        if (etapas.find(e => e.nome === nome)) {
            return res.status(400).json({ error: 'Etapa já existe' });
        }

        const etapa = new Etapa(nome, prazo);
        
        etapas.push(etapa);
        Persistencia.salvarJSON(PATH_ETAPAS, etapas);
        
        res.status(201).json(etapa);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/etapas/:nome', authenticateToken, (req, res) => {
    try {
        const etapa = etapas.find(e => e.nome === req.params.nome);
        if (!etapa) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        const { prazo, status } = req.body;
        if (prazo) etapa.prazo = prazo;
        if (status) etapa.status = status.toUpperCase() as StatusEtapa;

        Persistencia.salvarJSON(PATH_ETAPAS, etapas);
        res.json(etapa);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.post('/api/etapas/:nome/funcionarios', authenticateToken, (req, res) => {
    try {
        const etapa = etapas.find(e => e.nome === req.params.nome);
        if (!etapa) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        const { idFuncionario } = req.body;
        const funcionario = funcionarios.find(f => f.id === idFuncionario);
        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        if (etapa.funcionarios.find(f => f.id === funcionario.id)) {
            return res.status(400).json({ error: 'Funcionário já associado' });
        }

        etapa.funcionarios.push(funcionario);
        Persistencia.salvarJSON(PATH_ETAPAS, etapas);
        res.json(etapa);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rotas de Funcionários
app.get('/api/funcionarios', authenticateToken, (req, res) => {
    res.json(funcionarios.map(f => ({
        id: f.id,
        nome: f.nome,
        telefone: f.telefone,
        endereco: f.endereco,
        usuario: f.usuario,
        nivelPermissao: f.nivelPermissao
    })));
});

app.post('/api/funcionarios', authenticateToken, (req, res) => {
    try {
        const { id, nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
        
        console.log(`[DEBUG] Dados recebidos para criar funcionário:`, { id, nome, telefone, endereco, usuario, nivelPermissao });
        
        if (funcionarios.find(f => f.id === id)) {
            console.log(`[DEBUG] Erro: ID ${id} já existe`);
            return res.status(400).json({ error: 'ID já existe' });
        }

        if (funcionarios.find(f => f.usuario === usuario)) {
            console.log(`[DEBUG] Erro: Usuário ${usuario} já existe`);
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const { hash, salt } = Funcionario.gerarHash(senha);
        const nivelEnum = nivelPermissao.toUpperCase() as NivelPermissao;
        const funcionario = new Funcionario(id, nome, telefone, endereco, usuario, hash, salt, nivelEnum);
        
        funcionarios.push(funcionario);
        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
        
        console.log(`[DEBUG] Funcionário criado com sucesso: ${funcionario.nome} (${funcionario.id})`);
        
        res.status(201).json({
            id: funcionario.id,
            nome: funcionario.nome,
            telefone: funcionario.telefone,
            endereco: funcionario.endereco,
            usuario: funcionario.usuario,
            nivelPermissao: funcionario.nivelPermissao
        });
    } catch (error) {
        console.error(`[DEBUG] Erro ao criar funcionário:`, error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/funcionarios/:id', authenticateToken, (req, res) => {
    try {
        const funcionario = funcionarios.find(f => f.id === req.params.id);
        if (!funcionario) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        const { nome, telefone, endereco, usuario, senha, nivelPermissao } = req.body;
        
        if (usuario && funcionarios.find(f => f.usuario === usuario && f.id !== funcionario.id)) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        if (nome) funcionario.nome = nome;
        if (telefone) funcionario.telefone = telefone;
        if (endereco) funcionario.endereco = endereco;
        if (usuario) funcionario.usuario = usuario;
        if (nivelPermissao) funcionario.nivelPermissao = nivelPermissao.toUpperCase() as NivelPermissao;
        
        if (senha) {
            const { hash, salt } = Funcionario.gerarHash(senha);
            funcionario.senhaHash = hash;
            funcionario.salt = salt;
        }

        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
        
        res.json({
            id: funcionario.id,
            nome: funcionario.nome,
            telefone: funcionario.telefone,
            endereco: funcionario.endereco,
            usuario: funcionario.usuario,
            nivelPermissao: funcionario.nivelPermissao
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rotas de Testes
app.get('/api/testes', authenticateToken, (req, res) => {
    res.json(testes);
});

app.post('/api/testes', authenticateToken, (req, res) => {
    try {
        const { tipo, resultado } = req.body;
        
        const tipoEnum = tipo.toUpperCase() as TipoTeste;
        const teste = new Teste(tipoEnum);
        teste.executarTeste(resultado.toUpperCase() === 'APROVADO');
        
        testes.push(teste);
        Persistencia.salvarJSON(PATH_TESTES, testes);
        
        res.status(201).json(teste);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.put('/api/testes/:index', authenticateToken, (req, res) => {
    try {
        const index = parseInt(req.params.index);
        if (index < 0 || index >= testes.length) {
            return res.status(404).json({ error: 'Teste não encontrado' });
        }

        const teste = testes[index];
        const { tipo, resultado } = req.body;
        
        if (tipo) teste.tipo = tipo.toUpperCase() as TipoTeste;
        if (resultado) teste.executarTeste(resultado.toUpperCase() === 'APROVADO');

        Persistencia.salvarJSON(PATH_TESTES, testes);
        res.json(teste);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/aeronaves/:codigo', (req, res) => {
    try {
        const codigo = req.params.codigo;
        const index = aeronaves.findIndex(a => a.codigo === codigo);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Aeronave não encontrada' });
        }

        aeronaves.splice(index, 1);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
        
        res.json({ message: 'Aeronave excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE Etapa
app.delete('/api/etapas/:nome', authenticateToken, (req, res) => {
    try {
        const nome = req.params.nome;
        const index = etapas.findIndex(e => e.nome === nome);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Etapa não encontrada' });
        }

        etapas.splice(index, 1);
        Persistencia.salvarJSON(PATH_ETAPAS, etapas);
        
        res.json({ message: 'Etapa excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE Peça
app.delete('/api/pecas/:nome', authenticateToken, (req, res) => {
    try {
        const nome = req.params.nome;
        const index = pecas.findIndex(p => p.nome === nome);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Peça não encontrada' });
        }

        pecas.splice(index, 1);
        Persistencia.salvarJSON(PATH_PECAS, pecas);
        
        res.json({ message: 'Peça excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE Funcionário
app.delete('/api/funcionarios/:id', authenticateToken, (req, res) => {
    try {
        const id = req.params.id;
        const index = funcionarios.findIndex(f => f.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        funcionarios.splice(index, 1);
        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
        
        res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE Teste
app.delete('/api/testes/:index', authenticateToken, (req, res) => {
    try {
        const index = parseInt(req.params.index);
        
        if (index < 0 || index >= testes.length) {
            return res.status(404).json({ error: 'Teste não encontrado' });
        }

        testes.splice(index, 1);
        Persistencia.salvarJSON(PATH_TESTES, testes);
        
        res.json({ message: 'Teste excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ==================== ENDPOINTS DE RELATÓRIOS ====================

// Array para armazenar relatórios
let relatorios: any[] = [];
const PATH_RELATORIOS = 'registros/relatorios.json';

// Carregar relatórios na inicialização
function carregarRelatorios() {
    relatorios = Persistencia.carregarJSON<any>(PATH_RELATORIOS) || [];
}

// GET todos os relatórios
app.get('/api/relatorios', authenticateToken, (req, res) => {
    try {
        res.json(relatorios);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST salvar relatório
app.post('/api/relatorios', authenticateToken, (req, res) => {
    try {
        const { id, aeronaveId, aeronaveCodigo, aeronaveModelo, cliente, dataEntrega, dataGeracao, tipo, arquivo, message } = req.body;
        
        const relatorio = {
            id: id || Date.now().toString(),
            aeronaveId,
            aeronaveCodigo,
            aeronaveModelo,
            cliente,
            dataEntrega,
            dataGeracao: dataGeracao || new Date().toISOString().split('T')[0],
            tipo: tipo || 'entrega',
            arquivo,
            message
        };
        
        relatorios.push(relatorio);
        Persistencia.salvarJSON(PATH_RELATORIOS, relatorios);
        
        res.status(201).json(relatorio);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

app.delete('/api/relatorios/:id', authenticateToken, (req, res) => {
    try {
        const id = req.params.id;
        console.log(`[DEBUG] Tentativa de exclusão do relatório com ID: ${id}`);
        
        const index = relatorios.findIndex(r => r.id === id);
        console.log(`[DEBUG] Índice encontrado: ${index}, Total de relatórios: ${relatorios.length}`);
        
        if (index === -1) {
            console.log(`[DEBUG] Relatório não encontrado com ID: ${id}`);
            return res.status(404).json({ error: 'Relatório não encontrado' });
        }

        relatorios.splice(index, 1);
        Persistencia.salvarJSON(PATH_RELATORIOS, relatorios);
        
        console.log(`[DEBUG] Relatório ${id} excluído com sucesso`);
        res.json({ message: 'Relatório excluído com sucesso' });
    } catch (error) {
        console.error(`[DEBUG] Erro ao excluir relatório:`, error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

function inicializarServidor() {
    carregarDados();
    carregarRelatorios();
    
    app.listen(PORT, () => {
        console.log(`Servidor API executando na porta ${PORT}`);
        console.log(`Aeronaves carregadas: ${aeronaves.length}`);
        console.log(`Peças carregadas: ${pecas.length}`);
        console.log(`Etapas carregadas: ${etapas.length}`);
        console.log(`Funcionários carregados: ${funcionarios.length}`);
        console.log(`Testes carregados: ${testes.length}`);
        console.log(`Relatórios carregados: ${relatorios.length}`);
    });
}

// Middleware de tratamento de erros - DEVE VIR DEPOIS DE TODAS AS ROTAS
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Middleware de rota não encontrada - DEVE SER O ÚLTIMO
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

inicializarServidor();