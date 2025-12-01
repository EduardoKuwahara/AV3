import * as readline from 'readline';
import { Aeronave } from './models/Aeronave';
import { TipoAeronave } from './enums/TipoAeronave';
import { Peca } from './models/Peca';
import { TipoPeca } from './enums/TipoPeca';
import { StatusPeca } from './enums/StatusPeca';
import { Etapa } from './models/Etapa';
import { Funcionario } from './models/Funcionario';
import { Teste } from './models/Teste';
import { TipoTeste } from './enums/TipoTeste';
import { ResultadoTeste } from './enums/ResultadoTeste';
import { Persistencia } from './models/Persistencia';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const PATH_AERONAVES = 'registros/aeronaves.json';
const PATH_PECAS = 'registros/pecas.json';
const PATH_ETAPAS = 'registros/etapas.json';
const PATH_FUNCIONARIOS = 'registros/funcionarios.json';
const PATH_TESTES = 'registros/testes.json';


const pecasRaw = Persistencia.carregarJSON<any>(PATH_PECAS) || [];
function normEnumString(value: string | undefined): string | undefined {
    if (!value) return undefined;
    return value.toString().trim().toUpperCase();
}

let anyNormalized = false;
let pecas: Peca[] = pecasRaw.map(p => {

    if (p.tipo) { const t = normEnumString(p.tipo); if (t && t !== p.tipo) { p.tipo = t; anyNormalized = true; } }
    if (p.status) { const s = normEnumString(p.status); if (s && s !== p.status) { p.status = s; anyNormalized = true; } }
    const obj = new Peca(p.nome, p.tipo, p.fornecedor);
    if (p.status) obj.status = p.status;
    return obj;
});

let funcionariosRaw = Persistencia.carregarJSON<any>(PATH_FUNCIONARIOS) || [];
let funcionariosMigrados = false;
for (const f of funcionariosRaw) {
    if (f.senha && (!f.senhaHash || !f.salt)) {
        const { hash, salt } = Funcionario.gerarHash(f.senha);
        f.senhaHash = hash;
        f.salt = salt;
        delete f.senha;
        funcionariosMigrados = true;
    }
    
    if (f.nivelPermissao) {
        const np = normEnumString(f.nivelPermissao);
        if (np && np !== f.nivelPermissao) { f.nivelPermissao = np; anyNormalized = true; }
    }
}
if (funcionariosMigrados) {
    try {
        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionariosRaw);
        console.log('Migração de senhas concluída: senhas em texto convertidas para hash.');
    } catch (err) {
        console.error('Erro ao salvar migração de senhas:', err);
    }
}
let funcionarios: Funcionario[] = funcionariosRaw.map((f: any) => new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senhaHash || '', f.salt || '', f.nivelPermissao));

const testesRaw = Persistencia.carregarJSON<any>(PATH_TESTES) || [];
let testes: Teste[] = testesRaw.map((t: any) => {
    if (t.tipo) { const tt = normEnumString(t.tipo); if (tt && tt !== t.tipo) { t.tipo = tt; anyNormalized = true; } }
    if (t.resultado) { const rr = normEnumString(t.resultado); if (rr && rr !== t.resultado) { t.resultado = rr; anyNormalized = true; } }
    const ttObj = new Teste(t.tipo);
    if (t.resultado) ttObj.executarTeste(t.resultado === 'APROVADO');
    return ttObj;
});

let usuarioLogado: Funcionario | null = null;

function login(onFailure?: () => void) {
    rl.question('Usuário: ', (usuario) => {
        rl.question('Senha: ', (senha) => {
            const f = funcionarios.find(u => u.usuario === usuario);
            if (!f || !f.verificarSenha(senha)) {
                console.log('Credenciais inválidas.');
                if (onFailure) return onFailure();
                return menuPrincipal();
            }
            usuarioLogado = f;
            console.log(`Login efetuado: ${f.nome} (${f.nivelPermissao})`);
            menuPrincipal();
        });
    });
}

function logout() {
    usuarioLogado = null;
    console.log('Usuário deslogado.');
    menuPrincipal();
}

import { StatusEtapa } from './enums/StatusEtapa';
import { NivelPermissao } from './enums/NivelPermissao';
const etapasRaw = Persistencia.carregarJSON<any>(PATH_ETAPAS) || [];
let etapas: Etapa[] = etapasRaw.map((e: any) => {

    if (e.status) { const st = normEnumString(e.status); if (st && st !== e.status) { e.status = st; anyNormalized = true; } }
    const ep = new Etapa(e.nome, e.prazo);
    ep.status = e.status || StatusEtapa.PENDENTE;
   
    ep.funcionarios = (e.funcionarios || []).map((f: any) => {
        const found = funcionarios.find(ff => ff.id === f.id);
        if (found) return found;
        if (f.nivelPermissao) { const np = normEnumString(f.nivelPermissao); if (np && np !== f.nivelPermissao) { f.nivelPermissao = np; anyNormalized = true; } }
        const nf = new Funcionario(f.id, f.nome, f.telefone, f.endereco, f.usuario, f.senhaHash || f.senha || '', f.salt || '', f.nivelPermissao);
        funcionarios.push(nf);
        return nf;
    });
    return ep;
});

const aeronavesRaw = Persistencia.carregarJSON<any>(PATH_AERONAVES) || [];
let aeronaves: Aeronave[] = aeronavesRaw.map(a => {

    if (a.tipo) { const tt = normEnumString(a.tipo); if (tt && tt !== a.tipo) { a.tipo = tt; anyNormalized = true; } }
    const at = new Aeronave(a.codigo, a.modelo, a.tipo, a.capacidade || 0, a.alcance || 0);

    at.pecas = (a.pecas || []).map((p: any) => {

        if (p.tipo) { const t = normEnumString(p.tipo); if (t && t !== p.tipo) { p.tipo = t; anyNormalized = true; } }
        if (p.status) { const s = normEnumString(p.status); if (s && s !== p.status) { p.status = s; anyNormalized = true; } }
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
        if (t.tipo) { const tt = normEnumString(t.tipo); if (tt && tt !== t.tipo) { t.tipo = tt; anyNormalized = true; } }
        if (t.resultado) { const rr = normEnumString(t.resultado); if (rr && rr !== t.resultado) { t.resultado = rr; anyNormalized = true; } }
        const found = testes.find(tt => tt.tipo === t.tipo && tt.resultado === t.resultado);
        if (found) return found;
        const nt = new Teste(t.tipo);
        if (t.resultado) nt.executarTeste(t.resultado === 'APROVADO');
        testes.push(nt);
        return nt;
    });
    return at;
});


if (anyNormalized) {
    try {
        Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionariosRaw);
        Persistencia.salvarJSON(PATH_PECAS, pecasRaw);
        Persistencia.salvarJSON(PATH_ETAPAS, etapasRaw);
        Persistencia.salvarJSON(PATH_TESTES, testesRaw);
        Persistencia.salvarJSON(PATH_AERONAVES, aeronavesRaw);
        console.log('Arquivos normalizados para uso de chaves MAIÚSCULAS em enums e salvos.');
    } catch (err) {
        console.error('Erro ao salvar normalização:', err);
    }
}

function menuPrincipal() {
    console.log('=== Sistema de Produção de Aeronaves ===');
    console.log(`Usuário logado: ${usuarioLogado ? usuarioLogado.nome + ' (' + usuarioLogado.nivelPermissao + ')' : 'Nenhum'}`);
    console.log('1. Cadastrar Aeronave');
    console.log('2. Listar Aeronaves');
    console.log('3. Cadastrar Peça');
    console.log('4. Listar Peças');
    console.log('5. Cadastrar Etapa');
    console.log('6. Listar Etapas');
    console.log('7. Cadastrar Funcionário');
    console.log('8. Listar Funcionários');
    console.log('9. Cadastrar Teste');
    console.log('10. Listar Testes');
    console.log('11. Associar peça a aeronave');
    console.log('12. Atribuir funcionário a etapa');
    console.log('13. Vincular teste a aeronave');
    console.log('14. Gerar relatório de aeronave (TXT)');
    console.log('15. Editar Aeronave');
    console.log('16. Editar Peça');
    console.log('17. Editar Etapa');
    console.log('18. Editar Funcionário');
    console.log('19. Editar Teste');
    console.log('20. Associar Etapa a Aeronave');
    console.log('0. Sair');
    rl.question('Escolha uma opção: ', (opcao) => {
        switch (opcao) {
            case 'L': login(); break;
            case 'O': logout(); break;
            case '1': cadastrarAeronave(); break;
            case '2': listarAeronaves(); break;
            case '3': cadastrarPeca(); break;
            case '4': listarPecas(); break;
            case '5': cadastrarEtapa(); break;
            case '6': listarEtapas(); break;
            case '7': cadastrarFuncionario(); break;
            case '8': listarFuncionarios(); break;
                case '9': cadastrarTeste(); break;
                case '10': listarTestes(); break;
                case '11': associarPecaAeronave(); break;
                case '12': atribuirFuncionarioAEtapa(); break;
                case '13': vincularTesteAeronave(); break;
                case '14': gerarRelatorioAeronave(); break;
                case '15': editarAeronave(); break;
                case '16': editarPeca(); break;
                case '17': editarEtapa(); break;
                case '18': editarFuncionarioEditar(); break;
                case '19': editarTeste(); break;
                case '20': associarEtapaAeronave(); break;
            case '0': rl.close(); break;
            default: console.log('Opção inválida.'); menuPrincipal();
        }
    });
}

function cadastrarAeronave() {
    rl.question('Código: ', (codigo) => {
        rl.question('Modelo: ', (modelo) => {
            if (aeronaves.find(a => a.codigo === codigo)) {
                console.log(`Erro: já existe uma aeronave com o código '${codigo}'. Escolha outro código.`);
                return menuPrincipal();
            }
            rl.question('Tipo (COMERCIAL/MILITAR): ', (tipoStr) => {
                const upperTipo = tipoStr.toUpperCase();
                let tipo: TipoAeronave;
                if (upperTipo === 'MILITAR' || upperTipo === 'COMERCIAL') {
                    tipo = upperTipo === 'MILITAR' ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL;
                } else {
                    console.log('Tipo inválido. Use COMERCIAL ou MILITAR.');
                    return menuPrincipal();
                }
                rl.question('Capacidade: ', (capacidadeStr) => {
                    rl.question('Alcance: ', (alcanceStr) => {
                        const capacidade = parseInt(capacidadeStr);
                        const alcance = parseInt(alcanceStr);
                        if (isNaN(capacidade) || capacidade < 0) { console.log('Capacidade inválida. Deve ser um número inteiro não-negativo.'); return menuPrincipal(); }
                        if (isNaN(alcance) || alcance < 0) { console.log('Alcance inválido. Deve ser um número inteiro não-negativo.'); return menuPrincipal(); }
                        const aeronave = new Aeronave(codigo, modelo, tipo, capacidade, alcance);
                        aeronaves.push(aeronave);
                        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
                        console.log('Aeronave cadastrada com sucesso!');
                        menuPrincipal();
                    });
                });
            });
        });
    });
}

function listarAeronaves() {
    if (aeronaves.length === 0) {
        console.log('Nenhuma aeronave cadastrada.');
    } else {
        aeronaves.forEach(a => a.detalhes());
    }
    menuPrincipal();
}

function cadastrarPeca() {
    rl.question('Nome da peça: ', (nome) => {
        const nomeTrim = nome.trim();
        if (!nomeTrim) { console.log('Nome da peça obrigatório.'); return menuPrincipal(); }
        if (pecas.find(p => p.nome === nomeTrim)) { console.log(`Já existe uma peça com nome '${nomeTrim}'.`); return menuPrincipal(); }
        rl.question('Tipo (NACIONAL/IMPORTADA): ', (tipoStr) => {
            const upper = tipoStr.toUpperCase().trim();
            if (!['NACIONAL','IMPORTADA'].includes(upper)) { console.log('Tipo inválido. Use NACIONAL ou IMPORTADA.'); return menuPrincipal(); }
            rl.question('Fornecedor: ', (fornecedor) => {
                const fornecedorTrim = fornecedor.trim();
                if (!fornecedorTrim) { console.log('Fornecedor obrigatório.'); return menuPrincipal(); }
                const peca = new Peca(nomeTrim, upper as TipoPeca, fornecedorTrim);
    
                pecas.push(peca);
                Persistencia.salvarJSON(PATH_PECAS, pecas);
                console.log('Peça cadastrada com sucesso!');
                menuPrincipal();
            });
        });
    });
}

function listarPecas() {
    if (pecas.length === 0) {
        console.log('Nenhuma peça cadastrada.');
    } else {
        pecas.forEach(p => console.log(`Peça: ${p.nome}, Tipo: ${p.tipo}, Fornecedor: ${p.fornecedor}, Status: ${p.status}`));
    }
    menuPrincipal();
}

function cadastrarEtapa() {
    rl.question('Nome da etapa: ', (nome) => {
        const nomeTrim = nome.trim();
        if (!nomeTrim) { console.log('Nome da etapa obrigatório.'); return menuPrincipal(); }
        if (etapas.find(e => e.nome === nomeTrim)) { console.log(`Já existe uma etapa com nome '${nomeTrim}'.`); return menuPrincipal(); }
        rl.question('Prazo: ', (prazo) => {
            const prazoTrim = prazo.trim();
            if (!prazoTrim) { console.log('Prazo obrigatório.'); return menuPrincipal(); }
            const etapa = new Etapa(nomeTrim, prazoTrim);
            etapas.push(etapa);
            Persistencia.salvarJSON(PATH_ETAPAS, etapas);
            console.log('Etapa cadastrada com sucesso!');
            menuPrincipal();
        });
    });
}

function listarEtapas() {
    if (etapas.length === 0) {
        console.log('Nenhuma etapa cadastrada.');
    } else {
        etapas.forEach(e => console.log(`Etapa: ${e.nome}, Prazo: ${e.prazo}, Status: ${e.status}`));
    }
    menuPrincipal();
}

function cadastrarFuncionario() {
    rl.question('ID: ', (id) => {
        const idTrim = id.trim();
        if (!idTrim) { console.log('ID obrigatório.'); return menuPrincipal(); }
        rl.question('Nome: ', (nome) => {
            const nomeTrim = nome.trim();
            if (!nomeTrim) { console.log('Nome obrigatório.'); return menuPrincipal(); }
    
            if (funcionarios.find(f => f.id === idTrim)) { console.log(`Erro: já existe um funcionário com o ID '${idTrim}'. Escolha outro ID.`); return menuPrincipal(); }
            rl.question('Telefone: ', (telefone) => {
                rl.question('Endereço: ', (endereco) => {
                    rl.question('Usuário: ', (usuario) => {
                        const usuarioTrim = usuario.trim();
                        if (!usuarioTrim) { console.log('Usuário obrigatório.'); return menuPrincipal(); }
                        if (funcionarios.find(f => f.usuario === usuarioTrim)) { console.log(`Erro: usuário '${usuarioTrim}' já em uso.`); return menuPrincipal(); }
                        rl.question('Senha: ', (senha) => {
                            rl.question('Nível de permissão (ADMINISTRADOR/ENGENHEIRO/OPERADOR): ', (nivelPermissao) => {
                                const upper = nivelPermissao.toUpperCase();
                                if (!['ADMINISTRADOR','ENGENHEIRO','OPERADOR'].includes(upper)) { console.log('Nível de permissão inválido.'); return menuPrincipal(); }
                      
                                const { hash, salt } = Funcionario.gerarHash(senha);
                                let nivelEnum: NivelPermissao;
                                if (upper === 'ADMINISTRADOR') nivelEnum = NivelPermissao.ADMINISTRADOR;
                                else if (upper === 'ENGENHEIRO') nivelEnum = NivelPermissao.ENGENHEIRO;
                                else nivelEnum = NivelPermissao.OPERADOR;
                                const funcionario = new Funcionario(idTrim, nomeTrim, telefone, endereco, usuarioTrim, hash, salt, nivelEnum);
                                funcionarios.push(funcionario);
                                Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
                                console.log('Funcionário cadastrado com sucesso!');
                                menuPrincipal();
                            });
                        });
                    });
                });
            });
        });
    });
}

function listarFuncionarios() {
    if (funcionarios.length === 0) {
        console.log('Nenhum funcionário cadastrado.');
    } else {
        funcionarios.forEach(f => console.log(`ID: ${f.id}, Nome: ${f.nome}, Permissão: ${f.nivelPermissao}`));
    }
    menuPrincipal();
}

function cadastrarTeste() {
    rl.question('Tipo de teste (ELETRICO/HIDRAULICO/AERODINAMICO): ', (tipo) => {
        const tipoU = tipo.toUpperCase().trim();
        if (!['ELETRICO','HIDRAULICO','AERODINAMICO'].includes(tipoU)) { console.log('Tipo de teste inválido.'); return menuPrincipal(); }
        rl.question('Resultado (APROVADO/REPROVADO): ', (resultado) => {
            const resU = resultado.toUpperCase().trim();
            if (!['APROVADO','REPROVADO'].includes(resU)) { console.log('Resultado inválido.'); return menuPrincipal(); }
            const t = new Teste(tipoU as TipoTeste);
            t.executarTeste(resU === 'APROVADO');
            testes.push(t);
            Persistencia.salvarJSON(PATH_TESTES, testes);
            console.log('Teste cadastrado com sucesso!');
            menuPrincipal();
        });
    });
}


function associarPecaAeronave() {
    if (aeronaves.length === 0 || pecas.length === 0) {
        console.log('É necessário ter pelo menos uma aeronave e uma peça cadastradas.');
        return menuPrincipal();
    }
    console.log('Aeronaves disponíveis:'); aeronaves.forEach(a => console.log(`- ${a.codigo}: ${a.modelo}`));
    rl.question('Digite o código da aeronave: ', (codigo) => {
        const aeronave = aeronaves.find(a => a.codigo === codigo);
        if (!aeronave) { console.log('Aeronave não encontrada.'); return menuPrincipal(); }
        console.log('Peças disponíveis:'); pecas.forEach((p, idx) => console.log(`${idx+1}. ${p.nome} (${p.fornecedor}) - ${p.status}`));
        rl.question('Digite o número da peça a associar: ', (numStr) => {
            const idx = parseInt(numStr) - 1;
            if (isNaN(idx) || idx < 0 || idx >= pecas.length) { console.log('Peça inválida.'); return menuPrincipal(); }
            const peca = pecas[idx];

            if (aeronave.pecas.find(p => p.nome === peca.nome)) { console.log('Peça já associada a esta aeronave.'); return menuPrincipal(); }
            aeronave.pecas.push(peca);
            Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
            console.log('Peça associada com sucesso!');
            menuPrincipal();
        });
    });
}


function atribuirFuncionarioAEtapa() {
    if (funcionarios.length === 0 || etapas.length === 0) {
        console.log('É necessário ter pelo menos uma etapa e um funcionário cadastrados.');
        return menuPrincipal();
    }
    console.log('Etapas disponíveis:'); etapas.forEach((e, i) => console.log(`${i+1}. ${e.nome} (${e.status})`));
    rl.question('Digite o número da etapa: ', (etStr) => {
        const eidx = parseInt(etStr) - 1;
        if (isNaN(eidx) || eidx < 0 || eidx >= etapas.length) { console.log('Etapa inválida.'); return menuPrincipal(); }
        const etapa = etapas[eidx];
        console.log('Funcionários disponíveis:'); funcionarios.forEach((f, i) => console.log(`${i+1}. ${f.nome} (ID: ${f.id})`));
        rl.question('Digite o número do funcionário: ', (fStr) => {
            const fidx = parseInt(fStr) - 1;
            if (isNaN(fidx) || fidx < 0 || fidx >= funcionarios.length) { console.log('Funcionário inválido.'); return menuPrincipal(); }
            const func = funcionarios[fidx];

            if (etapa.funcionarios.find(f => f.id === func.id)) { console.log('Funcionário já associado a esta etapa.'); return menuPrincipal(); }
            etapa.funcionarios.push(func);
            Persistencia.salvarJSON(PATH_ETAPAS, etapas);
            console.log('Funcionário associado à etapa com sucesso!');
            menuPrincipal();
        });
    });
}

function vincularTesteAeronave() {
    if (aeronaves.length === 0 || testes.length === 0) {
        console.log('É necessário ter pelo menos uma aeronave e um teste cadastrados.');
        return menuPrincipal();
    }
    console.log('Aeronaves disponíveis:'); aeronaves.forEach(a => console.log(`- ${a.codigo}: ${a.modelo}`));
    rl.question('Digite o código da aeronave: ', (codigo) => {
        const aeronave = aeronaves.find(a => a.codigo === codigo);
        if (!aeronave) { console.log('Aeronave não encontrada.'); return menuPrincipal(); }
        console.log('Testes disponíveis:'); testes.forEach((t, idx) => console.log(`${idx+1}. ${t.tipo} - ${t.resultado}`));
        rl.question('Digite o número do teste a associar: ', (numStr) => {
            const idx = parseInt(numStr) - 1;
            if (isNaN(idx) || idx < 0 || idx >= testes.length) { console.log('Teste inválido.'); return menuPrincipal(); }
            const teste = testes[idx];
            if (aeronave.testes.find(t => t.tipo === teste.tipo && t.resultado === teste.resultado)) { console.log('Teste já associado a esta aeronave.'); return menuPrincipal(); }
            aeronave.testes.push(teste);
            Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
            console.log('Teste vinculado à aeronave com sucesso!');
            menuPrincipal();
        });
    });
}

function associarEtapaAeronave() {
    if (aeronaves.length === 0 || etapas.length === 0) {
        console.log('É necessário ter pelo menos uma aeronave e uma etapa cadastradas.');
        return menuPrincipal();
    }
    console.log('Aeronaves disponíveis:'); aeronaves.forEach(a => console.log(`- ${a.codigo}: ${a.modelo}`));
    rl.question('Digite o código da aeronave: ', (codigo) => {
        const aeronave = aeronaves.find(a => a.codigo === codigo);
        if (!aeronave) { console.log('Aeronave não encontrada.'); return menuPrincipal(); }
        console.log('Etapas disponíveis:'); etapas.forEach((e, idx) => console.log(`${idx+1}. ${e.nome} (${e.status})`));
        rl.question('Digite o número da etapa a associar: ', (numStr) => {
            const idx = parseInt(numStr) - 1;
            if (isNaN(idx) || idx < 0 || idx >= etapas.length) { console.log('Etapa inválida.'); return menuPrincipal(); }
            const etapa = etapas[idx];
            if (aeronave.etapas.find(e => e.nome === etapa.nome)) { console.log('Etapa já associada a esta aeronave.'); return menuPrincipal(); }
            aeronave.etapas.push(etapa);
            Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
            console.log('Etapa associada com sucesso!');
            menuPrincipal();
        });
    });
}

function editarAeronave() {
    if (aeronaves.length === 0) { console.log('Nenhuma aeronave cadastrada.'); return menuPrincipal(); }
    console.log('Aeronaves:'); aeronaves.forEach((a, i) => console.log(`${i+1}. ${a.codigo} - ${a.modelo}`));
    rl.question('Escolha o número da aeronave a editar: ', (n) => {
        const idx = parseInt(n) - 1; if (isNaN(idx) || idx < 0 || idx >= aeronaves.length) { console.log('Seleção inválida.'); return menuPrincipal(); }
        const a = aeronaves[idx];
        rl.question(`Modelo [${a.modelo}]: `, (modelo) => {
            rl.question(`Tipo [${a.tipo}]: `, (tipoStr) => {
                rl.question(`Capacidade [${a.capacidade}]: `, (capStr) => {
                    rl.question(`Alcance [${a.alcance}]: `, (alcStr) => {
                        const modeloNovo = modelo.trim() || a.modelo;
                        const tipoNovo = tipoStr.trim() ? (tipoStr.toUpperCase() === 'MILITAR' ? TipoAeronave.MILITAR : TipoAeronave.COMERCIAL) : a.tipo;
                        const capacidadeNovo = capStr.trim() ? parseInt(capStr) : a.capacidade;
                        const alcanceNovo = alcStr.trim() ? parseInt(alcStr) : a.alcance;
                        a.modelo = modeloNovo; a.tipo = tipoNovo; a.capacidade = capacidadeNovo; a.alcance = alcanceNovo;
                        Persistencia.salvarJSON(PATH_AERONAVES, aeronaves);
                        console.log('Aeronave atualizada.'); menuPrincipal();
                    });
                });
            });
        });
    });
}

function editarPeca() {
    if (pecas.length === 0) { console.log('Nenhuma peça cadastrada.'); return menuPrincipal(); }
    pecas.forEach((p, i) => console.log(`${i+1}. ${p.nome} - ${p.fornecedor} (${p.status})`));
    rl.question('Número da peça a editar: ', (n) => {
        const idx = parseInt(n) - 1; if (isNaN(idx) || idx < 0 || idx >= pecas.length) { console.log('Seleção inválida.'); return menuPrincipal(); }
        const p = pecas[idx];
        rl.question(`Nome [${p.nome}]: `, (nome) => {
            rl.question(`Tipo [${p.tipo}]: `, (tipo) => {
                rl.question(`Fornecedor [${p.fornecedor}]: `, (forn) => {
                    rl.question(`Status [${p.status}]: `, (status) => {
                        p.nome = nome.trim() || p.nome;
                        p.tipo = tipo.trim() ? (tipo.toUpperCase() as unknown as TipoPeca) : p.tipo;
                        p.fornecedor = forn.trim() || p.fornecedor;
                        p.status = status.trim() ? (status.toUpperCase() as unknown as StatusPeca) : p.status;
                        Persistencia.salvarJSON(PATH_PECAS, pecas);
                        console.log('Peça atualizada.'); menuPrincipal();
                    });
                });
            });
        });
    });
}


function editarEtapa() {
    if (etapas.length === 0) { console.log('Nenhuma etapa cadastrada.'); return menuPrincipal(); }
    etapas.forEach((e, i) => console.log(`${i+1}. ${e.nome} - ${e.prazo} (${e.status})`));
    rl.question('Número da etapa a editar: ', (n) => {
        const idx = parseInt(n) - 1; if (isNaN(idx) || idx < 0 || idx >= etapas.length) { console.log('Seleção inválida.'); return menuPrincipal(); }
        const e = etapas[idx];
        rl.question(`Nome [${e.nome}]: `, (nome) => {
            rl.question(`Prazo [${e.prazo}]: `, (prazo) => {
                rl.question(`Status [${e.status}]: `, (status) => {
                    e.nome = nome.trim() || e.nome; e.prazo = prazo.trim() || e.prazo; e.status = status.trim() ? (status.toUpperCase() as unknown as StatusEtapa) : e.status;
                    Persistencia.salvarJSON(PATH_ETAPAS, etapas);
                    console.log('Etapa atualizada.'); menuPrincipal();
                });
            });
        });
    });
}


function editarFuncionarioEditar() {
    if (funcionarios.length === 0) { console.log('Nenhum funcionário cadastrado.'); return menuPrincipal(); }
    funcionarios.forEach((f, i) => console.log(`${i+1}. ${f.nome} (ID: ${f.id})`));
    rl.question('Número do funcionário a editar: ', (n) => {
        const idx = parseInt(n) - 1; if (isNaN(idx) || idx < 0 || idx >= funcionarios.length) { console.log('Seleção inválida.'); return menuPrincipal(); }
        const f = funcionarios[idx];
        rl.question(`Nome [${f.nome}]: `, (nome) => {
            rl.question(`Telefone [${f.telefone}]: `, (tel) => {
                rl.question(`Endereço [${f.endereco}]: `, (end) => {
                    rl.question(`Usuário [${f.usuario}]: `, (usu) => {
                        rl.question('Senha (deixe em branco para manter): ', (senha) => {
                            rl.question(`Nível [${f.nivelPermissao}]: `, (nivel) => {
                                f.nome = nome.trim() || f.nome; f.telefone = tel.trim() || f.telefone; f.endereco = end.trim() || f.endereco;
                                if (usu.trim() && usuariosExiste(usu.trim(), f.id)) { console.log('Usuário já em uso.'); return menuPrincipal(); }
                                f.usuario = usu.trim() || f.usuario;
                                if (senha.trim()) { const { hash, salt } = Funcionario.gerarHash(senha); f.senhaHash = hash; f.salt = salt; }
                                f.nivelPermissao = nivel.trim() ? nivel.trim() as any : f.nivelPermissao;
                                Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
                                console.log('Funcionário atualizado.'); menuPrincipal();
                            });
                        });
                    });
                });
            });
        });
    });
}

function usuariosExiste(usuario: string, ignoreId?: string) {
    return funcionarios.some(f => f.usuario === usuario && f.id !== ignoreId);
}


function editarTeste() {
    if (testes.length === 0) { console.log('Nenhum teste cadastrado.'); return menuPrincipal(); }
    testes.forEach((t, i) => console.log(`${i+1}. ${t.tipo} - ${t.resultado}`));
    rl.question('Número do teste a editar: ', (n) => {
        const idx = parseInt(n) - 1; if (isNaN(idx) || idx < 0 || idx >= testes.length) { console.log('Seleção inválida.'); return menuPrincipal(); }
        const t = testes[idx];
        rl.question(`Tipo [${t.tipo}]: `, (tipo) => {
            rl.question(`Resultado [${t.resultado}]: `, (res) => {
                t.tipo = tipo.trim() ? tipo.toUpperCase() as any : t.tipo;
                t.resultado = res.trim() ? res.toUpperCase() as any : t.resultado;
                Persistencia.salvarJSON(PATH_TESTES, testes);
                console.log('Teste atualizado.'); menuPrincipal();
            });
        });
    });
}

function listarTestes() {
    if (testes.length === 0) {
        console.log('Nenhum teste cadastrado.');
    } else {
        testes.forEach(t => console.log(`Tipo: ${t.tipo}, Resultado: ${t.resultado}`));
    }
    menuPrincipal();
}

function cadastrarUsuarioStartup() {
    console.log('--- Cadastro de usuário ---');
    rl.question('ID (ex: u001): ', (id) => {
        const idTrim = id.trim();
        if (!idTrim) { console.log('ID obrigatório.'); return inicialAuth(); }
        if (funcionarios.find(f => f.id === idTrim)) { console.log(`Erro: já existe um funcionário com o ID '${idTrim}'. Escolha outro ID.`); return inicialAuth(); }
        rl.question('Nome: ', (nome) => {
            const nomeTrim = nome.trim();
            if (!nomeTrim) { console.log('Nome obrigatório.'); return inicialAuth(); }
            rl.question('Telefone: ', (telefone) => {
                rl.question('Endereço: ', (endereco) => {
                    rl.question('Usuário: ', (usuario) => {
                        const usuarioTrim = usuario.trim();
                        if (!usuarioTrim) { console.log('Usuário obrigatório.'); return inicialAuth(); }
                        if (funcionarios.find(f => f.usuario === usuarioTrim)) { console.log(`Erro: usuário '${usuarioTrim}' já em uso.`); return inicialAuth(); }
                        rl.question('Senha: ', (senha) => {
                            rl.question('Nível de permissão (ADMINISTRADOR/ENGENHEIRO/OPERADOR): ', (nivelPermissao) => {
                                const upper = nivelPermissao.toUpperCase();
                                if (!['ADMINISTRADOR','ENGENHEIRO','OPERADOR'].includes(upper)) { console.log('Nível de permissão inválido.'); return inicialAuth(); }
                                const { hash, salt } = Funcionario.gerarHash(senha);
                                let nivelEnum: NivelPermissao;
                                if (upper === 'ADMINISTRADOR') nivelEnum = NivelPermissao.ADMINISTRADOR;
                                else if (upper === 'ENGENHEIRO') nivelEnum = NivelPermissao.ENGENHEIRO;
                                else nivelEnum = NivelPermissao.OPERADOR;
                                const funcionario = new Funcionario(idTrim, nomeTrim, telefone, endereco, usuarioTrim, hash, salt, nivelEnum);
                                funcionarios.push(funcionario);
                                Persistencia.salvarJSON(PATH_FUNCIONARIOS, funcionarios);
                                console.log('Funcionário cadastrado com sucesso! Retornando ao menu de autenticação.');
                                inicialAuth();
                            });
                        });
                    });
                });
            });
        });
    });
}

function inicialAuth() {
    if (funcionarios.length === 0) {
        console.log('Nenhum usuário encontrado. É necessário criar o usuário administrador inicial.');
        return cadastrarUsuarioStartup();
    }
    console.log('=== Autenticação ===');
    console.log('1. Entrar (login)');
    console.log('2. Cadastrar novo usuário');
    console.log('0. Sair');
    rl.question('Escolha: ', (opt) => {
        switch (opt) {
            case '1': login(() => inicialAuth()); break;
            case '2': cadastrarUsuarioStartup(); break;
            case '0': rl.close(); break;
            default: console.log('Opção inválida.'); inicialAuth();
        }
    });
}

import { Relatorio } from './models/Relatorio';

function gerarRelatorioAeronave() {
    if (aeronaves.length === 0) { console.log('Nenhuma aeronave cadastrada.'); return menuPrincipal(); }
    if (!usuarioLogado || ![NivelPermissao.ADMINISTRADOR, NivelPermissao.ENGENHEIRO].includes(usuarioLogado.nivelPermissao)) {
        console.log('Ação restrita. Apenas usuários com permissão ADMINISTRADOR ou ENGENHEIRO podem gerar relatórios.');
        return menuPrincipal();
    }
    console.log('Aeronaves disponíveis:'); aeronaves.forEach(a => console.log(`- ${a.codigo}: ${a.modelo}`));
    rl.question('Digite o código da aeronave para gerar relatório: ', (codigo) => {
        const aeronave = aeronaves.find(a => a.codigo === codigo);
        if (!aeronave) { console.log('Aeronave não encontrada.'); return menuPrincipal(); }
        rl.question('Nome do cliente: ', (cliente) => {
            rl.question('Data de entrega (DD-MM-AAAA): ', (dataEntrega) => {
                const rel = new Relatorio();
                rel.salvar(aeronave, cliente || 'Cliente não informado', dataEntrega || 'Não informada');
                menuPrincipal();
            });
        });
    });
}

inicialAuth();